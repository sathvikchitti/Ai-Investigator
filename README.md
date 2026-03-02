
# 🕵️ AI Content Detective

> A Multimodal AI Forensic Investigation System
> Detect. Verify. Trust.

AI Content Detective is a cyber-themed AI forensic web application that analyzes **text, images, and video** to determine whether content is AI-generated or human-created using Google Gemini’s multimodal capabilities.

---

## 🚀 Live Concept

The system provides:

* 📝 AI-generated text detection
* 🖼️ Image artifact & realism analysis
* 🎥 Video frame-level forensic inspection
* 📊 Risk classification & probability scoring
* 🧠 Structured AI reasoning output
* ⚡ Interactive animated cyber landing experience

---

## 🏗️ System Architecture

```
User
  ↓
React Frontend (Vite + TypeScript)
  ↓
Gemini Service Layer (gemini.ts)
  ↓
Google Gemini Multimodal Model
  ↓
Structured JSON Response
  ↓
Dashboard Visualization
```

### Planned Production Architecture

```
Frontend → Express Backend → Gemini API → SQLite Logs → Frontend
```

---

## 🧠 Core Features

### 🔹 Multimodal AI Detection

* Text analysis
* Image authenticity detection
* Video frame forensic analysis

### 🔹 Structured AI Output

Uses JSON schema enforcement to guarantee deterministic AI responses.

```ts
interface AnalysisResult {
  ai_probability: number;
  risk_level: string;
  confidence: number;
  forensic_reasons: string[];
  analysis_summary: string;
}
```

### 🔹 Risk Classification

* Low Risk
* Medium Risk
* High Risk

### 🔹 Interactive Cyber Landing Page

* GSAP-powered animated DotGrid background
* Mouse reactive physics
* Click shockwave interaction
* Cyber-forensic visual aesthetic

---

## 🛠 Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* GSAP
* React Router DOM
* Lucide Icons

### AI Integration

* @google/genai
* Model: `gemini-3-flash-preview`
* Structured JSON schema enforcement

### Animation

* Custom DotGrid canvas animation
* GSAP physics interactions

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-content-detective.git
cd ai-content-detective
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Set Environment Variables

Create a `.env` file:

```

---

### 4️⃣ Run Development Server

```bash
npm run dev
---

## 🎯 Design Philosophy

This project was built with:

* Structured AI engineering mindset
* Type-safe AI response handling
* Clean layered architecture
* Multimodal capability under a unified API
* Production-aware system thinking

---

## 🚧 Future Improvements

* Express backend API gateway
* SQLite analysis logging
* User authentication system
* Rate limiting & abuse prevention
* Admin analytics dashboard
* Dockerized deployment
* CI/CD pipeline

---

## 🏆 Use Cases

* Academic integrity verification
* Deepfake detection prototype
* AI content moderation
* Media authenticity auditing
* Hackathon AI showcase

---

## 📊 Project Status

✅ MVP Complete
✅ Animated landing page integrated
⚠️ Backend recommended for production
🚀 Ready for demo & portfolio showcase

---

## 👨‍💻 Author

Developed by 
Venkata Sathvik Chittipaka(github.com/sathvikchitti)
Udatha Prashanth (github.com/uprashanth222)
Bantu Sai Manaswini (github.com/)

for Vibeathon@SmartDhee KMEC