import express from 'express';
import cors from 'cors';

import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Git-pilot api is alive!`");
});

app.post('/api/commit-message',  async (req, res) => {
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

        const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const commitMessage = response.text().trim();

        res.json({message: commitMessage});

    } catch (error) {
        console.error('Error calling Gemini API: ', error);
        res.status(500).json({
            error: 'Failed to generate commit message.'
        })
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});