// Server-side AI configuration, read from environment variables.
// Any OpenAI-compatible API works; SiliconFlow is the default because it has free models.

export const DEFAULT_BASE_URL = "https://api.siliconflow.cn/v1";

// Free models on SiliconFlow at the time of writing; override with AI_MODELS.
export const DEFAULT_MODELS = [
  "Qwen/Qwen3-8B",
  "THUDM/GLM-4-9B-0414",
  "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
];

export type Brand =
  | "qwen"
  | "zhipu"
  | "deepseek"
  | "kimi"
  | "meta"
  | "google"
  | "openai"
  | "default";

export interface ModelInfo {
  id: string;
  name: string;
  vision: boolean;
  brand: Brand;
}

export interface AIConfig {
  apiKey?: string;
  baseURL: string;
  models: ModelInfo[];
  configured: boolean;
  findModel: (id: string) => ModelInfo | undefined;
}

export interface PublicConfig {
  configured: boolean;
  models: ModelInfo[];
}

type Env = Record<string, string | undefined>;

const parseList = (value?: string) => [
  ...new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];

// Order matters: e.g. "DeepSeek-R1-0528-Qwen3-8B" is a DeepSeek model.
const brandRules: [Brand, RegExp][] = [
  ["deepseek", /deepseek/i],
  ["kimi", /kimi|moonshot/i],
  ["zhipu", /glm|thudm|zai-org|zhipu/i],
  ["qwen", /qwen|qwq/i],
  ["meta", /llama/i],
  ["google", /gemma|gemini|google/i],
  ["openai", /gpt|openai/i],
];

export const detectBrand = (id: string): Brand =>
  brandRules.find(([, pattern]) => pattern.test(id))?.[0] ?? "default";

export function getAIConfig(env: Env = process.env): AIConfig {
  const apiKey = env.AI_API_KEY?.trim() || undefined;
  const baseURL = (env.AI_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );

  let ids = parseList(env.AI_MODELS);
  if (ids.length === 0 && baseURL === DEFAULT_BASE_URL) {
    ids = DEFAULT_MODELS;
  }
  const visionIds = parseList(env.AI_VISION_MODELS);
  for (const id of visionIds) {
    if (!ids.includes(id)) ids = [...ids, id];
  }

  const models = ids.map((id) => ({
    id,
    name: id.split("/").pop() || id,
    vision: visionIds.includes(id),
    brand: detectBrand(id),
  }));

  return {
    apiKey,
    baseURL,
    models,
    configured: Boolean(apiKey) && models.length > 0,
    findModel: (id) => models.find((m) => m.id === id),
  };
}

export const toPublicConfig = ({
  configured,
  models,
}: AIConfig): PublicConfig => ({ configured, models });
