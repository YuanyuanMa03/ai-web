import { describe, expect, test } from "bun:test";
import {
  type Brand,
  DEFAULT_BASE_URL,
  DEFAULT_MODELS,
  detectBrand,
  getAIConfig,
  toPublicConfig,
} from "@/lib/config";

describe("getAIConfig", () => {
  test("only an API key is needed: default base URL and default free models", () => {
    const config = getAIConfig({ AI_API_KEY: "sk-test" });

    expect(config.apiKey).toBe("sk-test");
    expect(config.baseURL).toBe(DEFAULT_BASE_URL);
    expect(config.models.map((m) => m.id)).toEqual(DEFAULT_MODELS);
    expect(config.configured).toBe(true);
  });

  test("missing API key is reported as not configured", () => {
    const config = getAIConfig({});

    expect(config.configured).toBe(false);
    expect(config.models.length).toBeGreaterThan(0);
  });

  test("blank API key counts as missing", () => {
    expect(getAIConfig({ AI_API_KEY: "   " }).configured).toBe(false);
  });

  test("parses AI_MODELS: trims, drops empties, de-duplicates, keeps order", () => {
    const config = getAIConfig({
      AI_API_KEY: "k",
      AI_MODELS: " a/one , ,b/two,a/one, deepseek/deepseek-chat-v3:free ",
    });

    expect(config.models.map((m) => m.id)).toEqual([
      "a/one",
      "b/two",
      "deepseek/deepseek-chat-v3:free",
    ]);
  });

  test("display name is the part after the last slash", () => {
    const config = getAIConfig({
      AI_API_KEY: "k",
      AI_MODELS: "Qwen/Qwen3-8B,gpt-4o",
    });

    expect(config.models.map((m) => m.name)).toEqual(["Qwen3-8B", "gpt-4o"]);
  });

  test("custom base URL is used and trailing slashes are stripped", () => {
    const config = getAIConfig({
      AI_API_KEY: "k",
      AI_BASE_URL: "https://openrouter.ai/api/v1/",
      AI_MODELS: "x/y",
    });

    expect(config.baseURL).toBe("https://openrouter.ai/api/v1");
  });

  test("custom base URL without AI_MODELS has no models (defaults only fit SiliconFlow)", () => {
    const config = getAIConfig({
      AI_API_KEY: "k",
      AI_BASE_URL: "https://openrouter.ai/api/v1",
    });

    expect(config.models).toEqual([]);
    expect(config.configured).toBe(false);
  });

  test("AI_VISION_MODELS marks models as vision and appends ones not listed", () => {
    const config = getAIConfig({
      AI_API_KEY: "k",
      AI_MODELS: "a/text,b/vl",
      AI_VISION_MODELS: "b/vl, c/vl2",
    });

    expect(config.models.map((m) => [m.id, m.vision] as const)).toEqual([
      ["a/text", false],
      ["b/vl", true],
      ["c/vl2", true],
    ]);
  });
});

describe("findModel", () => {
  test("only allows models from the configured list", () => {
    const config = getAIConfig({ AI_API_KEY: "k", AI_MODELS: "a/one" });

    expect(config.findModel("a/one")?.id).toBe("a/one");
    expect(config.findModel("some/expensive-model")).toBeUndefined();
  });
});

describe("toPublicConfig", () => {
  test("never exposes the API key or base URL to the browser", () => {
    const config = getAIConfig({
      AI_API_KEY: "sk-secret",
      AI_BASE_URL: "https://internal.example.com/v1",
      AI_MODELS: "a/one",
    });
    const serialized = JSON.stringify(toPublicConfig(config));

    expect(serialized).not.toContain("sk-secret");
    expect(serialized).not.toContain("internal.example.com");
    expect(toPublicConfig(config)).toEqual({
      configured: true,
      models: [{ id: "a/one", name: "one", vision: false, brand: "default" }],
    });
  });
});

describe("detectBrand", () => {
  test.each([
    ["Qwen/Qwen3-8B", "qwen"],
    ["Qwen/QwQ-32B", "qwen"],
    ["THUDM/GLM-4-9B-0414", "zhipu"],
    ["zai-org/GLM-4.5-Air", "zhipu"],
    ["deepseek-ai/DeepSeek-R1-0528-Qwen3-8B", "deepseek"],
    ["moonshotai/Kimi-K2-Instruct", "kimi"],
    ["meta-llama/llama-3.3-70b-instruct:free", "meta"],
    ["google/gemma-3-27b-it", "google"],
    ["gemini-2.5-flash", "google"],
    ["openai/gpt-oss-20b", "openai"],
    ["mistralai/mistral-7b", "default"],
  ] satisfies [string, Brand][])("%s -> %s", (id, brand) => {
    expect(detectBrand(id)).toBe(brand);
  });
});
