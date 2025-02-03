import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey: string = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apikey);
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "",
});

export const generateContent = async (prompt: string) => {
  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.1, // randness
    },
  });
  return response.response.text();
};
