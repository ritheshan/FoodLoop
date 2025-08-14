import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)
import torch
from torch.utils.data import Dataset

# Load dataset present as expanded_food_item.csv
df = pd.read_csv(r"e:\Namrata\programming\using git\FoodLoop\backend\foodloop_api\expanded_food_items.csv")

# Encode labels
label_encoder = LabelEncoder()
df["label_encoded"] = label_encoder.fit_transform(df["label"])
df["label_encoded"] = df["label_encoded"].astype("int64")

# Create label mappings
id2label = dict(enumerate(label_encoder.classes_))
label2id = {v: k for k, v in id2label.items()}

# Train-test split
train_texts, eval_texts, train_labels, eval_labels = train_test_split(
    df["text"].tolist(),
    df["label_encoded"].tolist(),
    test_size=0.2,
    random_state=42,
    stratify=df["label_encoded"]  # preserves label balance
)

# Tokenizer
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
train_encodings = tokenizer(train_texts, truncation=True, padding=True)
eval_encodings = tokenizer(eval_texts, truncation=True, padding=True)

# Custom Dataset class
class FoodDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx], dtype=torch.long)
        return item

    def __len__(self):
        return len(self.labels)


# Prepare Datasets
train_dataset = FoodDataset(train_encodings, train_labels)
eval_dataset = FoodDataset(eval_encodings, eval_labels)

# Load model
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(label_encoder.classes_),
    id2label=id2label,
    label2id=label2id
)

# Accuracy calculation
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=1)
    acc = accuracy_score(labels, predictions)
    return {"accuracy": acc}

# Training args
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=5,
    per_device_train_batch_size=8,
    evaluation_strategy="epoch",
    save_strategy="no",
    learning_rate=2e-5,
    weight_decay=0.01,
    logging_dir="./logs"
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=compute_metrics
)

# Train and evaluate
trainer.train()
results = trainer.evaluate()
print("Final Evaluation:", results)

# Save model
model.save_pretrained("./fine_tuned_food_classifier")
tokenizer.save_pretrained("./fine_tuned_food_classifier")

# Inference function
def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    predicted_label_id = torch.argmax(outputs.logits, dim=1).item()
    return id2label[predicted_label_id]

# Example usage
print("Prediction:", predict("paneer butter masala"))
print("Prediction:", predict("dosa"))
print("Prediction:", predict("fried rice"))


