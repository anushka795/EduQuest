// In-memory data storage
// This data will reset every time the server restarts

const users = [];
const teachers = []; // Helper array if needed, but users array with role is enough
const students = []; // Helper array
const quizzes = [];
const quizResults = [];
const questions = [];
const answers = [];

// ID Counters
let userIdCounter = 1;
let quizIdCounter = 1;
let questionIdCounter = 1;
let answerIdCounter = 1;
let resultIdCounter = 1;

module.exports = {
    users,
    quizzes,
    quizResults,
    questions,
    answers,
    counters: {
        userId: userIdCounter,
        quizId: quizIdCounter,
        questionId: questionIdCounter,
        answerId: answerIdCounter,
        resultId: resultIdCounter
    },
    // Helpers to get next IDs
    getNextId: (type) => {
        switch (type) {
            case 'user': return userIdCounter++;
            case 'quiz': return quizIdCounter++;
            case 'question': return questionIdCounter++;
            case 'answer': return answerIdCounter++;
            case 'result': return resultIdCounter++;
            default: return Date.now();
        }
    }
};
