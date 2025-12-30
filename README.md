# MindCare – AI-Powered Student Mental Health Support Platform

MindCare is a digital mental health support platform designed to help students identify stress, anxiety, and depression risks early and access personalized support in a safe, stigma-free manner. The system combines clinically validated screening tools with an AI-powered chatbot and intelligent resource recommendations.

---

##  Key Features

- **Standardized Mental Health Screening**
  - PHQ-9 (Depression) and GAD-7 (Anxiety) assessments
  - Automated risk categorization: Normal, Mild, Moderate, Severe

- **RAG-Powered AI Chatbot**
  - Retrieval-Augmented Generation (RAG) for context-aware responses
  - Combines knowledge base + LLM for accurate and relevant guidance
  - Conversation history-aware and privacy-focused

- **Personalized Resource Recommendations**
  - Articles, videos, and self-help content tailored to:
    - Test scores
    - Chatbot interactions
  - Supports stress management, coping techniques, and awareness

- **Smart Escalation & Admin Alerts**
  - Student data shared with admin **only in high-risk cases**
  - Ensures privacy while enabling early intervention
  - Admin dashboard for monitoring flagged cases

- **Role-Based Dashboards**
  - Student dashboard: tests, chatbot, resources
  - Admin dashboard: alerts, analytics, risk summaries

---

##  Why This Matters

- Rising academic pressure and digital burnout among students
- Low awareness and fear of judgment prevent help-seeking
- Institutions lack early-warning systems for mental health risks
- Need for scalable, privacy-first, tech-enabled intervention

---

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS

**Backend**
- Python
- Flask
- REST APIs
- Node.js
- Express.js

**AI & NLP**
- Retrieval-Augmented Generation (RAG)
- Vector embeddings
- Knowledge base indexing

**Database**
- MySQL (User data, test results, chat history)

---

## Project Structure (Simplified)
mindcare/
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Screens (Login, Dashboard, Chatbot, Admin)
│   │   ├── services/        # API calls (auth, tests, chatbot)
│   │   └── utils/           # Helper functions
│   └── public/
│
├── backend/                 # backend
│   ├── app.py               # Flask app entry point
│   ├── routes/              # API routes (auth, tests, chatbot)
│   ├── controllers/         # Business logic
│   ├── models/              # Database schemas
│   └── config/              # Environment & DB configuration
│
├── ai/                      # AI & RAG pipeline
│   ├── data/                # Knowledge base (mental health content)
│   ├── embeddings/          # Vector embeddings generation
│   ├── vector_store/        # Stored embeddings for retrieval
│   └── rag_pipeline.py      # RAG retrieval + response logic
│
├── database/                # Database setup
│   └── mongo_schema.md      # Collections & schema overview
│
├── README.md                # Project documentation
└── .env.example             # Environment variable template

