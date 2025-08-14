import axios from 'axios';

// You can override via .env if you ever move the ML model elsewhere
const ML_BASE_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

export const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: 5000,
  headers: { 'Content‑Type': 'application/json' },
});

export async function predictCategory(foodDescription, hoursOld, storage) {
  try {
    const { data } = await mlClient.post('/predict', {
      food:       foodDescription,
      hours_old:  hoursOld,
      storage:    storage,
    });
    return data.category;
  } catch (err) {
    console.error('ML prediction error:', err.response?.data || err.message);
    // Fallback if the ML service is down
    return 'other';
  }
}
