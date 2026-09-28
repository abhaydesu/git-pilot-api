import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, assertConfig } from "../config.js";

let client;

/** Sends a prompt to Gemini and returns the trimmed text of the reply. */
export async function generate(prompt) {
  assertConfig();
  client ??= new GoogleGenerativeAI(config.geminiApiKey);
  const model = client.getGenerativeModel({ model: config.geminiModel });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
