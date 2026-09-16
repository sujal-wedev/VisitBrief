# 🏥 VisitBrief — AI Clinical Triage & Visit Summary Assistant

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Groq AI](https://img.shields.io/badge/Groq-AI%20API-f55036?style=for-the-badge)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**VisitBrief** is an intelligent, real-time AI clinical triage assistant and visit summary engine. It translates raw patient symptom descriptions into structured, actionable clinical briefs, highlights red-flag medical emergencies, and optimizes the initial intake process for healthcare providers and patients alike.

---

## 🌟 Key Features

- 🚨 **Real-Time Clinical Triage**: Classifies patient symptoms into **Low**, **Medium**, **High**, or **Critical** urgency categories.
- ⚡ **Groq Ultra-Fast AI Engine**: Utilizes state-of-the-art LLMs (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `groq/compound`) for sub-second structured clinical assessment.
- 🛑 **Local Safety Net Screening**: Features a deterministic, rule-based screening engine that intercepts life-threatening emergency symptoms (chest pain, stroke signs, dyspnea, suicide risk) instantly offline.
- 📊 **Structured Visit Briefs**: Produces concise clinical summaries including preliminary diagnosis, detected red flags, and recommended next steps.
- 🔒 **Decoupled Architecture**: Modular architecture separating the Vite+React frontend client from the Express Node.js backend API proxy.
- 🎨 **Modern Responsive UI**: Built with a sleek dark-mode glassmorphic theme, micro-animations, and responsive layout for desktop and mobile.

---

## 🏗️ System Architecture

```
hackathon/
├── 📁 frontend/                 # Client UI (Vite + React 18)
│   ├── 📁 src/
│   │   ├── 📁 components/       # UI Components (BriefCard, RedFlagAlert, Header, etc.)
│   │   ├── 📁 services/         # AI Service, Safety Net Rules & API Client
│   │   ├── App.jsx              # Main Application Controller
│   │   ├── main.jsx             # React DOM Entry Point
│   │   └── index.css            # Global CSS & Design System Tokens
│   ├── index.html               # Web HTML Page Entry
│   ├── vite.config.js           # Vite Server & Proxy Config (Port 3000)
│   └── package.json             # Frontend Dependencies
│
├── 📁 backend/                  # API Proxy & Clinical Server (Node.js + Express)
│   ├── 📁 src/
│   │   ├── 📁 controllers/      # Route Controllers (triageController.js)
│   │   ├── 📁 services/         # Groq AI Query & Safety Net Logic
│   │   └── server.js            # Express Server Entry Point (Port 5000)
│   └── package.json             # Backend Dependencies
│
├── ⚙️ .env                      # Root Environment Variables
├── 📄 package.json              # Monorepo Workspace Script Launcher
└── 📖 README.md                 # Project Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- A **Groq API Key** (obtain free from [console.groq.com](https://console.groq.com))

---

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=5000
```

---

### 2. Installation

Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 3. Running the Application

You can launch the services individually or simultaneously:

#### Run Both Frontend & Backend (Recommended):
```bash
# From the root directory:
npm run dev:backend   # Starts Express Backend Server on http://localhost:5000
npm run dev:frontend  # Starts Vite React Frontend on http://localhost:3000
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Service**: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Reference

### Health Check
- **GET** `/api/health`
- **Response**:
```json
{
  "status": "ok",
  "service": "VisitBrief Backend API",
  "timestamp": "2026-09-16T12:00:00.000Z"
}
```

### Clinical Triage Assessment
- **POST** `/api/triage`
- **Headers**: `Content-Type: application/json`, optional `Authorization: Bearer <GROQ_API_KEY>`
- **Request Body**:
```json
{
  "symptoms": "Severe chest pain radiating to left arm and shortness of breath."
}
```
- **Response**:
```json
{
  "success": true,
  "timestamp": "2026-09-16T12:00:00.000Z",
  "safetyCheck": {
    "hasRedFlags": true,
    "suggestedUrgency": "Critical"
  },
  "triage": {
    "urgencyLevel": "Critical",
    "preliminaryDiagnosis": "Acute Coronary Syndrome (likely STEMI)",
    "redFlags": [
      "Severe chest pain radiating to left arm",
      "Shortness of breath"
    ],
    "recommendations": [
      "Activate emergency medical services (911) immediately",
      "Keep patient calm and seated",
      "Prepare for rapid transport to cardiac emergency facility"
    ],
    "summary": "Patient presents with classic red-flag symptoms of acute myocardial infarction."
  }
}
```

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend UI** | React 18, Vite 5 | Fast SPA with HMR development |
| **Styling** | Custom Vanilla CSS | Glassmorphic aesthetics, fluid typography, dark mode |
| **Icons** | Lucide React | Modern clinical SVG icons |
| **Backend API** | Node.js, Express 4 | REST API backend server |
| **AI LLM Engine** | Groq API | High-throughput AI inference engine |
| **LLM Models** | Qwen 3.8 27B, GPT-OSS 120B | Multi-model fallback chain |

---

## ⚠️ Medical Disclaimer

> **IMPORTANT**: VisitBrief is an AI-assisted demonstration tool developed for hackathon and clinical support exploration purposes. It is **not** a certified medical device and is **not** intended to replace professional medical judgment, diagnosis, or emergency healthcare services. In a medical emergency, always contact emergency medical services (911/112) immediately.

---

## 📜 License

This project is licensed under the **MIT License**.
