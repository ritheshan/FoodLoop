from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import google.generativeai as genai
import io
import os
from dotenv import load_dotenv
import time
from typing import List, Dict, Any, Optional
import json

load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Food Quality Assessment API", 
              description="An API for assessing food quality using computer vision and Gemini AI",
              version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-2.5-pro-preview-03-25")

# Cache for storing food reference data
FOOD_REFERENCE_CACHE = {}

# Utility functions
def calculate_avg_hsv(image: Image.Image):
    hsv_image = image.convert("HSV")
    hsv_array = np.array(hsv_image)
    avg_h = np.mean(hsv_array[:, :, 0])
    avg_s = np.mean(hsv_array[:, :, 1])
    avg_v = np.mean(hsv_array[:, :, 2])
    return round(avg_h, 2), round(avg_s, 2), round(avg_v, 2)

def calculate_brightness(image: Image.Image):
    grayscale = image.convert("L")
    arr = np.array(grayscale)
    return round(np.mean(arr), 2)

def calculate_vibrancy(image: Image.Image):
    image = image.convert("RGB")
    arr = np.array(image)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    return round(np.std([r, g, b]), 2)

def calculate_color_distribution(image: Image.Image):
    """Calculate color distribution in RGB space"""
    image = image.convert("RGB")
    colors = image.getcolors(image.width * image.height)
    if colors:
        colors = sorted(colors, key=lambda x: x[0], reverse=True)
        top_colors = colors[:5]
        return [(count, rgb) for count, rgb in top_colors]
    return []

def detect_mold_patterns(image: Image.Image):
    """Detect potential mold patterns based on color anomalies"""
    # Simple implementation - looks for blue/green/gray spots in unusual contexts
    image = image.convert("RGB")
    arr = np.array(image)
    
    # Define possible mold colors (in RGB)
    mold_colors = [
        ([0, 0, 100], [100, 100, 255]),  # Blue range
        ([0, 100, 0], [100, 255, 100]),  # Green range
        ([100, 100, 100], [180, 180, 180])  # Gray range
    ]
    
    # Calculate percentage of pixels that might be mold
    total_pixels = arr.shape[0] * arr.shape[1]
    mold_pixels = 0
    
    for lower, upper in mold_colors:
        mask = np.all((arr >= lower) & (arr <= upper), axis=2)
        mold_pixels += np.sum(mask)
    
    mold_percentage = round((mold_pixels / total_pixels) * 100, 2)
    return mold_percentage

def get_reference_data(food_name: str) -> Dict[str, Any]:
    """Get reference data for a specific food item from cache or generate it"""
    if food_name in FOOD_REFERENCE_CACHE:
        return FOOD_REFERENCE_CACHE[food_name]
    
    # Generate reference data using Gemini
    prompt = f"""
    I need reference data for a food quality assessment system for "{food_name}".
    Please provide the following information in JSON format:
    
    1. Expected HSV ranges (hue, saturation, value) for fresh {food_name}
    2. Expected brightness range
    3. Expected vibrancy range
    4. Common visual indicators of spoilage or staleness
    5. Typical shelf life in days
    
    Format the response as valid JSON only, no explanations.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        reference_data = json.loads(response.text)
        FOOD_REFERENCE_CACHE[food_name] = reference_data
        return reference_data
    except Exception as e:
        # Fallback with default values if Gemini fails
        return {
            "hsv_range": {"h": [0, 360], "s": [0, 100], "v": [0, 100]},
            "brightness_range": [0, 255],
            "vibrancy_range": [0, 100],
            "spoilage_indicators": ["unusual color", "mold", "discoloration"],
            "shelf_life": 7
        }

def analyze_with_gemini(image_bytes, name: str, visual_features: Dict):
    """Analyze food quality with Gemini, using system instruction prompt engineering"""
    
    # First, get reference data for this food type
    ref_data = get_reference_data(name)
    
    # Create a comprehensive prompt with clear instructions and constraints
    prompt = f"""
    # Food Quality Assessment System
    
    You are FoodQualityGPT, a specialized AI food safety inspector with expertise in visual food quality assessment.
    Your task is to analyze food images to determine if they appear fresh and safe to eat.
    
    ## Assessment Framework
    1. OBJECTIVE ANALYSIS: First analyze the quantitative visual measurements against reference values
    2. VISUAL INSPECTION: Then analyze the actual image for signs of spoilage or quality issues
    3. CONFIDENCE SCORING: Assign a confidence score to your assessment
    
    ## Food Item: {name}
    
    ## Visual Measurements:
    - HSV: {visual_features['avg_hsv']}
    - Brightness: {visual_features['brightness']}
    - Vibrancy: {visual_features['vibrancy']}
    - Mold Indicator: {visual_features['mold_percentage']}%
    
    ## Reference Values for {name}:
    {json.dumps(ref_data, indent=2)}
    
    ## Critical Rules:
    - If you detect ANY signs of mold, spoilage, or food safety risks, you MUST classify as "BAD"
    - Default to safety when uncertain - if confidence is below 70%, classify as "BAD"
    - Do NOT be swayed by aesthetic qualities - focus ONLY on food safety and freshness
    
    ## Output Format Requirements:
    You MUST return a valid JSON object with these fields:
    - assessment: Either "GOOD" or "BAD"
    - confidence: Number between 0-100
    - reasoning: Brief explanation (max 100 words)
    - recommendations: Brief safety advice
    
    Determine if this {name} appears fresh and safe to eat based on visual analysis.
    Return ONLY valid JSON with no additional text or explanation outside the JSON structure.
    """
    
    # Convert image bytes to the format the Gemini API expects
    image_part = {"mime_type": "image/jpeg", "data": image_bytes}
    
    # Make API call with the image and text prompt
    response = gemini_model.generate_content(
        contents=[prompt, image_part],
        generation_config={
            "temperature": 0.2,  # Lower temperature for more consistent outputs
            "top_p": 0.95,
            "top_k": 40,
        }
    )
    
    try:
        # Parse JSON response
        result = json.loads(response.text)
        return result
    except json.JSONDecodeError:
        # If not valid JSON, try to extract JSON from the text
        text = response.text
        try:
            # Look for JSON pattern
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                return json.loads(json_str)
        except:
            pass
            
        # Fallback if JSON parsing fails
        return {
            "assessment": "BAD",
            "confidence": 0,
            "reasoning": "Error in analysis. Unable to determine food quality.",
            "recommendations": "Please retry with a clearer image or consult a human expert."
        }

# API routes
@app.post("/predict")
async def predict_with_gemini(file: UploadFile = File(...), name: str = Form(...)):
    """Predict food quality from image"""
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Calculate visual features
        avg_hsv = calculate_avg_hsv(image)
        brightness = calculate_brightness(image)
        vibrancy = calculate_vibrancy(image)
        mold_percentage = detect_mold_patterns(image)
        
        # Prepare features dictionary
        visual_features = {
            "avg_hsv": avg_hsv,
            "brightness": brightness,
            "vibrancy": vibrancy,
            "mold_percentage": mold_percentage
        }
        
        # Analyze with Gemini
        result = analyze_with_gemini(contents, name, visual_features)
        
        # Return complete assessment
        return {
            "food_name": name,
            "assessment": result.get("assessment", "UNKNOWN"),
            "confidence": result.get("confidence", 0),
            "reasoning": result.get("reasoning", "Not provided"),
            "recommendations": result.get("recommendations", "Not provided"),
            "visual_features": visual_features
        }
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/info/{food_name}")
async def get_food_info(food_name: str):
    """Get reference information about a specific food item"""
    try:
        reference_data = get_reference_data(food_name)
        return {
            "food_name": food_name,
            "reference_data": reference_data
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    """API root endpoint with basic information"""
    return {
        "api": "Food Quality Assessment API",
        "version": "1.0.0",
        "endpoints": [
            {"path": "/predict", "method": "POST", "description": "Assess food quality from image"},
            {"path": "/info/{food_name}", "method": "GET", "description": "Get reference data for food"},
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)