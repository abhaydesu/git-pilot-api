import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/commit-message", async (req, res) => {
  try {
    const { intent, diff } = req.body;

    const prompt = ` 
        You are an expert programmer writing a Git commit message.
        Analyze the following code diff and the user's intent to generate a commit message that follows the Conventional Commits specification. The output must be only the commit message itself, with a subject line, a blank line, and bullet points for the body if necessary. Do not include any
        other text, explanation, or markdown formatting.

        User's intent: '${intent}'

        Git Diff:
        \`\`\`diff
        ${diff}
        \`\`\`
        `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const commitMessage = response.text().trim();

    res.json({ message: commitMessage });
  } catch (error) {
    console.error("Error calling Gemini API: ", error);
    res.status(500).json({
      error: "Failed to generate commit message.",
    });
  }
});

app.post("/api/git-command", async (req, res) => {
  try {
    const { request } = req.body;

    const prompt = `You are an expert in Git. Translate the following user request into a single, executable, and safe Git command.
        - The user's request is: "${request}".
        - Output ONLY the Git command itself.
        - Do not provide any explanation, comments, or markdown formatting like \`\`\`.
        - Prioritize safe, common commands. Avoid destructive commands like 'git reset --hard' unless the user's intent is explicitly and unmistakably clear.
        - If the request is ambiguous or could be destructive (e.g., "delete all my work"), respond with the text: "Error: Ambiguous or potentially destructive command."`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const gitCommand = response.text().trim();

    res.json({ command: gitCommand });
  } catch (error) {
    console.error("Error in /api/git-command: ", error);
    res.status(500).json({
      error: "Failed to generate Git command.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
