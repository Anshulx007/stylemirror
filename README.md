# StyleMirror AI 🪞✨
### Identity-Preserving Fashion Designer & Virtual Makeover Assistant

> **Research Project** | B.Tech AMIA | KIET Group of Institutions, Ghaziabad

---

## Overview

StyleMirror AI is an end-to-end AI-powered fashion recommendation and virtual makeover web application. The core innovation is **identity-preserving makeover generation** — the system modifies only fashion attributes (hairstyle, clothing, makeup, accessories) while preserving the user's facial identity, face shape, skin tone, and features.

This is not a deepfake generator. It is a **fashion intelligence system** that respects who you are.

---

## Research Paper Title

> **"StyleMirror AI: An Identity-Preserving Fashion Recommendation and Virtual Makeover System Using Generative AI"**

---

## Key Features

| Feature | Description |
|---|---|
| 🔒 Identity-Preserving Makeover | Face preserved; only fashion modified |
| 👗 Fashion Recommendation Engine | Outfit, hairstyle, accessories, footwear |
| 🎭 Occasion-Based Styling | College, Interview, Party, Wedding, etc. |
| 💸 Budget-Aware Recommendations | ₹1000 to ₹10000 range |
| 🌦️ Seasonal Fashion Intelligence | Summer, Winter, Monsoon styling |
| 🎨 Color Palette Generator | Skin-tone-matched color recommendations |
| 📊 AI Fashion Scoring | 0–10 style score before and after |
| 💬 Fashion Chat Assistant | GPT-powered styling chatbot |
| 📁 Saved Looks Gallery | Save, compare, download reports |

---

## Technology Stack

### Frontend
- **React** (Vite) — Main UI
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Axios** — API calls

### Backend
- **Python** + **FastAPI** — REST API server
- **OpenCV** + **MediaPipe** — Face detection & landmark extraction
- **Pillow** + **NumPy** — Image processing

### AI / APIs
- **OpenAI GPT-4o** — Fashion recommendations, chat assistant
- **Google Gemini Vision** — Image analysis, style understanding
- **OpenAI DALL-E 3 / Stable Diffusion (img2img)** — Makeover generation
- **MediaPipe Face Mesh** — Identity preservation pipeline

### Storage & Deployment
- **SQLite** (dev) / **PostgreSQL** (prod) — User data, saved looks
- **AWS S3 / Cloudflare R2** — Image storage
- **Docker** — Containerization
- **Vercel** (frontend) + **Railway / Render** (backend)

---

## Project Structure

```
stylemirror-ai/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/             # Route pages
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand state management
│   │   └── assets/            # Static assets
│   └── public/
│
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   ├── core/              # Config, settings
│   │   ├── models/            # DB models (SQLAlchemy)
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helpers
│   ├── ai/                    # AI pipeline modules
│   │   ├── face_analysis.py   # MediaPipe face detection
│   │   ├── makeover.py        # Identity-preserving generation
│   │   ├── fashion_engine.py  # GPT fashion recommendations
│   │   ├── style_scorer.py    # AI style scoring
│   │   └── color_analyzer.py  # Skin tone + color palette
│   └── tests/
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── RESEARCH_METHODOLOGY.md
│   └── DEPLOYMENT.md
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── research/
    ├── paper_draft.md
    ├── dataset_notes.md
    └── references.bib
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API Key
- Google Gemini API Key

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/stylemirror-ai.git
cd stylemirror-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your API keys
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local      # Set VITE_API_URL=http://localhost:8000
npm run dev
```

### 4. Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## Environment Variables

### Backend `.env`
```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
DATABASE_URL=sqlite:///./stylemirror.db
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=stylemirror-images
SECRET_KEY=your-jwt-secret
```

### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=StyleMirror AI
```

---

## Research Contribution

This project contributes the following novelties to the academic literature:

1. **Identity-Preserving Makeover Pipeline** — Face mesh anchoring during generation
2. **Multi-Factor Fashion Recommendation Framework** — Occasion × Season × Budget × Body
3. **AI-Powered Style Scoring** — Quantitative fashion assessment model
4. **Personalized Color Palette Generation** — Skin tone extraction via KMeans clustering
5. **Seasonal Fashion Intelligence** — Climate-aware outfit recommendations for Indian context

See `research/paper_draft.md` for full methodology.

---

## Development Roadmap

See `WORKING_PLAN.md` for the complete 8-week sprint plan.

---

## License

MIT License — See LICENSE file.

---

*Built with ❤️ by Anshul Tyagi | B.Tech AMIA | KIET Group of Institutions*
