# Project Demo Script & Video Storyboard — StyleMirror AI

This document outlines the demo walkthrough script and screen recording instructions for the StyleMirror AI final project presentation.

---

## Part 1: Hero Landing Page (0:00 - 0:20)
* **Visuals**: Show the React homepage with the glowing radial background, animated gradient text "See yourself in style coordinates," and feature cards.
* **Audio / Voiceover**: 
  > "Welcome to the StyleMirror AI project demonstration. StyleMirror is a personalized fashion styling assistant that analyzes your facial structure and skin undertones, provides occasion and budget-appropriate clothing recommendations, and generates a visual makeover while strictly preserving your identity."

---

## Part 2: Webcam Stream & Capture (0:20 - 0:50)
* **Visuals**: Click 'Get Started' to navigate to the `/upload` page. Toggle the "Use Camera" tab. Show a live webcam stream with the pulsing red recording dot. Click the shutter button to capture the photo.
* **Audio / Voiceover**:
  > "We navigate to the upload panel, which supports local image file drag-and-drops or a real-time webcam stream using HTML5 MediaDevices API. By capturing a snapshot, our system automatically formats the file and sends it to the FastAPI backend."

---

## Part 3: Facial & Undertone Analysis (0:50 - 1:20)
* **Visuals**: Show the loading spinner and then the `/preferences` page displaying the extracted visual coordinates (Face Shape: Diamond, Skin Undertone: Cool, Hair Type: Wavy, Current Style: Casual, Fashion Score: 7.1/10).
* **Audio / Voiceover**:
  > "In less than three seconds, the analysis engine completes. Utilizing MediaPipe Face Mesh and cheek region color histograms, it maps key coordinates—such as face shape lines, hair texture, and cool skin undertones—which are persisted locally in our Zustand stores."

---

## Part 4: Recommendation Preferences Form (1:20 - 2:00)
* **Visuals**: Fill in the form: Occasion: Festive, Season: Winter, Budget: 5000 INR, Gender Category: Male, Color Theme: Neutral Tones. Click 'Generate Recommendations'. Show the loading screen, then the `/recommendations` page rendering Outfit Set, Hairstyles, Accessory Grid, and the Color Palette Card.
* **Audio / Voiceover**:
  > "We select our styling preferences. Let's input 'Festive', 'Winter', 'Neutral Tones', and a budget threshold of 5000 Rupees. Our backend rules engine evaluates the face shape and undertones to deliver customized outfit coordinates, recommended hairstyles, accessories, and best colors to wear."

---

## Part 5: PDF Styling Report Download (2:00 - 2:30)
* **Visuals**: Click "View Detailed Report" to open the `/report` page showing the full summary list. Click "Download PDF". Show a new browser tab opening with a beautifully laid out PDF document displaying the tables, title, and generated date.
* **Audio / Voiceover**:
  > "To complete the session, users can view a unified Style Coordinates Report and download it as a publication-ready PDF document. The report is generated dynamically on the fly using reportlab, suitable for sharing or offline reference."
