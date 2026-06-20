# Benchmark Datasets Notes — StyleMirror AI

To evaluate the identity-preserving virtual makeover model and fashion recommendation systems, we use a hybrid benchmark set drawing from three major public computer vision datasets, along with a custom user-testing cohort:

---

## 1. CelebA Dataset (Celebrity Faces)
* **Purpose**: Evaluate **Identity Preservation** (face mesh similarity and ArcFace embeddings preservation) on a wide range of facial geometry profiles and hairstyles.
* **Volume**: 20 high-quality frontal portraits selected from the validation set representing balanced gender and age coordinates.
* **Usage**: Image pairs (Original Frontal vs. Generated Makeover) are evaluated using `evaluate_identity.py`.

---

## 2. DeepFashion Dataset (Clothing)
* **Purpose**: Validate **Style Adherence** (CLIP semantic score mapping) and color undertone accuracy on diverse outfits and fabrics.
* **Volume**: 15 full-length or upper-body fashion photos selected to represent Formal, Casual, Traditional, and Sporty categories.
* **Usage**: Extracted outfits are mapped against text recommendations to calculate CLIP scores using `evaluate_style.py`.

---

## 3. FFHQ (Flickr-Faces-HQ)
* **Purpose**: Assess **Perceptual Image Quality** (LPIPS structural loss distance) under challenging camera exposure settings.
* **Volume**: 15 ultra-high-resolution frontal portraits.
* **Usage**: Used as the baseline for evaluating background segmentation masks and noise/face artifacts via `evaluate_quality.py`.

---

## 4. User Images Cohort
* **Purpose**: Conduct **User Satisfaction** evaluation ($N=50$) and measure style scorer delta improvement.
* **Volume**: 50 custom uploaded portraits from real testing participants.
* **Usage**: Aggregates Likert scale metrics (Mean, Std Dev, 95% Confidence Intervals) using `user_study_analysis.py`.
