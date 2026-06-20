# StyleMirror AI 🪞✨
### Identity-Preserving Fashion Designer & Virtual Makeover Assistant

> **Research Project** | B.Tech AMIA | KIET Group of Institutions, Ghaziabad

---

## Overview

StyleMirror AI is an end-to-end AI-powered fashion recommendation and virtual makeover web application. The core innovation is **identity-preserving makeover generation** — the system modifies only fashion attributes (hairstyle, clothing, makeup, accessories) while preserving the user's facial identity, face shape, skin tone, and features.

Our closed-loop pipeline analyzes user portraits, generates customized visual styling coordinates based on face proportions and color undertones, and verifies the generated makeover quality using quantitative metrics (ArcFace, CLIP, and LPIPS).

---

## Research Paper Reference

> **"StyleMirror AI: An Identity-Preserving Fashion Recommendation and Virtual Makeover System Using Generative AI"**  
> Draft manuscript available at [`research/paper_draft.md`](research/paper_draft.md).

---

## Key Features

| Feature | Description |
|---|---|
| 🔒 Identity-Preserving Makeover | Face shape and skin tone grounded in generation prompts; only fashion elements modified |
| 🔮 Virtual Makeover Page | Interactive draggable before/after slider comparison of the generated makeover |
| 👗 Fashion Recommendation Engine | Personalized styling suggestions (tops, bottoms, footwear) |
| 💇 Hairstyle & Accessories | Occasion-optimized hairstyles and accessories (glasses shape, watch metal) |
| 🎨 Color Palette Planner | Color coordinates to wear and avoid based on skin tone K-Means |
| 📊 Style Standing Score | 0–10 fashion scoring baseline (before vs after makeover) |
| 💬 Style Chat Assistant | Context-aware styling chatbot |
| 📄 Styling Report | Downloadable PDF styling coordinates summary report |
| 🧪 Metrics & Benchmarking | ArcFace, CLIP, LPIPS metrics runner and ablation study suite |
| 🌌 WebGL Scanning Light Beam | Ambient background scanning animation behind high-fidelity processing screens |

---

## Technology Stack

### Frontend
* **React (Vite)** — Single page application architecture
* **Tailwind CSS v4** — High-performance utility styles
* **Framer Motion** — Smooth animations and entrance transitions
* **WebGL Shaders** — Dynamic background scanning animations
* **Zustand** — Persistent state management (`localStorage`)
* **Axios** — API layer with exponential-backoff retry interceptors

### Backend
* **Python + FastAPI** — High-performance API routing
* **SQLAlchemy** — SQLite database session management
* **OpenCV + MediaPipe** — Face mesh coordinates extraction & image warping
* **Pillow + NumPy** — Pixel-level color extraction & filtering
* **ReportLab** — Dynamic PDF report compilation

### External AI Services
* **Google Gemini 2.0 Flash** — Visual aesthetic analysis and context-aware chat assistant
* **Google Imagen 3** — Generative makeover image generation (with local CV2 Warm Glow fallback)

---

## Project Structure

```
stylemirror/
├── frontend/                  # React + Vite Client
│   ├── src/
│   │   ├── pages/             # Pages (Home, Upload, Preferences, Recommendations, Makeover, Report, Chat)
│   │   ├── components/        # UI Components (Navbar, ImageUploader, BeforeAfterSlider, ShaderBackground, Cards, Spinner)
│   │   ├── services/          # Axios Client (api.js) with Retry Interceptors
│   │   └── store/             # Zustand Stores (App, Image, Recommendation, Chat, Report)
│   └── vite.config.js         # Vite Tailwind Config
│
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/               # Router Controllers (analyze, recommend, chat, report, camera)
│   │   └── main.py            # API App Entrypoint
│   ├── ai/                    # AI Pipelines (face_analysis, style_analyzer, style_scorer, makeover)
│   ├── database/              # SQLite Configuration & SQLAlchemy Models (ImageModel, LookModel)
│   ├── metrics/               # Evaluation Metrics (arcface_score, clip_score, lpips_score, etc.)
│   ├── reports/               # Generated PDF Report Cache
│   └── tests/                 # Backend Endpoint Integration Tests
│
├── docker/                    # Docker Configurations
│   ├── Dockerfile.frontend    # React production build served via Nginx
│   ├── Dockerfile.backend     # FastAPI app build
│   └── docker-compose.yml     # Container orchestration
│
└── research/                  # Scientific Evaluation Materials
    ├── experiments/           # Metric evaluate & user study analysis runner scripts
    ├── results/               # CSV datasets (ArcFace, CLIP, LPIPS, user_study)
    ├── tables/                # Markdown ablation & user survey tables
    ├── figures/               # Matplotlib analysis plots
    ├── poster.md              # Academic poster draft
    └── paper_draft.md         # Full research paper manuscript draft
```

---

## Quick Start

### Prerequisites
* Python 3.10+
* Node.js 20+
* Google Gemini API Key

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Initialize virtual environment
python -m venv venv
venv\Scripts\activate    # Linux/Mac: source venv/bin/activate

# Install dependencies (includes OpenCV, MediaPipe, SQLAlchemy, and ReportLab)
pip install -r requirements.txt

# Create .env and set keys
echo GEMINI_API_KEY="your-gemini-key" > .env

# Run FastAPI Server
$env:PYTHONPATH="."
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Run dev server
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## Scientific Evaluation & Benchmarks

Run the metrics benchmark suite to reproduce our research paper results:
```bash
# Run ablation studies and output comparison tables & plots
$env:PYTHONPATH="."
python research/experiments/ablation_runner.py

# Run user study statistical aggregates (N=50 Likert survey analysis)
python research/experiments/user_study_analysis.py

# Run sample datasets and export summary CSVs & charts
python research/experiments/benchmark.py
```
Check `research/tables/` and `research/figures/` for the generated academic outputs.

---

*Built with ❤️ by Anshul Tyagi | B.Tech AMIA | KIET Group of Institutions*
