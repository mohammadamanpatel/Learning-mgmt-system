import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import courseModel from '../Schemas/course.schema.js';

const courses = [
    {
        title: 'React.js — The Complete Guide',
        description: 'Master React.js from scratch. Learn components, hooks, Redux, React Router, and build real-world projects.',
        category: 'Frontend Development',
        thumbNail: {
            public_id: 'seed/react',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 12,
        lectures: []
    },
    {
        title: 'Node.js and Express — Backend Masterclass',
        description: 'Build scalable backend APIs with Node.js, Express, MongoDB, authentication, and deployment.',
        category: 'Backend Development',
        thumbNail: {
            public_id: 'seed/node',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 10,
        lectures: []
    },
    {
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn Python, NumPy, Pandas, Matplotlib, Scikit-learn and build machine learning models from scratch.',
        category: 'Data Science',
        thumbNail: {
            public_id: 'seed/python',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 15,
        lectures: []
    },
    {
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Become a full-stack developer. HTML, CSS, JavaScript, React, Node.js, MongoDB — everything in one course.',
        category: 'Web Development',
        thumbNail: {
            public_id: 'seed/fullstack',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 20,
        lectures: []
    },
    {
        title: 'Advanced JavaScript and ES6+ Features',
        description: 'Deep dive into closures, promises, async/await, generators, modules, and modern JavaScript patterns.',
        category: 'Frontend Development',
        thumbNail: {
            public_id: 'seed/js',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 8,
        lectures: []
    },
    {
        title: 'DevOps and Cloud Computing with AWS',
        description: 'Learn Docker, Kubernetes, CI/CD pipelines, AWS EC2, S3, Lambda, and infrastructure as code.',
        category: 'DevOps',
        thumbNail: {
            public_id: 'seed/devops',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 14,
        lectures: []
    },
    {
        title: 'React Native — Build Mobile Apps',
        description: 'Create cross-platform mobile apps for iOS and Android using React Native, Expo, and navigation.',
        category: 'Mobile Development',
        thumbNail: {
            public_id: 'seed/rn',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 11,
        lectures: []
    },
    {
        title: 'Tailwind CSS — Build Beautiful UIs',
        description: 'Master Tailwind CSS utility-first styling. Build responsive layouts, dark mode, and modern component designs.',
        category: 'Frontend Development',
        thumbNail: {
            public_id: 'seed/tw',
            secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },
        createdBy: 'Aman Patel',
        noOfLectures: 7,
        lectures: []
    }
];

async function seed() {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB:', connection.host);

        const existingTitles = (await courseModel.find({}).select('title')).map(c => c.title);
        const newCourses = courses.filter(c => !existingTitles.includes(c.title));

        if (newCourses.length === 0) {
            console.log('All courses already exist. Skipping seed.');
        } else {
            const result = await courseModel.insertMany(newCourses);
            console.log(`Seeded ${result.length} new courses successfully.`);
        }

        const allCourses = await courseModel.find({}).select('title category');
        console.log('\nAll courses in DB:');
        allCourses.forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.title} [${c.category}] (${c._id})`);
        });

        await mongoose.disconnect();
        console.log('\nDone. Disconnected from MongoDB.');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
