const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
// using GEMINI_API_KEY from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (subject, difficulty, text, count = 5) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("No GEMINI_API_KEY found. Returning mock data.");
            return getMockQuestions(subject, count);
        }

        // Use a model that supports JSON generation or is generally capable.
        // 'gemini-1.5-flash' is a good balance of speed and cost.
        // If 1.5-flash is not found, try 'gemini-pro'.
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Construct Few-Shot Prompt
        const prompt = `
        You are an AI that generates educational quizzes in strict JSON format.
        
        Task: Generate ${count} multiple-choice questions about "${subject}" with "${difficulty}" difficulty.
        Context: ${text.substring(0, 2000)}

        Output Format:
        A JSON array of objects. Each object must have:
        - questionText (string)
        - options (array of 4 strings)
        - correctAnswer (integer index 0-3)

        Examples:
        
        Input: Subject: "Math", Difficulty: "Easy", Text: "2 + 2 equals 4. 2 + 3 equals 5."
        Output:
        [
            {
                "questionText": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswer": 1
            },
            {
                "questionText": "What is 2 + 3?",
                "options": ["4", "5", "6", "7"],
                "correctAnswer": 1
            }
        ]

        Input: Subject: "Science", Difficulty: "Medium", Text: "Water boils at 100 degrees Celsius."
        Output:
        [
            {
                "questionText": "at what temperature does water boil?",
                "options": ["90°C", "100°C", "110°C", "120°C"],
                "correctAnswer": 1
            }
        ]

        Now, generate the quiz for the provided context. Return ONLY the JSON. Do not include markdown formatting like \`\`\`json.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResult = response.text();

        return parseResponse(textResult);

    } catch (error) {
        console.error("Gemini Generation failed:", error.message);
        // Fallback or re-throw? For now, mock data to keep app running.
        return getMockQuestions(subject, count);
    }
};

const parseResponse = (textResult) => {
    try {
        // Clean up potentially messy JSON (markdown blocks, etc.)
        // Sometimes Gemini adds ```json ... ``` despite instructions.
        let cleanedText = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        // Find the first '[' and last ']' to ensure we only parse the array
        const firstBracket = cleanedText.indexOf('[');
        const lastBracket = cleanedText.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
        }

        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", textResult);
        throw new Error("Invalid format from AI");
    }
}

const getMockQuestions = (subject, count) => {
    return Array(count).fill(0).map((_, i) => ({
        questionText: `Mock Question ${i + 1} about ${subject} (AI Unavailable)`,
        options: ["Answer A", "Answer B", "Answer C", "Answer D"],
        correctAnswer: 0
    }));
};

module.exports = { generateQuiz };
