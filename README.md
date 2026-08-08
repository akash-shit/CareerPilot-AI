# 🚀 InterviewAI — AI-Powered Interview Preparation Platform

<p align="center">
  <strong>Turn your resume and job description into a personalized interview preparation strategy.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

---

## ✨ Overview

**InterviewAI** is an AI-powered interview preparation platform designed to help candidates prepare for technical interviews based on their **resume, skills, and target job description**.

The platform helps candidates prepare for interviews by analyzing:

- 📄 Resume
- 💼 Job Description
- 👨‍💻 Candidate's Skills & Experience
- 🎯 Job Requirements

The AI then generates a personalized interview strategy containing:

- Match Score
- Interview Questions
- Skill Gaps
- Preparation Roadmap
- Recent Interview Plans
- Personalized Recommendations

The application also allows users to upload their resume in **PDF/DOCX format** instead of manually entering their information.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing
- Persistent User Sessions

### 🤖 AI-Powered Interview Analysis

- Analyze Job Description
- Analyze Resume
- Analyze Candidate Profile
- Generate Personalized Interview Strategy
- Generate Relevant Interview Questions
- Identify Skill Gaps
- Calculate Job Match Score
- Generate Preparation Roadmap

### 📄 Resume Upload

Users can provide their profile through:

- PDF Resume
- DOCX Resume
- Manual Self Description

This allows users to quickly generate personalized interview preparation plans.

### 📊 Interview Dashboard

The dashboard provides:

- Overall Match Score
- Interview Questions
- Skill Gap Analysis
- Preparation Roadmap
- Recent Interview Plans

### 📑 AI Resume Generator

The platform can also generate an ATS-friendly resume based on:

- Existing Resume
- Self Description
- Target Job Description

The generated resume can be converted into a downloadable PDF.

### 🎨 Modern UI

- Dark themed interface
- Responsive design
- Modern dashboard
- SCSS-based styling
- Interactive components
- Loading animations
- Clean card-based UI

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | UI Development |
| React Router | Client-side Routing |
| SCSS | Styling |
| Axios | API Communication |
| Vite | Development & Build Tool |
| JavaScript | Application Logic |
| HTML5 | Structure |
| CSS3 | Styling |

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Google Gemini AI | AI Generation |
| Multer | File Upload |
| PDF Processing | Resume Extraction |
| Puppeteer / PDF Generator | Resume PDF Generation |

---

# 🏗️ Project Architecture

```text
CodeSky/
│
├── Backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── utils/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── style/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
