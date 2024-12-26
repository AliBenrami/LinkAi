import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB6_W9ehhIwGKwkFYsLfkgqVRtm_grf3TE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt: string) => {
  const response = await model.generateContent(prompt);
  return response.response.text();
};
