import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import "./helpers.js";
import app from "../src/app.js";

// One shared server: a fresh server per request occasionally gets a 400 from a
// recycled keep-alive socket (Node/undici), which made these tests flaky.
const server = app.listen(0);
after(() => server.close());

const cases = [
  ["/api/pilot-commit", {}, /"diff" is required/],
  ["/api/pilot-commit", { diff: 5 }, /"diff" must be a string/],
  [
    "/api/pilot-commit",
    { diff: "x", intent: "y".repeat(1001) },
    /"intent" must be at most/,
  ],
  ["/api/pilot-run", {}, /"request" is required/],
  ["/api/pilot-run", { request: "   " }, /"request" is required/],
  ["/api/pilot-undo", {}, /"reflog" is required/],
  [
    "/api/pilot-branch",
    { description: "x".repeat(501) },
    /"description" must be at most/,
  ],
];

for (const [path, body, message] of cases) {
  test(`POST ${path} ${JSON.stringify(body).slice(0, 40)} -> 400`, async () => {
    const res = await request(server)
      .post(path)

      .send(body);
    assert.equal(res.status, 400);
    assert.match(res.body.error, message);
  });
}

test("malformed JSON -> 400", async () => {
  const res = await request(server)
    .post("/api/pilot-run")
    .set("content-type", "application/json")
    .send("{nope");
  assert.equal(res.status, 400);
});

test("oversized body -> 413", async () => {
  const res = await request(server)
    .post("/api/pilot-commit")
    .send({ diff: "x".repeat(1_100_000) });
  assert.equal(res.status, 413);
});

test("unknown route -> 404 JSON", async () => {
  const res = await request(server).get("/api/nope");
  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});
