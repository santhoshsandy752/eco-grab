import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
You are EcoBot, an enthusiastic and knowledgeable AI assistant for a student app called EcoGrab. 
Your goal is to help students learn about the environment, wildlife, marine life, and ecosystems.
1. ONLY answer questions related to nature, animals, pollution, climate change, conservation, and biology.
2. If a user asks about an unrelated topic (like math, celebrities, coding unrelated to nature), politely decline and steer them back to nature.
3. Keep your answers encouraging, short, and fun for students. Use emojis! 🌿 🐾 🌊
`;

export const sendMessageToEcoBot = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    // Construct the chat history for the model
    // Note: In a real app, we would use ai.chats.create() with history.
    // For this stateless service function, we'll append history manually if needed or just send the prompt with instruction.
    // To keep it simple and robust for this demo:
    
    const contents = [
       ...history.map(msg => ({
         role: msg.role,
         parts: [{ text: msg.text }]
       })),
       {
         role: 'user',
         parts: [{ text: newMessage }]
       }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents, // Passing full conversation context
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm having trouble connecting to nature right now. Try again! 🍃";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! Something went wrong while talking to the ecosystem. 🐢";
  }
};