import courseModel from '../Schemas/course.schema.js';
import courseEmbeddingModel from '../Schemas/courseEmbedding.schema.js';
import { embedText } from '../utils/geminiClient.js';

export default async function syncEmbeddingsController(req, res) {
    try {
        const courses = await courseModel.find({});
        let synced = 0;
        let skipped = 0;
        let errors = 0;

        for (const course of courses) {
            try {
                const existing = await courseEmbeddingModel.findOne({ courseId: course._id });
                if (existing) {
                    skipped++;
                    continue;
                }

                const textToEmbed = `${course.title} ${course.description} ${course.category}`;
                const embedding = await embedText(textToEmbed);

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

                synced++;
            } catch (err) {
                console.error(`Failed to embed course ${course._id}:`, err.message);
                errors++;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Embeddings sync complete',
            total: courses.length,
            synced,
            skipped,
            errors
        });
    } catch (error) {
        console.error('syncEmbeddingsController error:', error);
        return res.status(500).json({
            success: false,
            message: 'Embeddings sync failed',
            error: error.message
        });
    }
}
