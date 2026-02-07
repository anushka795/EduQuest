const express = require('express');
const router = express.Router();
const { users, quizzes, quizResults, getNextId } = require('../data/store');

// Get Available Quizzes (Based on enrolled subjects)
router.get('/quizzes/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const student = users.find(u => u.id === studentId);

    if (!student || student.role !== 'student') {
        return res.status(404).json({ message: 'Student not found' });
    }

    // Get quizzes for subjects the student is enrolled in, from the specific teachers
    // OR just all quizzes for those subjects if we want to be more lenient. 
    // Requirement: "Filter quizzes array by subject and teacher"

    const availableQuizzes = quizzes.filter(q => {
        const enrollment = student.enrolledSubjects.find(sub => sub.subject === q.subject && sub.teacherId === q.teacherId);
        return !!enrollment;
    }).map(q => {
        // Check if completed
        const result = quizResults.find(r => r.quizId === q.id && r.studentId === studentId);
        return {
            id: q.id,
            title: q.title,
            subject: q.subject,
            teacherId: q.teacherId,
            difficulty: q.difficulty,
            questionCount: q.questions.length,
            completed: !!result,
            score: result ? result.score : null
        };
    });

    res.json(availableQuizzes);
});

// Get Quiz Details (for taking it)
router.get('/quiz/:id', (req, res) => {
    const quizId = parseInt(req.params.id);
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Send quiz without correct answers ideally, but for simplicity sending all
    // In a real app we'd strip correct answers
    res.json(quiz);
});

// Submit Quiz Result
router.post('/submit', (req, res) => {
    const { studentId, quizId, answers, score, totalQuestions } = req.body;

    const percentage = (score / totalQuestions) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';

    const newResult = {
        id: getNextId('result'),
        studentId,
        quizId,
        score,
        totalQuestions,
        percentage,
        grade,
        completedAt: new Date()
    };

    quizResults.push(newResult);
    res.json(newResult);
});

// Get Student Results/Performance
router.get('/results/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const results = quizResults.filter(r => r.studentId === studentId).map(r => {
        const quiz = quizzes.find(q => q.id === r.quizId);
        return {
            ...r,
            quizTitle: quiz ? quiz.title : 'Unknown',
            subject: quiz ? quiz.subject : 'Unknown'
        };
    });

    res.json(results);
});

module.exports = router;
