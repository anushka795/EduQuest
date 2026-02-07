require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // This is not directly exposed in the high-level google-generative-ai package usually,
        // but let's try a simple generation to see if we can get a clearer error or if I can use a known valid model.
        // Actually, the error message literally said: "Call ListModels to see the list of available models" in the REST API.
        // The node SDK might not expose listModels directly easily without looking at docs, but common models are 'gemini-pro', 'gemini-1.5-flash'.

        // Let's try gemini-1.5-flash-latest
        console.log("Trying gemini-1.5-flash-latest...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-1.5-flash-latest:", result.response.text());
            return;
        } catch (e) {
            console.log("Failed gemini-1.5-flash-latest:", e.message);
        }

        // Try gemini-1.0-pro
        console.log("Trying gemini-1.0-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-1.0-pro:", result.response.text());
            return;
        } catch (e) {
            console.log("Failed gemini-1.0-pro:", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
