import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.metrics.clip_score import calculate_clip_score

def main():
    if len(sys.argv) < 3:
        print("Usage: python evaluate_style.py <image_path> <style_prompt>")
        sys.exit(1)
        
    img_path = sys.argv[1]
    prompt = sys.argv[2]
    
    if not os.path.exists(img_path):
        print(f"Error: Image file not found at {img_path}")
        sys.exit(1)
        
    score = calculate_clip_score(img_path, prompt)
    print(f"CLIP Style Adherence Score: {score:.4f}")

if __name__ == "__main__":
    main()
