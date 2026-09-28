import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { mockGemini } from "./helpers.js";
import { createApp } from "../src/app.js";

const server = createApp({ rateLimitPerMinute: 3 }).listen(0);
after(() => server.close());

test("rate limits per client with a JSON 429", async () => {
  mockGemini("fix/x");
  const body = { description: "x" };
  for (let i = 0; i < 3; i++) {
    const ok = await request(server).post("/api/pilot-branch").send(body);
    assert.equal(ok.status, 200);
  }
  const limited = await request(server).post("/api/pilot-branch").send(body);
  assert.equal(limited.status, 429);
  assert.match(limited.body.error, /Too many requests/);
});

test("does not advertise Express or enable CORS", async () => {
  const s = createApp().listen(0);
  try {
    const res = await request(s)
      .post("/api/pilot-undo")
      .set("Origin", "https://evil.example")
      .send({ reflog: "a" });
    assert.equal(res.status, 200);
    assert.equal(res.headers["x-powered-by"], undefined);
    assert.equal(res.headers["access-control-allow-origin"], undefined);
  } finally {
    s.close();
  }
});

test("the client IP comes from X-Forwarded-For, so one client cannot exhaust another's quota", async () => {
  const app = createApp({ rateLimitPerMinute: 1 });
  const s = app.listen(0);
  try {
    const hit = (ip) =>
      request(s)
        .post("/api/pilot-undo")
        .set("X-Forwarded-For", ip)
        .send({ reflog: "a" });
    assert.equal((await hit("203.0.113.1")).status, 200);
    assert.equal((await hit("203.0.113.1")).status, 429);
    assert.equal((await hit("203.0.113.2")).status, 200);
  } finally {
    s.close();
  }
});
