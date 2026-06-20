import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.metrics.lpips_score import calculate_lpips_score

def main():
    if len(sys.argv) < 3:
        print("Usage: python evaluate_quality.py <original_image> <generated_image>")
        sys.exit(1)
        
    img1 = sys.argv[1]
    img2 = sys.argv[2]
    
    if not os.path.exists(img1) or not os.path.exists(img2):
        print(f"Error: One or both image files not found: {img1}, {img2}")
        sys.exit(1)
        
    score = calculate_lpips_score(img1, img2)
    print(f"LPIPS Perceptual Quality Distance: {score:.4f} (lower is better)")

if __name__ == "__main__":
    main()
