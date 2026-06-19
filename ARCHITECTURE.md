# ARCHITECTURE.md
## StyleMirror AI — System Architecture

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                               │
│                       React + Vite (SPA)                            │
│   Pages: Home │ Upload │ Preferences │ Makeover │ Report │ Chat     │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS REST (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                                │
│                    Python 3.11 — Port 8000                          │
│                                                                     │
│  /api/analyze     /api/recommend   /api/makeover   /api/chat       │
│  /api/score       /api/palette     /api/save       /api/history    │
└──────────┬─────────────────┬──────────────────┬────────────────────┘
           │                 │                  │
     ┌─────▼──────┐   ┌──────▼──────┐   ┌──────▼──────────┐
     │ AI PIPELINE│   │  DB LAYER   │   │  IMAGE STORAGE  │
     │  Modules   │   │  SQLite /   │   │  AWS S3 /       │
     │            │   │  PostgreSQL │   │  Local FS       │
     └─────┬──────┘   └─────────────┘   └─────────────────┘
           │
     ┌─────▼──────────────────────────────────────────────┐
     │               EXTERNAL AI SERVICES                 │
     │                                                    │
     │  OpenAI GPT-4o ──── Fashion recs + Chat            │
     │  Gemini Vision ──── Image analysis                 │
     │  DALL-E 3 / SD ──── Makeover image generation      │
     │  MediaPipe ─────── Face mesh (local, no API cost) │
     └────────────────────────────────────────────────────┘
```

---

## 2. AI Pipeline — Detailed Flow

```
USER UPLOADS IMAGE
       │
       ▼
┌──────────────────────────────────────────────────┐
│  STAGE 1: FACE ANALYSIS (Local — MediaPipe)      │
│                                                  │
│  • Face detection (bounding box)                 │
│  • 468-point face mesh landmarks                 │
│  • Face shape classification                     │
│    (Oval / Round / Square / Heart / Diamond)     │
│  • Skin tone extraction (KMeans on cheek region) │
│  • Hair type estimation (texture + color)        │
│  • Gender presentation inference                 │
│  Output: face_data JSON                          │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  STAGE 2: STYLE ANALYSIS (Gemini Vision API)     │
│                                                  │
│  • Current clothing style detection              │
│  • Current fashion score (0–10)                  │
│  • Apparent aesthetic (Casual/Formal/Sporty...)  │
│  • Body proportion estimation                    │
│  Output: style_analysis JSON                     │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  STAGE 3: PREFERENCE INPUT (User Input)          │
│                                                  │
│  • Occasion: [College / Interview / Party / ...] │
│  • Season:   [Summer / Winter / Monsoon]         │
│  • Budget:   [₹1000 / ₹3000 / ₹5000 / ₹10000]  │
│  • Style:    [Korean / Western / Traditional...] │
│  • Colors:   [User preference]                   │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  STAGE 4: RECOMMENDATION ENGINE (GPT-4o)         │
│                                                  │
│  Inputs: face_data + style_analysis + prefs      │
│                                                  │
│  Generates:                                      │
│  • Outfit recommendation (top, bottom, full)     │
│  • Hairstyle recommendation                      │
│  • Makeup style recommendation                   │
│  • Accessory recommendations (3–5 items)         │
│  • Footwear recommendation                       │
│  • Color palette (6 recommended colors)          │
│  • Suggested fashion score (0–10)                │
│  • Styling explanation (2–3 paragraphs)          │
│  Output: recommendations JSON                    │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  STAGE 5: IDENTITY-PRESERVING MAKEOVER GEN       │
│           (DALL-E 3 / Stable Diffusion img2img)  │
│                                                  │
│  IDENTITY ANCHOR STRATEGY:                       │
│  1. Extract face region via MediaPipe bbox       │
│  2. Build detailed facial description from       │
│     landmark data (face shape, eye color, etc.)  │
│  3. Construct inpainting mask:                   │
│     PRESERVE = face region (eyes, nose, mouth)   │
│     MODIFY   = hair, clothing, background        │
│  4. Send to DALL-E with strict identity prompt:  │
│     "Same person, same face, same [features]..." │
│  5. Post-process: face-swap verification via     │
│     cosine similarity of face embeddings         │
│                                                  │
│  Output: makeover_image_url                      │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│  STAGE 6: STYLE REPORT GENERATION               │
│                                                  │
│  • Before/After score comparison                 │
│  • Personalized PDF report                       │
│  • Color palette visualization                   │
│  • Save to user gallery                          │
└──────────────────────────────────────────────────┘
```

---

## 3. Identity Preservation — Technical Strategy

This is the **core research contribution**. Three-layered approach:

### Layer 1 — Prompt Engineering (Soft Constraint)
```
System prompt:
"You are generating a fashion makeover for a person.
CRITICAL: Do NOT change any facial features.
The output must look like the EXACT same person.
Preserve: face shape, eye shape/color, nose structure, 
lip shape, skin tone, facial proportions.
Only change: hairstyle, clothing, accessories, makeup."
```

### Layer 2 — Inpainting Mask (Hard Constraint)
```python
# MediaPipe face mesh gives 468 landmarks
# Build a convex hull around face landmarks
# Create binary mask:
#   White (255) = PRESERVE (face region)
#   Black (0)   = MODIFY (hair, body, background)
# Pass mask to SD inpainting / DALL-E edit endpoint
```

### Layer 3 — Post-Generation Verification
```python
# Use face_recognition library or DeepFace
# Compute cosine similarity of embeddings:
#   original_face_embedding vs generated_face_embedding
# If similarity < 0.6: regenerate or flag for review
# This ensures identity is actually preserved
```

---

## 4. API Endpoints

```
POST   /api/v1/analyze          # Upload image, run face + style analysis
POST   /api/v1/recommend        # Get fashion recommendations
POST   /api/v1/makeover         # Generate identity-preserving makeover
GET    /api/v1/score/{image_id} # Get fashion score for an image
POST   /api/v1/chat             # Fashion assistant chat
GET    /api/v1/palette/{image_id}# Get color palette recommendations
POST   /api/v1/save             # Save a look to gallery
GET    /api/v1/history          # Get saved looks
DELETE /api/v1/history/{id}     # Delete a saved look
GET    /api/v1/report/{id}      # Download style report
POST   /api/v1/compare          # Compare two looks
```

---

## 5. Database Schema

```sql
-- Users (optional login, or session-based)
CREATE TABLE sessions (
    id          TEXT PRIMARY KEY,  -- UUID
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_hash     TEXT
);

-- Uploaded images
CREATE TABLE images (
    id          TEXT PRIMARY KEY,
    session_id  TEXT REFERENCES sessions(id),
    s3_url      TEXT NOT NULL,
    face_data   JSON,          -- MediaPipe analysis result
    style_data  JSON,          -- Gemini analysis result
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations
CREATE TABLE recommendations (
    id              TEXT PRIMARY KEY,
    image_id        TEXT REFERENCES images(id),
    occasion        TEXT,
    season          TEXT,
    budget          INTEGER,
    outfit          JSON,
    hairstyle       JSON,
    accessories     JSON,
    color_palette   JSON,
    fashion_score   REAL,        -- current score
    suggested_score REAL,        -- after makeover score
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Makeover results
CREATE TABLE makeovers (
    id                  TEXT PRIMARY KEY,
    recommendation_id   TEXT REFERENCES recommendations(id),
    original_url        TEXT,
    generated_url       TEXT,
    identity_score      REAL,   -- cosine similarity 0-1
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Saved looks (user gallery)
CREATE TABLE saved_looks (
    id              TEXT PRIMARY KEY,
    session_id      TEXT,
    makeover_id     TEXT REFERENCES makeovers(id),
    label           TEXT,       -- user-given name
    is_favourite    BOOLEAN DEFAULT FALSE,
    saved_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat history
CREATE TABLE chat_messages (
    id          TEXT PRIMARY KEY,
    session_id  TEXT,
    role        TEXT,  -- 'user' | 'assistant'
    content     TEXT,
    timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Frontend Page Architecture

```
App (React Router v6)
├── /                          → HomePage
├── /upload                    → UploadPage
├── /preferences/:imageId      → PreferencesPage
├── /makeover/:recommendId     → MakeoverPage
├── /recommendations/:id       → RecommendationsPage
├── /report/:id                → StyleReportPage
├── /chat                      → FashionChatPage
└── /gallery                   → SavedLooksGallery

Component Tree (shared):
├── Navbar
├── Sidebar (mobile drawer)
├── UploadZone (drag-and-drop)
├── FacePreview (original + overlay)
├── MakeoverViewer (before/after slider)
├── RecommendationCard
├── ColorPaletteDisplay
├── FashionScoreGauge
├── ChatBubble
└── LookCard (gallery item)
```

---

## 7. State Management (Zustand)

```javascript
// Global app state
{
  session: {
    id: string,
    imageId: string | null,
    analysisData: FaceAnalysis | null,
    recommendationId: string | null,
    makeoverId: string | null
  },
  preferences: {
    occasion: string,
    season: string,
    budget: number,
    styleInput: string,
    colorPreferences: string[]
  },
  ui: {
    isLoading: boolean,
    currentStep: number,   // 1-6 pipeline steps
    error: string | null
  }
}
```

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                           │
│                                                         │
│  Vercel (Frontend) ──── React SPA, Edge CDN             │
│  Railway (Backend)  ──── FastAPI, auto-scaling          │
│  Neon / Supabase    ──── PostgreSQL                     │
│  Cloudflare R2      ──── Image storage (S3-compatible)  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                          │
│                                                         │
│  localhost:5173  ──── Vite dev server                  │
│  localhost:8000  ──── FastAPI + uvicorn                 │
│  SQLite file     ──── stylemirror.db                   │
│  Local /uploads  ──── Image storage                    │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Security Considerations

- Image uploads: max 10MB, MIME validation (JPEG/PNG only)
- No user PII stored — session-based, no login required
- API keys stored server-side only, never exposed to frontend
- Generated makeover images watermarked with session ID
- Face data (landmarks) deleted after session expires (24h)
- CORS configured to frontend domain only in production

---

## 10. Cost Estimation (Per User Session)

| API Call | Model | Approx Cost |
|---|---|---|
| Style analysis | Gemini Vision | ~$0.001 |
| Fashion recommendations | GPT-4o (1500 tokens) | ~$0.015 |
| Makeover generation | DALL-E 3 (1024×1024) | ~$0.04 |
| Chat (3 messages) | GPT-4o (500t each) | ~$0.015 |
| **Total per session** | | **~$0.07** |

At ₹5/session → viable for research demo. Production would require auth + rate limiting.
