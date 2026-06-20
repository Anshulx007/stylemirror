import numpy as np
import math

def calculate_confidence_interval(data: list, confidence: float = 0.95) -> tuple:
    """
    Calculates the margin of error and 95% confidence bounds.
    """
    n = len(data)
    if n <= 1:
        return 0.0, (0.0, 0.0)
    mean = np.mean(data)
    std_err = np.std(data, ddof=1) / math.sqrt(n)
    
    # 1.96 is critical z-score for 95% confidence
    margin_of_error = 1.96 * std_err
    return margin_of_error, (mean - margin_of_error, mean + margin_of_error)

def analyze_user_study(responses: list) -> dict:
    """
    Processes user study survey lists.
    Calculates Mean, Standard Deviation, and 95% Confidence Intervals for:
      - Identity Preservation
      - Realism
      - Style Satisfaction
      - Recommendation Quality
      - Overall Experience
    """
    metrics = ['identity', 'realism', 'style_satisfaction', 'recommendation_quality', 'overall_experience']
    summary = {}
    
    for metric in metrics:
        values = [r.get(metric) for r in responses if metric in r]
        if not values:
            continue
            
        mean = float(np.mean(values))
        std = float(np.std(values, ddof=1)) if len(values) > 1 else 0.0
        margin, (lower_bound, upper_bound) = calculate_confidence_interval(values)
        
        summary[metric] = {
            "mean": round(mean, 2),
            "std": round(std, 2),
            "margin_of_error": round(margin, 2),
            "confidence_interval": (round(lower_bound, 2), round(upper_bound, 2))
        }
        
    return summary
