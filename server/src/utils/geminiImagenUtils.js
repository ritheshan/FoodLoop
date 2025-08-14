import "dotenv/config";

// Gemini setup
import { GoogleGenerativeAI } from "@google/generative-ai";

// Vertex AI (Imagen)
import * as aiplatform from "@google-cloud/aiplatform";

const { PredictionServiceClient } = aiplatform.v1;

// Initialize Vertex AI client
const predictionServiceClient = new PredictionServiceClient({
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
});

// Set project and location
const project = process.env.GCP_PROJECT_ID;
const location = "us-central1";

// Initialize Gemini (Gemini 1.5 Flash)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function: Generate Packaging Text
export const generatePackagingText = async (prompt, limit = 5) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Split the text into lines or bullet points
  const points = text
    .split(/\n|•|-|\*/g) // common bullet separators
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Limit the number of points and return
  return points.slice(0, limit);
};


// Function: Generate Packaging Image using Vertex AI (Imagen-2)
export const generatePackagingImage = async (description) => {
  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/imagen-2`;

  const request = {
    endpoint: `us-central1-aiplatform.googleapis.com`,
    model: endpoint,
    instances: [{ prompt: description }],
    parameters: {
      sampleCount: 1,
      imageSize: "512x512", // make sure this is supported
    },
  };

  const [response] = await predictionServiceClient.predict(request);
  const base64Image = response.predictions?.[0]?.bytesBase64Encoded;

  return `data:image/png;base64,${base64Image}`;
};