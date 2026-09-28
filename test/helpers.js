import { mock } from "node:test";

process.env.GEMINI_API_KEY ||= "test-key";
// Keep the default rate limit out of the way; test/security.test.js covers limiting itself.
process.env.RATE_LIMIT_PER_MINUTE ||= "1000";

/**
 * Replaces fetch so Gemini calls return the given texts in order.
 * Returns the mock, so tests can inspect call count and request bodies.
 */
export function mockGemini(...texts) {
  let i = 0;
  return mock.method(globalThis, "fetch", async () => {
    const text = texts[Math.min(i++, texts.length - 1)];
    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: { role: "model", parts: [{ text }] },
            finishReason: "STOP",
          },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  });
}
