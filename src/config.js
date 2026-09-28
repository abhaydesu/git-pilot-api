import "dotenv/config";

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  port: Number(process.env.PORT) || 3000,
  bodyLimit: "1mb",
};

export function assertConfig() {
  if (!config.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in."
    );
  }
}
