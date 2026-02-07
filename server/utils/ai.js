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
        // 1. Remove markdown code blocks (```json ... ```)
        let cleanedText = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Find the first '[' and last ']' to ensure we only parse the array
        const firstBracket = cleanedText.indexOf('[');
        const lastBracket = cleanedText.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
        }

        // 3. sanitize backslashes for LaTeX content which often breaks JSON.parse
        // Replace single backslashes that are NOT followed by a control character (like ", \, /, b, f, n, r, t)
        // This is a heuristic. A more robust way is to specifically target LaTeX patterns like \(, \), \[, \].
        // Let's target the specific patterns seen in the error: \( and \) and \[ and \]
        // We need to replace `\` with `\\` so it becomes a literal backslash in the JSON string.
        cleanedText = cleanedText
            .replace(/\\/g, '\\\\') // Double ALL backslashes first (simplest approach for LaTeX heavy text that isn't already valid JSON escapes)
        // Wait, doubling ALL backslashes might break valid JSON escapes like \n or \".
        // Let's try a safer approach: fix specific known issues.

        // Actually, the previous error showed: "Newton's Second Law (\(F=ma\))"
        // In a JSON string, this should be "Newton's Second Law (\\(F=ma\\))" to be valid.
        // But the AI sent it as raw text.

        // Let's try to fix just the LaTeX delimiters if they are single backslashed.
        // But regex on JSON strings is hard. 

        // Alternative: The AI output in the terminal looked like valid JSON *except* for the backslashes in the strings.
        // If we treat it as a raw string and try to escape it, it's tricky.

        // Let's use a library if possible, but we don't want to add deps if not needed.
        // Let's try a strict replacement for the common LaTeX patterns seeing in the logs:
        // \( -> \\(
        // \) -> \\)
        // \[ -> \\[
        // \] -> \\]
        // But we must be careful not to double-escape if they are already escaped.
        // A simple way is to replace `\` with `\\` ONLY if it is not followed by a valid JSON escape char.
        // Valid JSON escapes: ", \, /, b, f, n, r, t, u

        // However, `\(F=ma\)` -> the backslash is followed by `(`. 
        // So we can replace `\` followed by anything that IS NOT a valid escape char.

        // formatting: (?<!\\)\\(?![\\/bfnrtu"])
        // This regex looks for a backslash that is NOT preceded by a backslash (negative lookbehind)
        // AND is NOT followed by a valid escape char (negative lookahead).
        // JS RegExp lookbehind support might be varying, but let's assume modern node.

        // Let's try a simpler regex approach that targets the specific LaTeX patterns we saw.
        // patterns: \(, \), \[, \]
        // We want to turn `\` into `\\` in these cases.

        // Global replace for `\(` -> `\\(`
        // Note: In string literals, `\\` is one backslash.

        cleanedText = cleanedText.replace(/\\(\(|\)|\[|\])/g, '\\\\$1');

        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", textResult);
        console.error("Parse Error:", e.message);
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
