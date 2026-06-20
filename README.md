# EcoCarbon 🌍

A full-stack web application designed to track personal carbon footprints, analyze daily activities, and generate dynamic, personalized reduction strategies using asynchronous AI processing.

## 🚀 Overview

EcoCarbon bridges the gap between static environmental data and actionable daily habits. By merging user demographic baselines with continuous daily activity logs, the application calculates a real-time carbon footprint. It utilizes an asynchronous background worker to query the Gemini AI model, providing users with highly specific, data-driven recommendations without interrupting the UI experience.

## 🛠️ Tech Stack

**Frontend:**
* Next.js (React)
* Tailwind CSS
* Recharts (Data Visualization)
* Fully responsive Dark Theme UI

**Backend & Data Engine:**
* Python
* FastAPI
* Pandas (Data manipulation and merging pipelines)
* SQLite (Database sessions)

**AI Integration:**
* Google GenAI SDK (Gemini)
* Asynchronous task queues

## ✨ Key Features

* **Real-Time Data Pipeline:** Seamlessly merges static onboarding demographics with dynamic daily logs using Pandas DataFrames.
* **Asynchronous AI Insights:** Offloads heavy LLM inference to a background worker, ensuring the frontend dashboard remains fast and responsive.
* **Interactive Dashboard:** Visualizes categorical emissions (Commute, Diet, Energy) using interactive ring charts.
* **Secure Architecture:** Implements strict environment variable handling to protect API keys and sensitive configuration data.

## 💻 Local Setup & Installation

**1. Clone the repository:**
```bash
git clone https://github.com/saranyadutta04/Carbon-Footprint.git 
cd Carbon-Footprint
```
**2. Backend Setup:**

```Bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
```
3. Run the Backend Server:

```Bash
uvicorn app.main:app --reload
```
4. Frontend Setup:

```Bash
cd frontend
npm install
npm run dev
```

5. View the App:
Open http://localhost:3000/dashboard in your browser.

Author
Saranya Dutta
B.Tech, Artificial Intelligence and Data Science
