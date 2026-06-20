import os
import sys
# Make sure project root is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.metrics.arcface_score import calculate_arcface_similarity

def main():
    if len(sys.argv) < 3:
        print("Usage: python evaluate_identity.py <original_image> <generated_image>")
        sys.exit(1)
        
    img1 = sys.argv[1]
    img2 = sys.argv[2]
    
    if not os.path.exists(img1) or not os.path.exists(img2):
        print(f"Error: One or both image files not found: {img1}, {img2}")
        sys.exit(1)
        
    score = calculate_arcface_similarity(img1, img2)
    print(f"ArcFace Identity Similarity: {score:.4f}")

if __name__ == "__main__":
    main()
