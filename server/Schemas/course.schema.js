import { Schema, model } from 'mongoose';
const Course = new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        minLength: [8, "minimum length should of atleast 8 chars"],
        maxLength: [60, "maximum length should of atleast 20 chars"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "description is required"],
        minLength: [8, "minimum length should of atleast 8 chars"],
        maxLength: [200, "maximum length should of atleast 200 chars"],
    },
    category: {
        type: String,
        required: [true, "category is required for the course"]
    },
    thumbNail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        {
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            lecture: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    createdBy: {
        type: String,
        required: [true, "Instructor name is required"]
    },
    noOfLectures: {
        type: Number
    }
},
    {
        timestamps: true
    }
);
const courseModel = model('Course', Course);
export default courseModel;