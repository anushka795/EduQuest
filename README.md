# EduQuest - In-Memory Learning Platform 

## Overview
EduQuest is a full-stack educational platform built with React, Node.js, and in-memory storage (no database required). Data resets when the server restarts.

## Features
- **Roles**: Teacher (Create Quizzes, View Students) & Student (Take Quizzes, View Results)
- **AI Quiz Generation**: Teachers can generate quizzes from text using Google Gemini AI.
- **In-Memory Storage**: Efficient JavaScript-based storage for temporary data persistence.
- **Q&A Forum**: Interactive space for students and teachers to discuss subjects.
- **Analytics**: Performance tracking for students and teachers.

## Setup & Run

### Prerequisites
- Node.js installed

### 1. Backend (Server)
1. Open a terminal in `server/`.
2. Install dependencies (if not done): `npm install`
3. Create a `.env` file (optional if using defaults, but recommended for AI):
   ```
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   # OR
   node server.js
   ```

### 2. Frontend (Client)
1. Open a new terminal in `client/`.
2. Install dependencies (if not done): `npm install`
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Usage
- Open `http://localhost:5173` in your browser.
- **Register** a Teacher account first to create content.
- **Register** a Student account to enroll in subjects and take quizzes.

## Notes
- **Data Reset**: If you stop the backend server, all users and quizzes will be lost.
- **AI Generation**: If you don't provide a valid `GEMINI_API_KEY`, the system will fallback to mock data generation so you can still test the flow.
