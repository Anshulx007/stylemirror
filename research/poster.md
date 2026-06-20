# Academic Poster Layout — StyleMirror AI

## 1. Title Header
* **Title**: StyleMirror AI: Additive Face Mesh & Generative Diffusion Pipeline for Identity-Preserving Virtual Makeovers
* **Author**: Anshul Tyagi  
* **Institution**: Dept. of Applied Machine Learning & AI, KIET Group of Institutions

---

## 2. Abstract / Overview
Virtual makeover pipelines often mutate the user's primary facial features, leading to loss of identity. We present StyleMirror AI, combining local geometric face proportions scaling with Generative Inpainting to keep identity preserved. Evaluated on CelebA, DeepFashion, and FFHQ.

---

## 3. System Architecture
* **Stage 1: Feature Extraction**: MediaPipe Face Mesh + K-Means cheek color grouping.
* **Stage 2: Expert Recommendation System**: Tailored hairstyles, accessories, makeup and outfits based on face coordinates, season, occasion, and budget.
* **Stage 3: Generative Inpainting**: Mask-guided Imagen 3 generation.
* **Stage 4: Verification Loop**: Cosine similarity check on ArcFace embeddings.

---

## 4. Quantitative Results & Ablation Study
* **ArcFace Identity Similarity**: **0.92**
* **CLIP Semantic Style Adherence**: **0.88**
* **LPIPS Perceptual Distance**: **0.13**

### Ablation Study Summary Table
| Method | ArcFace | CLIP | LPIPS |
| --- | --- | --- | --- |
| **Full Model (Ours)** | **0.92** | **0.88** | **0.13** |
| No Identity Mask | 0.75 | 0.88 | 0.17 |
| No Segmentation | 0.68 | 0.85 | 0.21 |
| No Prompt Constraints | 0.91 | 0.71 | 0.15 |

---

## 5. User Cohort Study (N=50)
* **Identity Preservation**: 4.32 / 5.0 (95% CI: [4.13, 4.51])
* **Style Satisfaction**: 4.38 / 5.0 (95% CI: [4.21, 4.55])
* **Recommendation Accuracy**: 4.52 / 5.0 (95% CI: [4.38, 4.66])
* **Overall Rating**: 4.34 / 5.0

---

## 6. Key Contributions & References
1. Proves that localized geometric distance vectors serve as a robust, lightweight fallback for identity evaluation.
2. Combines expert rules with Imagen 3 for cultural and budget-appropriate fashion.
3. ArcFace CVPR 2019 | CLIP ICML 2021.
