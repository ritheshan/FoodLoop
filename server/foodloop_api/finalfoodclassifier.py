import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

# FastAPI app initialization
app = FastAPI()

# Loading fine-tuned model and tokenizer
model_path = r"E:\Namrata\programming\using git\fine_tuned_food_classifier"  # Update the path if necessary
model = DistilBertForSequenceClassification.from_pretrained(model_path)
tokenizer = DistilBertTokenizer.from_pretrained(model_path)
id2label = model.config.id2label  

# Function to predict meal type
def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    predicted_id = torch.argmax(outputs.logits, dim=1).item()
    predicted_label = id2label[predicted_id]
    return predicted_label

# Segregating the types of foods based on keywords
KEYWORDS = {
    "meat": ["chicken", "mutton", "fish", "egg", "prawn", "beef"],
    "dairy": ["paneer", "milk", "cheese", "cream", "butter", "lassi", "yogurt", "curd"],
    "fried": ["samosa", "vada", "pakora", "bhaji"],
    "rice": ["rice", "biryani", "pulao", "fried rice", "chawal"]
}

# Rule-based logic to assess food quality
def assess_quality_rule_based(food_name, meal_type, hours_old, storage):
    food = food_name.lower()
    meal_type = meal_type.lower()
    storage = storage.lower()

    is_meat = any(word in food for word in KEYWORDS["meat"])
    is_dairy = any(word in food for word in KEYWORDS["dairy"])
    is_fried = any(word in food for word in KEYWORDS["fried"])
    is_rice_based = any(word in food for word in KEYWORDS["rice"])

    # Random Guess for safe hours
    max_safe_hours = 4 if storage == "room temp" else 24

    # Adjust by meal type if necessary
    if meal_type == "breakfast":
        max_safe_hours = 3 if storage == "room temp" else 18
    elif meal_type in ["lunch", "dinner"]:
        max_safe_hours = 7 if storage == "room temp" else 24
    elif meal_type == "snacks":
        max_safe_hours = 9 if storage == "room temp" else 36

    # Additional perishable/spoilage adjustments
    if is_meat:
        max_safe_hours -= 2
    if is_dairy:
        max_safe_hours -= 1
    if is_fried:
        max_safe_hours -= 1
    if is_rice_based and storage == "room temp":
        max_safe_hours -= 0.5

    # Final decision
    if hours_old > max_safe_hours:
        return "Spoiled"
    elif hours_old >= (max_safe_hours * 0.8):  # if it is more than/= 80% of max safe hours
        return "Check Manually"
    else:
        return "Good"

# Pydantic model to receive input from the frontend
class FoodInput(BaseModel):
    food: str
    hours_old: float
    storage: str

# POST endpoint to assess food quality
@app.post("/predict")
def assess_food_quality_from_text(food_input: FoodInput):
    meal_type = predict(food_input.food)
    quality = assess_quality_rule_based(food_input.food, meal_type, food_input.hours_old, food_input.storage)
    
    return {
        "food": food_input.food,
        "meal_type": meal_type,
        "hours_old": food_input.hours_old,
        "storage": food_input.storage,
        "quality": quality
    }
# uvicorn finalfoodclassifier:app --reload