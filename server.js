import express from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Git-pilot api is alive!`");
});

app.get('/api/commit-message', (req, res) => {

    const { intent, diff } = req.body;
    console.log(`Received request with intent: ${intent}`);

    res.json({
        message: 'feat: this is a placeholder message. The AI will generate a real message here.'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});