const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { users, counters, getNextId } = require('../data/store');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, subjects, enrolledSubjects } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check if user exists
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            id: getNextId('user'),
            name,
            email,
            password: hashedPassword,
            role, // 'teacher' or 'student'
            // Teacher specific
            subjects: role === 'teacher' ? subjects || [] : [],
            // Student specific
            enrolledSubjects: role === 'student' ? enrolledSubjects || [] : [],
            createdAt: new Date()
        };

        users.push(newUser);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: 'dummy-jwt-token-' + newUser.id // simulating token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            subjects: user.subjects,
            enrolledSubjects: user.enrolledSubjects,
            token: 'dummy-jwt-token-' + user.id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Data (Protected logic simulation)
router.get('/me', (req, res) => {
    // In a real app we would verify token here
    // For now we trust the client logic or could pass id in header
    // But let's just leave this as a stub
    res.status(501).json({ message: "Not implemented for basic auth demo" });
});

// Get All Teachers (For student registration)
router.get('/teachers', (req, res) => {
    const teachers = users.filter(u => u.role === 'teacher').map(t => ({
        id: t.id,
        name: t.name,
        subjects: t.subjects
    }));
    res.json(teachers);
});

module.exports = router;
