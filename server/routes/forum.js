const express = require('express');
const router = express.Router();
const { questions, answers, users, getNextId } = require('../data/store');

// Get Questions by Subject
router.get('/questions/:subject', (req, res) => {
    const subject = req.params.subject;
    // Simple filter, case insensitive maybe?
    const subjectQuestions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase()).sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with student name
    const result = subjectQuestions.map(q => {
        const student = users.find(u => u.id === q.studentId);
        return {
            ...q,
            studentName: student ? student.name : 'Unknown'
        };
    });

    res.json(result);
});

// Post Question
router.post('/questions', (req, res) => {
    const { studentId, subject, questionText } = req.body;

    const newQuestion = {
        id: getNextId('question'),
        studentId,
        subject,
        questionText,
        createdAt: new Date(),
        answersCount: 0
    };

    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

// Get Answers for a Question
router.get('/answers/:questionId', (req, res) => {
    const questionId = parseInt(req.params.questionId);
    const questionAnswers = answers.filter(a => a.questionId === questionId).sort((a, b) => b.upvotes - a.upvotes);

    // Enrich with user name and role
    const result = questionAnswers.map(a => {
        const user = users.find(u => u.id === a.userId);
        return {
            ...a,
            userName: user ? user.name : 'Unknown',
            userRole: user ? user.role : 'student'
        };
    });

    res.json(result);
});

// Post Answer
router.post('/answers', (req, res) => {
    const { questionId, userId, answerText, isTeacher } = req.body;

    const newAnswer = {
        id: getNextId('answer'),
        questionId,
        userId,
        answerText,
        isTeacher: !!isTeacher,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date()
    };

    answers.push(newAnswer);

    // Update question answer count (optional integration)
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.answersCount = (question.answersCount || 0) + 1;
    }

    res.status(201).json(newAnswer);
});

// Upvote Answer
router.put('/answers/:id/upvote', (req, res) => {
    const id = parseInt(req.params.id);
    const answer = answers.find(a => a.id === id);
    if (answer) {
        answer.upvotes++;
        res.json(answer);
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
});

// Downvote Answer
router.put('/answers/:id/downvote', (req, res) => {
    const id = parseInt(req.params.id);
    const answer = answers.find(a => a.id === id);
    if (answer) {
        answer.downvotes++; // Maybe implement tracking so user can't vote twice, but for simple demo this is fine
        res.json(answer);
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
});

module.exports = router;
