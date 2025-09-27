// File: pages/api/gemini-suggestion.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answers } = req.body;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following quiz responses, suggest a suitable career path and job titles:
    ${JSON.stringify(answers, null, 2)}
    
    Please provide a response in the following format:
    Career Path: [Suggested career path]
    Job Titles: [List of 3-5 relevant job titles]
    Description: [A brief description of why this career path suits the person based on their answers]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error('Error in Gemini API request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}