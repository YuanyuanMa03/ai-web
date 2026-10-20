import { describe, expect, test } from "bun:test";
import { APICallError } from "ai";
import { describeError } from "@/lib/errors";

const apiError = (statusCode: number, responseBody?: string, message = "") =>
  new APICallError({
    message,
    url: "https://api.example.com/v1/chat/completions",
    requestBodyValues: {},
    statusCode,
    responseBody,
  });

describe("describeError", () => {
  test("401 explains the key is wrong, even when statusText is empty (HTTP/2)", () => {
    const text = describeError(
      apiError(401, '{"message":"Api key is invalid","code":20015}'),
    );

    expect(text).toContain("AI_API_KEY");
    expect(text).toContain("Api key is invalid");
  });

  test("429 explains rate limit / quota", () => {
    expect(describeError(apiError(429, ""))).toContain("额度");
  });

  test("404 points at AI_BASE_URL and AI_MODELS", () => {
    const text = describeError(apiError(404, "<html>not found</html>"));

    expect(text).toContain("AI_BASE_URL");
    expect(text).toContain("AI_MODELS");
    expect(text).not.toContain("<html>");
  });

  test("reads OpenAI-style {error:{message}} bodies for other statuses", () => {
    const text = describeError(
      apiError(400, '{"error":{"message":"Model does not exist."}}'),
    );

    expect(text).toContain("Model does not exist.");
  });

  test("never returns an empty string", () => {
    expect(describeError(apiError(500, ""))).not.toBe("");
    expect(describeError(new Error(""))).not.toBe("");
    expect(describeError("weird")).not.toBe("");
  });

  test("passes through plain error messages such as connection failures", () => {
    expect(describeError(new Error("Cannot connect to API: boom"))).toContain(
      "Cannot connect to API: boom",
    );
  });

  test("truncates very long upstream bodies", () => {
    const text = describeError(apiError(500, "x".repeat(5000)));

    expect(text.length).toBeLessThan(400);
  });
});
