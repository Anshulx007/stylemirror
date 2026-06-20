import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_style_report(db_image, db_look, output_path: str):
    """
    Generates a premium styled PDF report summarizing the visual analysis and styling recommendations.
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 1. Fetch data with safe fallbacks
    face_data = db_image.face_data or {}
    style_data = db_image.style_data or {}
    
    face_shape = face_data.get("face_shape", "N/A")
    hair_type = face_data.get("hair_type", "N/A")
    skin_tone = style_data.get("skin_tone", "N/A")
    current_style = style_data.get("current_style", "N/A")
    fashion_score = style_data.get("fashion_score", 0.0)
    
    recs = db_look.recommendations or {} if db_look else {}
    outfit = recs.get("outfit", {})
    hairstyles = recs.get("hairstyles", [])
    accessories = recs.get("accessories", {})
    palette = recs.get("palette", {})
    makeup = recs.get("makeup", {})
    
    # Setup document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    story = []
    
    # Color scheme
    c_primary = colors.HexColor("#8B5CF6")   # Purple
    c_secondary = colors.HexColor("#F59E0B") # Gold/Orange
    c_dark = colors.HexColor("#0A0A0A")      # Near Black
    c_text = colors.HexColor("#2A2A2A")      # Charcoal
    c_light = colors.HexColor("#F9F9FB")     # Off White
    c_border = colors.HexColor("#E5E7EB")    # Gray Border
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=c_primary,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#6B7280"),
        spaceAfter=20
    )
    
    section_title = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=c_primary,
        spaceBefore=15,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=c_text,
        leading=14
    )
    
    label_style = ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=c_dark
    )

    # Document Header
    story.append(Paragraph("StyleMirror AI — Styling Report", title_style))
    story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')} | Profile ID: {db_image.id}", subtitle_style))
    story.append(Spacer(1, 10))
    
    # --- SECTION 1: VISUAL PROFILE ---
    story.append(Paragraph("1. Visual Aesthetic Coordinates", section_title))
    
    profile_data = [
        [Paragraph("Face Shape", label_style), Paragraph(face_shape.capitalize(), body_style),
         Paragraph("Skin Tone", label_style), Paragraph(skin_tone.capitalize(), body_style)],
        [Paragraph("Hair Type", label_style), Paragraph(hair_type.capitalize(), body_style),
         Paragraph("Current Style", label_style), Paragraph(current_style.capitalize(), body_style)],
        [Paragraph("Fashion Score", label_style), Paragraph(f"{fashion_score:.1f} / 10.0", body_style),
         Paragraph("", label_style), Paragraph("", body_style)]
    ]
    
    t_profile = Table(profile_data, colWidths=[100, 160, 100, 160])
    t_profile.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_profile)
    story.append(Spacer(1, 20))
    
    # --- SECTION 2: RECOMMENDATIONS ---
    story.append(Paragraph("2. Styling Coordination Recommendations", section_title))
    
    # Tops / Bottoms / Footwear
    tops_str = ", ".join(outfit.get("tops", [])) or "N/A"
    bottoms_str = ", ".join(outfit.get("bottoms", [])) or "N/A"
    footwear_str = ", ".join(outfit.get("footwear", [])) or "N/A"
    
    outfit_data = [
        [Paragraph("Outfit Tops", label_style), Paragraph(tops_str, body_style)],
        [Paragraph("Outfit Bottoms", label_style), Paragraph(bottoms_str, body_style)],
        [Paragraph("Footwear", label_style), Paragraph(footwear_str, body_style)]
    ]
    
    t_outfit = Table(outfit_data, colWidths=[120, 400])
    t_outfit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), c_light),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_outfit)
    story.append(Spacer(1, 15))
    
    # Hairstyles
    hair_str = ", ".join(hairstyles) or "N/A"
    
    # Accessories
    watch_str = accessories.get("watch", "N/A")
    belt_str = accessories.get("belt", "N/A")
    glasses_str = accessories.get("glasses", "N/A")
    acc_str = f"Watch: {watch_str} | Belt: {belt_str} | Glasses: {glasses_str}"
    
    # Makeup & Grooming
    m_look = makeup.get("look", "N/A")
    m_lip = makeup.get("lip_color", "N/A")
    m_eye = makeup.get("eye_style", "N/A")
    m_found = makeup.get("foundation", "N/A")
    makeup_str = f"Look: {m_look} | Lip: {m_lip} | Eye: {m_eye} | Foundation: {m_found}"
    
    extra_data = [
        [Paragraph("Hairstyles", label_style), Paragraph(hair_str, body_style)],
        [Paragraph("Accessories", label_style), Paragraph(acc_str, body_style)],
        [Paragraph("Makeup & Grooming", label_style), Paragraph(makeup_str, body_style)]
    ]
    
    t_extra = Table(extra_data, colWidths=[120, 400])
    t_extra.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), c_light),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_extra)
    story.append(Spacer(1, 20))
    
    # --- SECTION 3: COLOR PALETTE ---
    story.append(Paragraph("3. Color Palette Guidance", section_title))
    
    best_colors = ", ".join(palette.get("best_colors", [])) or "N/A"
    avoid_colors = ", ".join(palette.get("avoid", [])) or "N/A"
    
    palette_data = [
        [Paragraph("Best Colors to Wear", label_style), Paragraph(best_colors, body_style)],
        [Paragraph("Colors to Avoid", label_style), Paragraph(avoid_colors, body_style)]
    ]
    
    t_palette = Table(palette_data, colWidths=[120, 400])
    t_palette.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), c_light),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_palette)
    story.append(Spacer(1, 30))
    
    # Footer Note
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor("#9CA3AF"),
        alignment=1 # Center alignment
    )
    story.append(Paragraph("StyleMirror AI - Dynamic styling coordinates generated by Gemini Vision & MediaPipe Pipeline.", footer_style))
    
    # Build PDF
    doc.build(story)
