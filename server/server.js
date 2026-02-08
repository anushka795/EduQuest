const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Store (to ensure it initializes)
const store = require('./data/store');

// Routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const forumRoutes = require('./routes/forum');

app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/questions', forumRoutes); // Forum questions base
app.use('/api/answers', forumRoutes);   // Forum answers base - handled in same file but different paths, need to adjust forum.js or just mount on /api/forum?
// The prompt spec said:
// GET /api/questions/:subject
// GET /api/answers/:questionId
// So I can mount forumRoutes on /api directly and let the router handle /questions and /answers
// app.use('/api', forumRoutes); 
// Better to be explicit if possible. forum.js has /questions... and /answers... so mounting on /api works.

app.use('/api', forumRoutes);



// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('--- In-Memory Storage Active ---');
});
