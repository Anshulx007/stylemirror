import os

base_dir = r"c:\Users\hp\mirrorai"

files = [
    "README.md",
    "ARCHITECTURE.md",
    "RESEARCH_METHODOLOGY.md",
    "WORKING_PLAN.md",
    "backend/.env",
    "backend/.env.example",
    "backend/requirements.txt",
    "backend/app/main.py",
    "backend/app/api/analyze.py",
    "backend/app/api/recommend.py",
    "backend/app/api/makeover.py",
    "backend/app/api/report.py",
    "backend/app/api/chat.py",
    "backend/app/api/camera.py",
    "backend/app/core/config.py",
    "backend/app/models/image.py",
    "backend/services/recommendation_service.py",
    "backend/services/makeover_service.py",
    "backend/services/report_service.py",
    "backend/services/chatbot_service.py",
    "backend/services/camera_service.py",
    "backend/ai/face_analysis.py",
    "backend/ai/style_analyzer.py",
    "backend/ai/style_scorer.py",
    "backend/ai/color_analyzer.py",
    "backend/ai/fashion_engine.py",
    "backend/ai/hairstyle_engine.py",
    "backend/ai/makeup_engine.py",
    "backend/ai/accessory_engine.py",
    "backend/ai/mask_builder.py",
    "backend/ai/identity_verifier.py",
    "backend/ai/makeover.py",
    "backend/ai/models/face_landmarker.task",
    "backend/database/db.py",
    "backend/database/session.py",
    "backend/database/base.py",
    "backend/schemas/image_schema.py",
    "backend/schemas/recommendation_schema.py",
    "backend/schemas/report_schema.py",
    "backend/schemas/chat_schema.py",
    "backend/prompts/fashion_prompt.py",
    "backend/prompts/makeover_prompt.py",
    "backend/prompts/report_prompt.py",
    "backend/prompts/chatbot_prompt.py",
    "backend/utils/image_utils.py",
    "backend/utils/color_utils.py",
    "backend/utils/logger.py",
    "backend/utils/file_utils.py",
    "backend/tests/test_api_endpoints.py",
    "backend/tests/test_face_analysis.py",
    "backend/tests/test_makeover.py",
    "backend/tests/test_recommendations.py",
]

dirs = [
    "backend/uploads/originals",
    "backend/uploads/temp",
    "backend/generated/hairstyles",
    "backend/generated/outfits",
    "backend/generated/accessories",
    "backend/generated/final_makeovers",
    "backend/reports/pdf",
    "backend/reports/csv",
    "backend/static/examples",
    "backend/static/icons",
    "backend/static/images",
]

for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

for f in files:
    full_path = os.path.join(base_dir, f)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    if not os.path.exists(full_path):
        with open(full_path, 'w') as file:
            pass

print("Structure created successfully.")
