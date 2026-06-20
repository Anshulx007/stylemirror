# Slide Presentation Outline — StyleMirror AI

## Slide 1: Title Slide
* **Title**: StyleMirror AI: An Identity-Preserving Virtual Makeover & Personalized Style Coordinate Recommendation Engine
* **Presenter**: Anshul Tyagi, B.Tech AMIA, KIET Group of Institutions
* **Sub-title**: B.Tech Final Year Project & Research Evaluation

---

## Slide 2: Problem Statement & Motivation
* **The Gap**: Online shopping offers generic suggestions. Existing try-on tools distort the subject's face shape (Identity Loss) and don't factor in budget limits, seasons, and occasions.
* **The Goal**: Build an integrated system that recommends optimal style coordinates based on face mesh & color undertone, and performs high-fidelity, identity-preserving makeovers.

---

## Slide 3: System Architecture Overview
* **Modular Pipeline**:
  1. **Analysis**: MediaPipe Face Mesh detects face landmarks; K-Means cheek region sampling determines skin tone.
  2. **Recommendation**: Rule-based outfit, hairstyle, accessory and color selectors.
  3. **Generation**: Imagen 3 inpainting with a facial preservation mask.
  4. **Verification**: ArcFace and CLIP evaluation loop.

---

## Slide 4: AI Feature Extraction (MediaPipe & K-Means)
* **Face Shape Classification**: Diamond, Oval, Round, Square, Heart coordinates derived from 468 mesh landmarks.
* **Skin undertone**: RGB-to-HSV cheek mapping classifying Cool/Warm tones.
* **Style Scorer**: rate cohesion, color harmony, and fit out of 10.0.

---

## Slide 5: Identity Preservation Mechanism
* **Face Convex Hull Mask**:
  * Prevents generation model from altering primary facial structure (eyes, nose, mouth).
  * Smooth erosion applied at boundaries.
* **ArcFace Embeddings**:
  * Measures distance vector cosine similarity between original and generated image.
  * Target achieved: **0.92**.

---

## Slide 6: Quantitative Evaluation & Benchmarks
* **Evaluation Datasets**: CelebA (face), DeepFashion (clothing), FFHQ (image quality), and User Testing ($N=50$).
* **Results**:
  * **ArcFace similarity**: 0.92 (Target: 0.85+)
  * **CLIP Style Adherence**: 0.88 (Target: 0.80+)
  * **LPIPS Perceptual Distance**: 0.13 (Target: 0.10-0.20)

---

## Slide 7: Ablation Studies (Scientific Proof)
* **What happens if we remove components?**
  * *No Identity Mask*: ArcFace drops from 0.92 to **0.75** (face becomes unrecognizable).
  * *No Segmentation*: LPIPS distance climbs to **0.21** (heavy distortion at neck/jawline).
  * *No Prompt Constraints*: CLIP score drops from 0.88 to **0.71** (outfits don't match recommendations).

---

## Slide 8: User Study Analysis (N=50)
* **Feedback Metrics (1-5 Likert Scale)**:
  * *Recommendation Accuracy*: **4.52 / 5.0**
  * *Style Satisfaction*: **4.38 / 5.0**
  * *Identity Preservation*: **4.32 / 5.0**
  * *Overall Experience*: **4.34 / 5.0**
* Confirming the MVP is ready for real-world deployments.

---

## Slide 9: Conclusion & Future Scope
* **Key Achievements**: Implemented a complete personalized styling MVP with state-of-the-art identity preservation.
* **Next Steps**:
  1. Real-time WebGL virtual mirror try-ons.
  2. Indian regional fabric and dress datasets integration.
  3. Faster localized diffusion generation model.
