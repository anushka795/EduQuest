# How EduQuest Works: Under the Hood

## 1. The Big Picture
Think of this application like a restaurant:
*   **Frontend (The Menu & Waiter):** This is what you see (React.js). It takes your orders (clicks and inputs).
*   **Backend (The Kitchen):** This is where the work happens (Node.js & Express). It cooks the food (processes data).
*   **Database (The Pantry):** This is where ingredients are stored (Data Store).

---

## 2. How Data is Stored (The "Database")

For this version of the project, we use a smart **In-Memory Storage System**. Imagine a highly organized set of filing cabinets that lives in the computer's immediate memory.

We have 4 main "Cabinets":

1.  **Users Cabinet:**
    *   Stores everyone's ID, Name, Email, and Role (Teacher or Student).
    *   *Example:* "User #1 is Mr. Smith (Teacher)", "User #2 is John (Student)".

2.  **Quizzes Cabinet:**
    *   Stores every quiz created.
    *   **Crucial Link:** Each quiz has a `teacherId` stamped on it.
    *   *Logic:* When a student logs in, we check their enrolled subjects and look in this cabinet for quizzes that match.

3.  **Results Cabinet:**
    *   Stores the score cards.
    *   It links `studentId` + `quizId` + `Score`.
    *   *Logic:* This allows us to show a student only *their* results, and a teacher *all* results for their quizzes.

4.  **Forum Cabinet:**
    *   Stores Questions and Answers.
    *   Answers are "chained" to Questions using a `questionId`.

---

## 3. The AI "Brain" (Gemini Integration)
This is the smartest part of the system. Here is the flow:

1.  **The Input:** A teacher sends raw text (e.g., "Mitochondria is the powerhouse of the cell...").
2.  ** The API Call:** Our server securely sends this text to **Google Gemini (AI Service)**.
3.  **The Prompt:** We don't just send the text; we send a "Secret Instruction" with it:
    > *"Act as a teacher. Read this text and generate 5 multiple-choice questions in JSON format."*
4.  **The Response:** The AI replies with structured data (the questions and options), which our app instantly turns into the quiz cards you see on screen.

---

## 4. Security (The Bouncer)
We have a "Bouncer" called **Auth Middleware**.
*   Every time you try to do something important (like creating a quiz), the Bouncer checks your ID card (Token).
*   If your ID card says "Student", the Bouncer **blocks** you from entering the "Create Quiz" room.
