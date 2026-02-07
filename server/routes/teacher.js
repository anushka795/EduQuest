const express = require('express');
const router = express.Router();
const { users, quizzes, quizResults, getNextId } = require('../data/store');

// Create Quiz (Manual or AI generated result saved here)
router.post('/quiz', (req, res) => {
    const { teacherId, subject, title, difficulty, questions } = req.body;

    const newQuiz = {
        id: getNextId('quiz'),
        teacherId,
        subject,
        title,
        difficulty,
        questions,
        createdAt: new Date()
    };

    quizzes.push(newQuiz);
    res.status(201).json(newQuiz);
});

// Generate Quiz with AI
router.post('/generate-quiz', async (req, res) => {
    try {
        const { subject, difficulty, text } = req.body;
        // Import dynamically to avoid top-level async issues or circular deps if any
        const { generateQuiz } = require('../utils/ai');

        const questions = await generateQuiz(subject, difficulty, text || "General knowledge", 5);
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate quiz" });
    }
});

// Get My Quizzes
router.get('/quizzes/:teacherId', (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const myQuizzes = quizzes.filter(q => q.teacherId === teacherId);
    res.json(myQuizzes);
});

// Get My Students
router.get('/students/:teacherId', (req, res) => {
    const teacherId = parseInt(req.params.teacherId);

    // Find students who have enrolled in a subject with this teacher
    const myStudents = users.filter(u =>
        u.role === 'student' &&
        u.enrolledSubjects &&
        u.enrolledSubjects.some(sub => sub.teacherId === teacherId)
    ).map(s => {
        // Calculate basic stats
        const results = quizResults.filter(r => r.studentId === s.id && quizzes.find(q => q.id === r.quizId)?.teacherId === teacherId);
        const avgScore = results.length > 0 ? results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length : 0;

        return {
            id: s.id,
            name: s.name,
            email: s.email,
            averageScore: Math.round(avgScore),
            completedQuizzes: results.length
        };
    });

    res.json(myStudents);
});

// Get Specific Student Details for Teacher
router.get('/student-details/:teacherId/:studentId', (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const studentId = parseInt(req.params.studentId);

    const student = users.find(u => u.id === studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Get results for quizzes created by this teacher
    const results = quizResults.filter(r =>
        r.studentId === studentId &&
        quizzes.find(q => q.id === r.quizId)?.teacherId === teacherId
    ).map(r => {
        const quiz = quizzes.find(q => q.id === r.quizId);
        return {
            ...r,
            quizTitle: quiz ? quiz.title : "Unknown Quiz"
        };
    });

    res.json({
        student: { id: student.id, name: student.name, email: student.email },
        results
    });
});

module.exports = router;
