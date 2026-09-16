# 🏥 VisitBrief — AI Clinical Triage & Visit Summary Assistant

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Groq AI](https://img.shields.io/badge/Groq-AI%20API-f55036?style=for-the-badge)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**VisitBrief** is an intelligent, real-time AI clinical triage assistant and visit summary engine. It translates raw patient symptom descriptions into structured, actionable clinical briefs, highlights red-flag medical emergencies, and optimizes the initial intake process for healthcare providers and patients alike.

---

## 🌟 Key Features

- 🚨 **Real-Time Clinical Triage**: Classifies patient symptoms into **Low**, **Medium**, **High**, or **Critical** urgency categories.
- ⚡ **Groq Ultra-Fast AI Engine**: Utilizes state-of-the-art LLMs (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `groq/compound`) for sub-second structured clinical assessment.
- 🛑 **Local Safety Net Screening**: Features a deterministic, rule-based screening engine that intercepts life-threatening emergency symptoms (chest pain, stroke signs, dyspnea, suicide risk) instantly offline.
- 📊 **Structured Visit Briefs**: Produces concise clinical summaries including preliminary diagnosis, detected red flags, and recommended next steps.
- 📁 **Clean Folder Structure**: UI components housed cleanly in `frontend/`, AI & clinical services housed in `backend/`.
- 🎨 **Modern Responsive UI**: Built with a sleek dark-mode glassmorphic theme, micro-animations, and responsive layout.

---

## 🏗️ Clean Project Structure

```
hackathon/
├── 📁 frontend/                 # All Frontend UI Components & Views
│   ├── 📁 components/           # UI Components (BriefCard, RedFlagAlert, Header, etc.)
│   ├── App.jsx                  # Main Application Component
│   ├── main.jsx                 # React Entry Point
│   └── index.css                # Global CSS & Styling Design Tokens
│
├── 📁 backend/                  # AI Services & Clinical Logic
│   ├── geminiService.js         # Groq AI Service & Multi-Model Fallbacks
│   └── safetyNet.js             # Local Offline Emergency Rule Screener
│
├── index.html                   # HTML Entry Point
├── vite.config.js               # Vite Configuration
├── package.json                 # Project Dependencies & Scripts
├── .env                         # Environment Variables (VITE_GROQ_API_KEY)
└── README.md                    # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- A **Groq API Key** (obtain free from [console.groq.com](https://console.groq.com))

---

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

### 2. Run the App

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend UI** | React 18, Vite 5 | Single page application with HMR |
| **Styling** | Custom Vanilla CSS | Glassmorphic design system |
| **Icons** | Lucide React | Clinical & UI SVG icons |
| **AI LLM Engine** | Groq API | Fast AI inference engine |
| **LLM Models** | Qwen 3.8 27B, GPT-OSS 120B | Multi-model fallback chain |

---

## ⚠️ Medical Disclaimer

> **IMPORTANT**: VisitBrief is an AI-assisted demonstration tool developed for hackathon and clinical support exploration purposes. It is **not** a certified medical device and is **not** intended to replace professional medical judgment, diagnosis, or emergency healthcare services. In a medical emergency, always contact emergency medical services (911/112) immediately.

---

## 📜 License

This project is licensed under the **MIT License**.
