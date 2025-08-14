
import os
import io
import json
import base64
import requests
import numpy as np
from dotenv import load_dotenv
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import cv2
import google.generativeai as genai
import openai
from tensorflow.keras.models import load_model

# Load environment variables
load_dotenv()

# Configure API keys
openai.api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Load your model and class indices
model = load_model("dataset/model/efficientnet_fruit_classifier.h5")
with open("class_indices.json", "r") as f:
    class_indices = json.load(f)
    class_names = list(class_indices.keys())

@app.get("/")
def home():
    return {"message": "Welcome to Fruit Freshness Classifier API"}

# Utility for HSV/brightness/vibrancy analysis
def analyze_image(img_np):
    img = cv2.resize(img_np, (224, 224))
    blur = cv2.GaussianBlur(img, (7, 7), 0)
    hsv = cv2.cvtColor(blur, cv2.COLOR_BGR2HSV)
    avg_hsv = cv2.mean(hsv)[:3]
    brightness = np.mean(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    vibrancy = np.std(img)
    return avg_hsv, brightness, vibrancy

# LLM Analysis (OpenAI)
def call_llm(avg_hsv, brightness, vibrancy):
    system_msg = "You are an expert in analyzing fruit freshness from image statistics."
    user_msg = f"HSV: {avg_hsv}, Brightness: {brightness}, Vibrancy: {vibrancy}. How fresh is this fruit?"
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ]
    )
    return response.choices[0].message.content.strip()

# Ollama local LLM
def analyze_with_ollama(avg_hsv, brightness, vibrancy):
    prompt = (
        f"Based on these image stats - HSV: {avg_hsv}, Brightness: {brightness}, Vibrancy: {vibrancy} - "
        "how fresh is the fruit? Respond with a short description."
    )
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "deepseek-r1:latest", "prompt": prompt, "stream": False}
    )
    return response.json()['response'].strip()

# Gemini Vision text + image input
def analyze_with_gemini(image: Image.Image, avg_hsv, brightness, vibrancy):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_bytes = buffered.getvalue()
    prompt = f"""
Analyze the quality of the food in the image based on:
- HSV: {avg_hsv}
- Brightness: {brightness:.2f}
- Vibrancy: {vibrancy:.2f}

Rate quality (Excellent/Good/Fair/Poor) and explain briefly.
"""
    model = genai.GenerativeModel("gemma-3-12b-it")
    response = model.generate_content(
        contents=[
            {"text": prompt},
            {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": base64.b64encode(img_bytes).decode(),
                }
            }
        ]
    )
    return response.text.strip()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_np = np.array(img)

    avg_hsv, brightness, vibrancy = analyze_image(img_np)
    result = call_llm(avg_hsv, brightness, vibrancy)

    return JSONResponse({
        "result": result,
        "hsv": avg_hsv,
        "brightness": brightness,
        "vibrancy": vibrancy
    })

@app.post("/predict/ollama")
async def predict_ollama(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_np = np.array(img)
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    avg_hsv = np.mean(hsv, axis=(0, 1)).tolist()
    brightness = np.mean(cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY))
    vibrancy = np.std(hsv[..., 1])
    result = analyze_with_ollama(avg_hsv, brightness, vibrancy)
    return JSONResponse({"result": result})

@app.post("/predict/gemini")
async def predict_gemini(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    img_np = np.array(image)
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    avg_hsv = np.mean(hsv, axis=(0, 1)).tolist()
    brightness = np.mean(cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY))
    vibrancy = np.std(hsv[..., 1])
    result = analyze_with_gemini(image, avg_hsv, brightness, vibrancy)
    return JSONResponse({"result": result})
