import courseEmbeddingModel from '../Schemas/courseEmbedding.schema.js';
import { embedText } from './geminiClient.js';

function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default async function recommendCourses(query) {
    const queryEmbedding = await embedText(query);

    const allCourses = await courseEmbeddingModel.find({});

    const scored = allCourses.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        category: course.category,
        score: cosineSimilarity(queryEmbedding, course.embedding)
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 5);
}
