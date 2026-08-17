import recommendCourses from '../utils/recommendCourses.js';
import { generateText } from '../utils/geminiClient.js';
import courseModel from '../Schemas/course.schema.js';

export default async function askAiController(req, res) {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        const matches = await recommendCourses(query);

        if (matches.length === 0) {
            return res.status(200).json({
                success: true,
                aiResponse: 'No matching courses found in our catalog. Try a different search!',
                courses: []
            });
        }

        const courseList = matches.map((c, i) =>
            `${i + 1}. ${c.title} — ${c.description} — Category: ${c.category} (relevance: ${(c.score * 100).toFixed(0)}%)`
        ).join('\n');

        const prompt = `You are a helpful course recommendation assistant for an LMS platform.

User query: "${query}"

Here are the most relevant courses found:
${courseList}

Recommend the best matches and explain briefly why each course fits the user's needs.
Be concise, friendly, and helpful. If the user's query is vague, mention that and suggest they refine it.`;

        const aiResponse = await generateText(prompt);

        const courseIds = matches.map((c) => c.courseId);
        const fullCourses = await courseModel.find({ _id: { $in: courseIds } });

        const orderedCourses = courseIds.map((id) =>
            fullCourses.find((c) => c._id.toString() === id.toString())
        ).filter(Boolean);

        return res.status(200).json({
            success: true,
            aiResponse,
            courses: orderedCourses
        });
    } catch (error) {
        console.error('askAiController error:', error);
        return res.status(500).json({
            success: false,
            message: 'AI recommendation failed',
            error: error.message
        });
    }
}
