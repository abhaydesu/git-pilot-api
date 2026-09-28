import express from "express";
import { rateLimit } from "express-rate-limit";
import pilotRoutes from "./routes/pilotRoutes.js";
import { config } from "./config.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

export function createApp({
  rateLimitPerMinute = config.rateLimitPerMinute,
} = {}) {
  const app = express();

  app.disable("x-powered-by");
  // Behind Vercel's proxy: use the real client IP (for rate limiting), not the proxy's.
  app.set("trust proxy", 1);

  // No CORS: the only client is the CLI, which is not a browser. Add cors() back
  // (with an explicit origin allowlist) if a web client ever needs this API.
  app.use(express.json({ limit: config.bodyLimit }));

  // Every request spends Gemini quota and the API is unauthenticated, so cap it per IP.
  // The default in-memory store is per serverless instance; it blunts casual abuse, but a
  // determined attacker needs a shared store or Vercel's firewall rules.
  app.use(
    "/api",
    rateLimit({
      windowMs: 60_000,
      limit: rateLimitPerMinute,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) =>
        res
          .status(429)
          .json({ error: "Too many requests, please try again later." }),
    }),
    pilotRoutes
  );

  app.get("/", (req, res) => {
    res.redirect(301, "https://gitpilotcli.vercel.app");
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
