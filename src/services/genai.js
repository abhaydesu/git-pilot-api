import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export default genAI;