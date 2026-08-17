import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import courseModel from '../Schemas/course.schema.js';
import courseEmbeddingModel from '../Schemas/courseEmbedding.schema.js';
import { embedText, generateText } from '../utils/geminiClient.js';

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const testQueries = [
    'I want to learn React and build frontend apps',
    'teach me backend development with Node.js',
    'I want to become a data scientist',
    'full stack web development from scratch',
    'how to build mobile apps for Android and iOS',
    'learn cloud computing and DevOps'
];

async function run() {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB:', connection.host);

        // Step 1: Sync embeddings
        console.log('\n--- STEP 1: Syncing embeddings ---');
        const courses = await courseModel.find({});
        console.log(`Found ${courses.length} courses in DB.`);

        for (const course of courses) {
            const existing = await courseEmbeddingModel.findOne({ courseId: course._id });
            if (existing) {
                console.log(`  Skipped (already embedded): ${course.title}`);
                continue;
            }
            const text = `${course.title} ${course.description} ${course.category}`;
            const embedding = await embedText(text);
            await courseEmbeddingModel.findOneAndUpdate(
                { courseId: course._id },
                {
                    courseId: course._id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    embedding
                },
                { upsert: true, new: true }
            );
            console.log(`  Embedded: ${course.title}`);
        }
        console.log('Embeddings sync complete.');

        // Step 2: Test queries
        console.log('\n--- STEP 2: Testing recommendations ---');

        for (const query of testQueries) {
            console.log(`\n========================================`);
            console.log(`QUERY: "${query}"`);
            console.log(`========================================`);

            const queryEmbedding = await embedText(query);
            const allEmbeddings = await courseEmbeddingModel.find({});

            const scored = allEmbeddings.map((doc) => ({
                title: doc.title,
                category: doc.category,
                score: cosineSimilarity(queryEmbedding, doc.embedding)
            }));
            scored.sort((a, b) => b.score - a.score);

            const top3 = scored.slice(0, 3);
            console.log('\nTop 3 matches:');
            top3.forEach((c, i) => {
                console.log(`  ${i + 1}. ${c.title} [${c.category}] — ${(c.score * 100).toFixed(1)}%`);
            });

            const courseList = top3.map((c, i) =>
                `${i + 1}. ${c.title} — Category: ${c.category} (relevance: ${(c.score * 100).toFixed(0)}%)`
            ).join('\n');

            const prompt = `You are a helpful course recommendation assistant for an LMS platform.

User query: "${query}"

Here are the most relevant courses found:
${courseList}

Recommend the best matches and explain briefly why each course fits the user's needs.
Be concise, friendly, and helpful.`;

            const aiResponse = await generateText(prompt);
            console.log(`\nAI Response:\n${aiResponse}`);
        }

        await mongoose.disconnect();
        console.log('\nDone. All tests passed.');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

run();
