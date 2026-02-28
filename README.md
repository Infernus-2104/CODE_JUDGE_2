# 🚀 AI Code Judge (Spring Boot + React + Gemini AI)

A full-stack competitive programming judge platform built with:

- 🧠 Spring Boot (Backend)
- ⚛ React + Vite (Frontend)
- 🔐 JWT Authentication
- 🗄 MongoDB
- 🤖 Google Gemini 2.5 AI Integration

This project replicates core features of platforms like LeetCode / Codeforces.

---

# 📁 Project Structure

```
AI-Code-Judge/
│
├── backend/  (Spring Boot - IntelliJ)
│   ├── pom.xml
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/codejudge/judge/
│   │       │       ├── JudgeApplication.java
│   │       │
│   │       │       ├── config/
│   │       │       │   ├── SecurityConfig.java
│   │       │       │   └── CorsConfig.java
│   │       │
│   │       │       ├── controller/
│   │       │       │   ├── AuthController.java
│   │       │       │   ├── ProblemController.java
│   │       │       │   ├── SubmissionController.java
│   │       │       │   └── AiController.java
│   │       │
│   │       │       ├── model/
│   │       │       │   ├── User.java
│   │       │       │   ├── Problem.java
│   │       │       │   ├── Submission.java
│   │       │       │   ├── SubmissionResult.java
│   │       │       │   └── TestCase.java
│   │       │
│   │       │       ├── repository/
│   │       │       │   ├── UserRepository.java
│   │       │       │   ├── ProblemRepository.java
│   │       │       │   └── SubmissionRepository.java
│   │       │
│   │       │       ├── security/
│   │       │       │   ├── JwtFilter.java
│   │       │       │   ├── JwtUtil.java
│   │       │       │   └── CustomUserDetailsService.java
│   │       │
│   │       │       ├── service/
│   │       │       │   ├── JudgeService.java
│   │       │       │   └── AiService.java
│   │       │
│   │       │       └── util/
│   │       │           ├── CodeExecutor.java
│   │       │           └── ExecutionResult.java
│   │       │
│   │       └── resources/
│   │           └── application.yml
│   │
│   └── temp/  (auto-created for code execution)
│
├── frontend/  (React + Vite - VS Code)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── AdminLogin.jsx
│           ├── CreateProblem.jsx
│           └── ProblemDetails.jsx
│
└── README.md
```

---

# ✨ Features

## 👤 Authentication
- User Signup
- User Login
- Separate Admin Login
- JWT-based authentication
- Role-based access control (USER / ADMIN)

## 🛠 Problem Management
- Admin-only problem creation
- Multiple sample testcases
- Multiple hidden testcases
- Time limit per problem
- Memory limit per problem

## ⚙ Code Judge Engine
Supports:
- Python
- C++
- Java

Detects:
- ✅ Accepted
- ❌ Wrong Answer
- ⏳ Time Limit Exceeded
- 💥 Runtime Error
- 🛠 Compilation Error

## 📊 Submission Features
- Full testcase breakdown
- Execution time tracking
- Submission history
- Sample output comparison
- Hidden testcase validation

## 🤖 AI Debugging
- Google Gemini 2.5 Flash integration
- Explains why code failed
- Suggests corrections
- Returns structured explanation

---

# 🏗 Architecture

```
React (Frontend)
        ↓
Spring Boot REST API
        ↓
MongoDB
        ↓
Local Code Execution (ProcessBuilder)
        ↓
Gemini API (AI Explanation)
```

---

# 🖥 Backend Setup (Spring Boot)

## 1️⃣ Requirements

- Java 17+
- Maven
- MongoDB
- Python installed
- g++ installed
- Java compiler installed

Verify:

```
python --version
g++ --version
javac -version
```

---

## 2️⃣ Configure application.yml

```
spring:
  data:
    mongodb:
      uri: mongodb://127.0.0.1:27017/codejudge

server:
  port: 5000

gemini:
  api-key: YOUR_GEMINI_API_KEY
```

Get Gemini key from:
https://aistudio.google.com/app/apikey

---

## 3️⃣ Run Backend

Open in IntelliJ and run:

```
JudgeApplication.java
```

Backend runs at:

```
http://localhost:5000
```

---

# 🎨 Frontend Setup (React + Vite)

## 1️⃣ Install Dependencies

```
cd frontend
npm install
```

## 2️⃣ Start Frontend

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 👑 Creating Admin

1. Signup normally
2. Open MongoDB shell:

```
mongosh
use codejudge
```

3. Promote user:

```
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "ADMIN" } }
)
```

Now login via:

```
/admin/login
```

---

# ⚠ Security Note

⚠ Code execution is NOT sandboxed.
This project is for educational purposes only.

For production use:
- Add Docker sandboxing
- Add memory monitoring
- Add execution isolation
- Add rate limiting

---

# 🚀 Future Improvements

- Docker-based sandbox
- Leaderboard
- Contest mode
- Problem editing
- Code plagiarism detection
- Streaming AI responses
- Cloud deployment

---
