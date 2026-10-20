import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { POST } from "@/app/api/chat/route";

const userMessage = {
  id: "1",
  role: "user",
  parts: [{ type: "text", text: "hi" }],
};

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );

describe("POST /api/chat", () => {
  const saved = { ...process.env };

  beforeEach(() => {
    process.env.AI_API_KEY = "sk-test";
    process.env.AI_BASE_URL = "";
    process.env.AI_MODELS = "a/allowed";
    process.env.AI_VISION_MODELS = "";
  });

  afterEach(() => {
    process.env = { ...saved };
  });

  test("rejects malformed bodies", async () => {
    const res = await post({ messages: [] });
    expect(res.status).toBe(400);
  });

  test("rejects models that are not in AI_MODELS", async () => {
    const res = await post({ messages: [userMessage], model: "x/not-allowed" });
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("x/not-allowed");
  });

  test("explains what to do when the API key is missing", async () => {
    process.env.AI_API_KEY = "";
    const res = await post({ messages: [userMessage], model: "a/allowed" });
    expect(res.status).toBe(503);
    expect(await res.text()).toContain("AI_API_KEY");
  });
});
