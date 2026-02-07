require('dotenv').config();
const { generateQuiz } = require('./utils/ai');

console.log("Checking environment...");

if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing from environment.");
    process.exit(1);
} else {
    console.log("GEMINI_API_KEY is present.");
}

console.log("Attempting to generate a quiz with Gemini (Physics context with LaTeX)...");
generateQuiz("Physics", "Medium", "Newton's First Law (Law of Inertia), Newton's Second Law (F=ma), Newton's Third Law (Action-Reaction). Force equals mass times acceleration.")
    .then(result => {
        console.log("Success! Generated quiz:");
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
        console.error("Failed to generate quiz:", err);
    });
