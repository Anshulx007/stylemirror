import os
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

# Use one of the existing sample images for testing
TEST_IMAGE_PATH = r"backend/uploads/originals/388f5465-3910-448b-be43-98015d92a2f6.jpg"

def test_full_pipeline():
    # Verify the test image exists
    assert os.path.exists(TEST_IMAGE_PATH), f"Test image not found at {TEST_IMAGE_PATH}. Please ensure a valid image is present."

    # 1. Test image upload and face/style analysis
    with open(TEST_IMAGE_PATH, "rb") as img_file:
        response = client.post(
            "/api/v1/analyze",
            files={"file": ("test.jpg", img_file, "image/jpeg")}
        )
    
    assert response.status_code == 200, f"Analyze failed: {response.text}"
    analysis_data = response.json()
    assert "image_id" in analysis_data
    assert "face_shape" in analysis_data
    assert "skin_tone" in analysis_data
    assert "hair_type" in analysis_data
    assert "current_style" in analysis_data
    assert "fashion_score" in analysis_data
    
    image_id = analysis_data["image_id"]
    print(f"\n[Test] Upload successful. Image ID: {image_id}")
    print(f"[Test] Face shape: {analysis_data['face_shape']}")
    print(f"[Test] Skin tone: {analysis_data['skin_tone']}")


    # 2. Test style recommendation endpoint
    rec_payload = {
        "image_id": image_id,
        "occasion": "Wedding",
        "season": "Summer",
        "budget": 5000,
        "style_input": "Elegant traditional"
    }
    
    response = client.post("/api/v1/recommend", json=rec_payload)
    assert response.status_code == 200, f"Recommendation failed: {response.text}"
    rec_data = response.json()
    assert "recommendation_id" in rec_data
    assert "outfit" in rec_data
    assert "hairstyles" in rec_data
    assert "makeup" in rec_data
    assert "accessories" in rec_data
    
    recommendation_id = rec_data["recommendation_id"]
    print(f"[Test] Recommendation successful. Rec ID: {recommendation_id}")
    print(f"[Test] Recommended outfit tops: {rec_data['outfit']['tops']}")
    print(f"[Test] Recommended hairstyles: {rec_data['hairstyles']}")


    # 3. Test makeover generation endpoint
    makeover_payload = {
        "recommendation_id": recommendation_id
    }
    
    response = client.post("/api/v1/makeover", json=makeover_payload)
    assert response.status_code == 200, f"Makeover failed: {response.text}"
    makeover_data = response.json()
    assert "makeover_url" in makeover_data
    print(f"[Test] Makeover successful. Makeover URL: {makeover_data['makeover_url']}")

    # 4. Test report data and PDF generation endpoints
    response = client.get(f"/api/v1/report/data/{image_id}")
    assert response.status_code == 200, f"Report data failed: {response.text}"
    report_data = response.json()
    assert report_data["image_id"] == image_id
    assert "face_shape" in report_data
    assert "outfit" in report_data
    print(f"[Test] Report JSON successful. Face shape: {report_data['face_shape']}")

    response = client.get(f"/api/v1/report/pdf/{image_id}")
    assert response.status_code == 200, f"Report PDF failed: {response.text}"
    assert response.headers["content-type"] == "application/pdf"
    print(f"[Test] Report PDF generation and stream successful. Size: {len(response.content)} bytes")

if __name__ == "__main__":
    test_full_pipeline()

