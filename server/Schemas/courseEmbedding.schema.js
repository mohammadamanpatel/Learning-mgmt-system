import { Schema, model } from 'mongoose';

const courseEmbedding = new Schema(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        embedding: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const courseEmbeddingModel = model('courseEmbedding', courseEmbedding);
export default courseEmbeddingModel;
