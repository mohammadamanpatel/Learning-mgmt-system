import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from "dotenv";
config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

const chatModel = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

export async function embedText(text) {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}

export async function generateText(prompt) {
    const result = await chatModel.generateContent(prompt);
    return result.response.text();
}
