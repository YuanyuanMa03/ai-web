import { APICallError, RetryError } from "ai";

const MAX_DETAIL = 200;

const hints: Record<number, string> = {
  401: "API Key 无效或已过期，请检查环境变量 AI_API_KEY",
  402: "账户余额不足，请换用免费模型或充值",
  403: "没有权限使用这个模型，请检查账户实名认证或换一个模型",
  404: "模型或接口地址不存在，请检查 AI_BASE_URL 和 AI_MODELS",
  429: "请求太频繁或免费额度已用完，请稍后再试",
};

// Pull a readable message out of an upstream error body, e.g.
// {"message": "..."} or OpenAI-style {"error": {"message": "..."}}.
const extractMessage = (body?: string) => {
  if (!body) return undefined;
  try {
    const json = JSON.parse(body);
    const message =
      json?.error?.message ??
      json?.message ??
      (typeof json?.error === "string" ? json.error : undefined);
    return typeof message === "string" ? message : undefined;
  } catch {
    // HTML error pages are noise for the user.
    return body.trimStart().startsWith("<") ? undefined : body;
  }
};

const truncate = (text: string) =>
  text.length > MAX_DETAIL ? `${text.slice(0, MAX_DETAIL)}...` : text;

/** Turn a model-provider error into a message a non-developer can act on. */
export function describeError(error: unknown): string {
  // Retryable failures (429, 5xx, network) arrive wrapped after the retries run out.
  if (RetryError.isInstance(error)) {
    return describeError(error.lastError);
  }

  if (APICallError.isInstance(error)) {
    const status = error.statusCode;
    if (!status) {
      // Network failure: the message names the upstream host, which stays private.
      return "无法连接到模型服务，请检查 AI_BASE_URL 是否正确、服务是否可用";
    }
    const detail = extractMessage(error.responseBody) || error.message;
    const parts = [
      hints[status] ?? `模型服务返回错误（${status}）`,
      detail && truncate(detail),
    ].filter(Boolean);
    return parts.join("：");
  }

  if (error instanceof Error && error.message) {
    return truncate(error.message);
  }

  return "模型服务出错，请稍后重试";
}
