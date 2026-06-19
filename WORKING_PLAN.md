# WORKING_PLAN.md
## StyleMirror AI — Complete Development Roadmap

> **Duration:** 8 Weeks (Adjustable)
> **Solo Developer:** Anshul Tyagi
> **Stack:** React + FastAPI + Python AI Pipeline

---

## Overview: 6-Phase Plan

```
Phase 1 (Week 1)   → Project Setup + Face Analysis Pipeline
Phase 2 (Week 2)   → Backend API + Fashion Recommendation Engine
Phase 3 (Week 3)   → Frontend Core UI + Upload Flow
Phase 4 (Week 4)   → Identity-Preserving Makeover Generation
Phase 5 (Week 5)   → All Recommendation Modules + Style Scoring
Phase 6 (Week 6)   → Chat Assistant + Gallery + Reports
Phase 7 (Week 7)   → UI Polish + Animations + Mobile Responsive
Phase 8 (Week 8)   → Testing + Research Paper Writing + Deployment
```

---

## PHASE 1 — Project Setup + Face Analysis Pipeline
### Week 1 (Days 1–7)

**Goal:** Working backend skeleton + face detection pipeline running locally.

---

### Day 1 — Environment Setup

```bash
# Backend
cd backend
python -m venv venv
pip install fastapi uvicorn[standard] python-multipart
pip install opencv-python mediapipe pillow numpy
pip install sqlalchemy aiosqlite python-dotenv
pip install openai google-generativeai

# Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss @tailwindcss/vite
npm install axios zustand react-router-dom
npm install framer-motion react-dropzone
npm install lucide-react
```

**Deliverables:**
- [ ] `backend/` folder initialized, `uvicorn` running on port 8000
- [ ] `frontend/` folder initialized, Vite dev server on port 5173
- [ ] `.env.example` files created for both
- [ ] Git repo initialized with `.gitignore`

---

### Day 2–3 — Face Analysis Module

**File to build:** `backend/ai/face_analysis.py`

```python
# What this module must do:
# 1. Accept image path or bytes
# 2. Run MediaPipe Face Mesh (468 landmarks)
# 3. Detect face bounding box
# 4. Classify face shape (5 classes)
# 5. Extract dominant skin tone (KMeans on cheek region)
# 6. Estimate hair color (top region sampling)
# 7. Return structured dict
```

**Key functions to implement:**
- `detect_face(image)` → bounding box + confidence
- `extract_landmarks(image)` → 468 (x, y, z) points
- `classify_face_shape(landmarks)` → oval/round/square/heart/diamond
- `extract_skin_tone(image, landmarks)` → hex color + tone name (Fair/Medium/Dark/Deep)
- `estimate_hair_region(image, landmarks)` → color + texture class
- `build_face_description(all_above)` → natural language string for prompting

**Test:** Load 5 sample images, print face_data JSON for each.

---

### Day 4–5 — Style Analysis via Gemini Vision

**File to build:** `backend/ai/style_analyzer.py`

```python
# Gemini Vision call: analyze the image and return:
# - Current clothing style (Casual/Formal/Sporty/Traditional...)
# - Current fashion score (0–10)
# - Notable strengths of current style
# - Notable areas for improvement
# - Apparent aesthetic keywords
```

**Prompt template to craft:**
```
Analyze this person's current style. 
Return a JSON with keys:
current_style, fashion_score (0-10), strengths (list), 
improvements (list), aesthetic_keywords (list).
Be specific and constructive. Do not change the person.
```

**Deliverables:**
- [ ] `face_analysis.py` returning valid JSON for any face photo
- [ ] `style_analyzer.py` returning valid JSON from Gemini
- [ ] Unit test file: `tests/test_face_analysis.py`

---

### Day 6–7 — FastAPI Base + `/analyze` Endpoint

**File to build:** `backend/app/api/analyze.py`

```
POST /api/v1/analyze
  Input:  multipart/form-data { image: File }
  Output: {
    image_id: str,
    face_data: FaceData,
    style_data: StyleAnalysis,
    preview_url: str
  }
```

**Also build:**
- `app/main.py` — FastAPI app, CORS, router registration
- `app/core/config.py` — Settings from `.env`
- `app/models/image.py` — SQLAlchemy Image model
- `app/utils/storage.py` — Save image to local `/uploads` folder

**Deliverables:**
- [ ] `POST /api/v1/analyze` returns full analysis in <5s
- [ ] Image saved to disk, URL returned
- [ ] SQLite DB with `images` table being populated

---

## PHASE 2 — Fashion Recommendation Engine
### Week 2 (Days 8–14)

**Goal:** Full recommendation pipeline: occasion + season + budget → outfit JSON.

---

### Day 8–9 — Recommendation Prompt Engineering

**File to build:** `backend/ai/fashion_engine.py`

This is the most important AI module. Craft these prompts carefully:

```python
SYSTEM_PROMPT = """
You are StyleMirror AI, an expert fashion consultant.
You have deep knowledge of Indian and global fashion.
Given a person's analysis and their preferences, generate
detailed fashion recommendations. Always consider:
- Body type and face shape
- Occasion appropriateness
- Indian climate and culture
- Budget constraints (prices in INR)
- Current fashion trends (2024-2025)

Return ONLY valid JSON matching the schema provided.
"""

def build_recommendation_prompt(face_data, style_data, preferences):
    return f"""
Person Profile:
- Face Shape: {face_data['face_shape']}
- Skin Tone: {face_data['skin_tone']}
- Current Style Score: {style_data['fashion_score']}/10
- Current Aesthetic: {style_data['current_style']}

Preferences:
- Occasion: {preferences['occasion']}
- Season: {preferences['season']}
- Budget: ₹{preferences['budget']}
- Style Input: {preferences['style_input']}

Generate recommendations following this JSON schema:
{RECOMMENDATION_SCHEMA}
"""
```

**JSON Schema to define:**
```json
{
  "outfit": {
    "top": {"item": "", "color": "", "price_range": "", "where_to_buy": ""},
    "bottom": {"item": "", "color": "", "price_range": "", "where_to_buy": ""},
    "full_outfit_description": "",
    "why_this_works": ""
  },
  "hairstyle": {
    "name": "",
    "description": "",
    "suits_face_shape_because": "",
    "maintenance_level": "Low/Medium/High",
    "reference_style": ""
  },
  "makeup": {
    "style": "",
    "key_products": [],
    "color_palette": [],
    "application_tips": ""
  },
  "accessories": [
    {"item": "", "type": "", "color": "", "price_range": ""}
  ],
  "footwear": {"item": "", "color": "", "price_range": ""},
  "color_palette": {
    "primary": [],
    "accent": [],
    "avoid": [],
    "reasoning": ""
  },
  "suggested_fashion_score": 0.0,
  "overall_styling_advice": ""
}
```

---

### Day 10–11 — Color Palette Analyzer

**File to build:** `backend/ai/color_analyzer.py`

```python
# Steps:
# 1. Extract face region from image using MediaPipe bbox
# 2. Sample 100 pixels from cheek + forehead regions
# 3. Apply KMeans (k=3) to find dominant skin tones
# 4. Map dominant color to: Fair/Medium/Wheatish/Dark/Deep
# 5. Use Gemini to generate color palette from skin tone + hair

SKIN_TONE_MAP = {
    'fair':     {'range': (210, 200, 175), 'palette': ['Navy', 'Burgundy', 'Forest Green', 'Camel', 'Ivory']},
    'medium':   {'range': (180, 155, 125), 'palette': ['Coral', 'Teal', 'Olive', 'Royal Blue', 'Rust']},
    'wheatish': {'range': (160, 125, 95),  'palette': ['Magenta', 'Electric Blue', 'Gold', 'White', 'Orange']},
    'dark':     {'range': (120, 85, 65),   'palette': ['Red', 'Yellow', 'Bright Purple', 'Hot Pink', 'Gold']},
    'deep':     {'range': (80, 55, 40),    'palette': ['Cobalt', 'Fuchsia', 'Lime', 'Bright Orange', 'Silver']}
}
```

---

### Day 12–13 — Style Scorer

**File to build:** `backend/ai/style_scorer.py`

```python
# Fashion score rubric (each 0-2 points):
# 1. Fit appropriateness for occasion (0-2)
# 2. Color coordination (0-2)
# 3. Grooming / hairstyle (0-2)
# 4. Accessory game (0-2)
# 5. Overall cohesion (0-2)
# Total: 0-10

# Use Gemini Vision to score each dimension
# Return: { total: float, breakdown: dict, feedback: str }
```

---

### Day 14 — `/recommend` Endpoint

```
POST /api/v1/recommend
  Input:  {
    image_id: str,
    occasion: str,
    season: str,
    budget: int,
    style_input: str
  }
  Output: {
    recommendation_id: str,
    outfit: OutfitRec,
    hairstyle: HairstyleRec,
    makeup: MakeupRec,
    accessories: AccessoryRec[],
    color_palette: ColorPalette,
    current_score: float,
    suggested_score: float
  }
```

**Deliverables:**
- [ ] `fashion_engine.py` returning valid recommendation JSON
- [ ] `color_analyzer.py` returning 6-color palette
- [ ] `style_scorer.py` returning 0–10 score with breakdown
- [ ] `POST /api/v1/recommend` endpoint working end-to-end

---

## PHASE 3 — Frontend Core UI
### Week 3 (Days 15–21)

**Goal:** Complete React app with all pages, routing, and upload flow.

---

### Day 15–16 — Design System + Layout

**Files to build:**
- `src/index.css` — Tailwind config, CSS variables
- `src/components/layout/Navbar.jsx`
- `src/components/layout/PageWrapper.jsx`

**Design Tokens:**
```css
:root {
  --color-bg:         #0A0A0A;   /* near black */
  --color-surface:    #141414;   /* card background */
  --color-border:     #2A2A2A;   /* subtle borders */
  --color-purple:     #8B5CF6;   /* primary accent */
  --color-gold:       #F59E0B;   /* secondary accent */
  --color-text:       #F5F5F5;   /* primary text */
  --color-muted:      #9CA3AF;   /* secondary text */
  --font-display:     'Playfair Display', serif;
  --font-body:        'Inter', sans-serif;
}
```

---

### Day 17 — HomePage + UploadPage

**`/` — HomePage:**
- Hero: "See yourself differently." — animated gradient headline
- 3-step process: Upload → Analyze → Transform
- Feature grid (6 cards)
- CTA button → `/upload`

**`/upload` — UploadPage:**
- Drag-and-drop zone (react-dropzone)
- Image preview
- File validation (size, type)
- "Analyze My Style" button → calls `POST /api/v1/analyze`
- Loading state with step-by-step progress

---

### Day 18 — PreferencesPage

**`/preferences/:imageId`:**
- Face analysis summary displayed (face shape, skin tone, score)
- Occasion selector (pill buttons, icons)
- Season selector (Summer/Winter/Monsoon)
- Budget slider (₹1000 → ₹10000)
- Free text input: "Describe your desired style"
- "Generate Recommendations" → calls `POST /api/v1/recommend`

---

### Day 19–20 — RecommendationsPage

**`/recommendations/:id`:**
- Outfit card (image + description + price range)
- Hairstyle card
- Accessories grid
- Footwear card
- Color palette display (6 swatches with names)
- Fashion score gauges (before/after)
- "Generate My Makeover" CTA → calls `POST /api/v1/makeover`

---

### Day 21 — API Service Layer

**File:** `src/services/api.js`

```javascript
export const analyzeImage = (formData) => 
  axios.post(`${BASE_URL}/api/v1/analyze`, formData);

export const getRecommendations = (payload) =>
  axios.post(`${BASE_URL}/api/v1/recommend`, payload);

export const generateMakeover = (payload) =>
  axios.post(`${BASE_URL}/api/v1/makeover`, payload);

export const sendChatMessage = (messages, imageId) =>
  axios.post(`${BASE_URL}/api/v1/chat`, { messages, image_id: imageId });

export const saveLook = (makeoverId, label) =>
  axios.post(`${BASE_URL}/api/v1/save`, { makeover_id: makeoverId, label });

export const getSavedLooks = () =>
  axios.get(`${BASE_URL}/api/v1/history`);
```

**Deliverables:**
- [ ] All 7 pages built and routed
- [ ] Upload → Analyze → Preferences flow working end-to-end
- [ ] Recommendations page displaying real API data
- [ ] Mobile responsive (tested at 375px)

---

## PHASE 4 — Makeover Generation
### Week 4 (Days 22–28)

**Goal:** Identity-preserving makeover images generating and displaying.

---

### Day 22–23 — Inpainting Mask Builder

**File:** `backend/ai/mask_builder.py`

```python
def build_preservation_mask(image: np.ndarray, landmarks) -> np.ndarray:
    """
    White = PRESERVE (face region)
    Black = MODIFY (hair, body, background)
    """
    h, w = image.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Get face convex hull from landmarks
    face_points = get_face_hull_points(landmarks)
    cv2.fillConvexPoly(mask, face_points, 255)
    
    # Slightly erode to ensure edges are preserved
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.erode(mask, kernel, iterations=2)
    
    return mask
```

---

### Day 24–25 — Makeover Generation Engine

**File:** `backend/ai/makeover.py`

```python
def generate_identity_preserving_makeover(
    original_image: Image,
    face_description: str,       # from face_analysis
    recommendations: dict        # from fashion_engine
) -> str:                        # returns image URL

    # Build the identity-anchoring prompt
    prompt = f"""
    Fashion makeover photograph of a person.
    
    PRESERVE EXACTLY (do not alter):
    - Face shape: {face_description['face_shape']}
    - Eyes: {face_description['eye_description']}
    - Nose: {face_description['nose_description']}
    - Lips: {face_description['lip_description']}
    - Skin tone: {face_description['skin_tone']}
    - Facial structure and proportions
    
    APPLY THESE CHANGES:
    - Hairstyle: {recommendations['hairstyle']['name']}
      {recommendations['hairstyle']['description']}
    - Outfit: {recommendations['outfit']['full_outfit_description']}
    - Makeup: {recommendations['makeup']['style']}
    
    Style: Professional fashion photography, studio lighting,
    clean background. The result must be unmistakably the 
    same person, only their fashion has changed.
    """
    
    # Option A: DALL-E with image editing
    response = openai_client.images.edit(
        model="dall-e-2",
        image=original_image_bytes,
        mask=inpainting_mask_bytes,
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    
    # Option B: If using Stability AI
    # ... SD img2img with mask API call
    
    return response.data[0].url
```

---

### Day 26 — Identity Verification

**File:** `backend/ai/identity_verifier.py`

```python
def verify_identity_preserved(
    original_path: str, 
    generated_url: str
) -> dict:
    """
    Returns similarity score and pass/fail.
    Uses DeepFace cosine similarity.
    """
    from deepface import DeepFace
    
    result = DeepFace.verify(
        img1_path=original_path,
        img2_path=generated_url,
        model_name="VGG-Face",
        distance_metric="cosine"
    )
    
    return {
        'identity_preserved': result['verified'],
        'similarity_score': 1 - result['distance'],
        'threshold': result['threshold']
    }
```

---

### Day 27–28 — MakeoverPage Frontend

**`/makeover/:recommendId`:**
- Before/after image comparison slider (custom CSS)
- Loading animation during generation ("Transforming your look...")
- Generated makeover displayed in full quality
- Identity score badge ("95% identity preserved")
- "Save This Look" button
- "Try Different Style" → back to preferences
- "Download Report" → triggers PDF generation

**Deliverables:**
- [ ] `POST /api/v1/makeover` endpoint returning generated image
- [ ] Identity score > 0.6 verified before returning
- [ ] Before/after slider working on MakeoverPage
- [ ] Save look functionality working

---

## PHASE 5 — All Recommendation Modules
### Week 5 (Days 29–35)

**Goal:** All 12 recommendation modules complete.

| Day | Module |
|-----|--------|
| 29 | Hairstyle recommendation engine (face-shape matrix) |
| 30 | Makeup recommendation module (5 look types) |
| 31 | Accessory recommendation module |
| 32 | Seasonal fashion intelligence (India-specific) |
| 33 | AI fashion trend analysis endpoint |
| 34 | Budget-aware filtering + shopping links |
| 35 | StyleReportPage + PDF generation |

**StyleReportPage includes:**
- Full face analysis summary
- Current vs suggested score
- Recommendation summary
- Color palette visual
- Downloadable PDF (using `reportlab` or `weasyprint`)

---

## PHASE 6 — Chat Assistant + Gallery
### Week 6 (Days 36–42)

**Goal:** Fashion chatbot live, gallery working, reports downloadable.

---

### Day 36–38 — Fashion Chat Assistant

**File:** `backend/app/api/chat.py`

```python
CHAT_SYSTEM_PROMPT = """
You are StyleMirror, a fashion and style expert assistant.
You have access to the user's uploaded image analysis if provided.
Answer all fashion, style, grooming, and outfit questions.
Be specific, encouraging, and practical.
Consider Indian fashion context, climate, and culture.
Keep answers conversational and under 200 words.
"""
```

**Frontend `FashionChatPage`:**
- Chat bubble UI (GPT-powered)
- Suggested starter questions
- Image-aware context (if user has uploaded, mention their face shape etc.)
- Chat history persisted in SQLite

---

### Day 39–40 — Saved Looks Gallery

**`/gallery` — SavedLooksGallery:**
- Grid of saved looks (before/after thumbnails)
- Favourite toggle
- Label/rename look
- Delete look
- Download individual look as image

---

### Day 41–42 — Polish All Pages

- Error boundaries on all pages
- Empty states (no saved looks yet, etc.)
- Toast notifications (look saved, error messages)
- Loading skeletons on recommendation cards

---

## PHASE 7 — UI Polish + Animations
### Week 7 (Days 43–49)

**Goal:** Premium, production-quality UI.

| Day | Task |
|-----|------|
| 43 | Framer Motion page transitions |
| 44 | Animated before/after comparison slider |
| 45 | Loading animation for makeover generation |
| 46 | Color palette reveal animation |
| 47 | Fashion score gauge animation (0 → score) |
| 48 | Mobile responsive testing + fixes |
| 49 | Cross-browser testing |

---

## PHASE 8 — Testing + Research Paper + Deployment
### Week 8 (Days 50–56)

---

### Day 50–51 — Testing

```
Backend tests (pytest):
  ✓ test_face_analysis.py       — 10 sample images
  ✓ test_recommendations.py     — 5 occasion × season combos
  ✓ test_makeover.py            — verify identity score ≥ 0.6
  ✓ test_api_endpoints.py       — all endpoint response codes

Frontend tests (Vitest):
  ✓ UploadZone.test.jsx
  ✓ PreferencesForm.test.jsx
  ✓ RecommendationCard.test.jsx
```

---

### Day 52–53 — Research Paper Writing

**File:** `research/paper_draft.md`

Sections to write:
1. Abstract
2. Introduction (Problem statement, motivation)
3. Related Work (Virtual try-on, style transfer, fashion recommendation)
4. System Architecture
5. Methodology (face analysis, identity preservation, recommendation engine)
6. Identity Preservation Strategy (the 3-layer approach)
7. Evaluation (identity score results, user study plan)
8. Results and Discussion
9. Conclusion and Future Work
10. References

---

### Day 54–55 — Deployment

```bash
# Frontend → Vercel
vercel deploy --prod

# Backend → Railway
railway init
railway up

# Database migration
alembic upgrade head

# Environment variables → set on Railway dashboard
```

---

### Day 56 — Final Review

- [ ] End-to-end demo video recorded
- [ ] README updated with live URLs
- [ ] Research paper draft complete
- [ ] GitHub repo cleaned and documented

---

## Quick Reference: File Creation Order

```
Week 1: backend/ai/face_analysis.py
         backend/ai/style_analyzer.py
         backend/app/main.py
         backend/app/api/analyze.py
         backend/app/core/config.py
         backend/app/models/image.py

Week 2: backend/ai/fashion_engine.py
         backend/ai/color_analyzer.py
         backend/ai/style_scorer.py
         backend/app/api/recommend.py

Week 3: frontend/src/App.jsx
         frontend/src/pages/HomePage.jsx
         frontend/src/pages/UploadPage.jsx
         frontend/src/pages/PreferencesPage.jsx
         frontend/src/pages/RecommendationsPage.jsx
         frontend/src/services/api.js
         frontend/src/store/useAppStore.js

Week 4: backend/ai/mask_builder.py
         backend/ai/makeover.py
         backend/ai/identity_verifier.py
         backend/app/api/makeover.py
         frontend/src/pages/MakeoverPage.jsx
         frontend/src/components/BeforeAfterSlider.jsx

Week 5: backend/ai/hairstyle_engine.py
         backend/ai/makeup_engine.py
         backend/ai/accessory_engine.py
         backend/app/api/report.py
         frontend/src/pages/StyleReportPage.jsx

Week 6: backend/app/api/chat.py
         frontend/src/pages/FashionChatPage.jsx
         frontend/src/pages/SavedLooksGallery.jsx

Week 7: (Polish all existing files — no new modules)

Week 8: backend/tests/
         research/paper_draft.md
         docker/docker-compose.yml
```

---

## Checkpoints for Research Paper Evidence

| Experiment | What to Measure | When |
|---|---|---|
| Face Identity Preservation | Cosine similarity on 20 test images | Week 4 |
| Recommendation Relevance | Manual rating 1–5, 10 scenarios | Week 5 |
| Fashion Score Accuracy | Correlation with expert ratings | Week 5 |
| Color Palette Accuracy | Dermatologist skin tone verification | Week 5 |
| System Latency | End-to-end response time | Week 7 |
| User Satisfaction | Google Form survey (5 users) | Week 8 |

---

*Last updated: June 2026*
*Author: Anshul Tyagi, B.Tech AMIA, KIET*
