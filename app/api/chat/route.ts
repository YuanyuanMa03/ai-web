import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  convertToModelMessages,
  extractReasoningMiddleware,
  streamText,
  wrapLanguageModel,
} from "ai";
import { z } from "zod";
import { getAIConfig } from "@/lib/config";
import type { Message } from "@/lib/db";
import { describeError } from "@/lib/errors";

const chatSchema = z.object({
  messages: z.array(z.any()).min(1),
  model: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = chatSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new Response("请求格式不正确", { status: 400 });
  }

  const config = getAIConfig();
  if (!config.apiKey) {
    return new Response(
      "站点还没配置模型 API Key：请在部署平台设置环境变量 AI_API_KEY 后重新部署。",
      { status: 503 },
    );
  }

  const model = config.findModel(parsed.data.model);
  if (!model) {
    return new Response(
      `模型 ${parsed.data.model} 不在 AI_MODELS 列表中，请刷新页面后重新选择。`,
      { status: 400 },
    );
  }

  const provider = createOpenAICompatible({
    name: "ai",
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  let messages = parsed.data.messages as Message[];
  if (!model.vision) {
    // Text-only models reject image parts, so drop any left over from a vision model.
    messages = messages.map((m) => ({
      ...m,
      parts: m.parts.filter((p) => p.type !== "file"),
    }));
  }

  const result = streamText({
    // Some models stream their reasoning inside <think> tags instead of a separate field.
    model: wrapLanguageModel({
      model: provider.chatModel(model.id),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    messages: await convertToModelMessages(messages),
    system:
      "You are a helpful assistant. Follow the user's instructions carefully. Respond using Markdown.",
  });

  return result.toUIMessageStreamResponse({ onError: describeError });
}
