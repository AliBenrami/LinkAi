import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey: string = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt: string) => {
  const response = await model.generateContent(prompt);
  return response.response.text();
};
