import { GoogleGenAI, Type } from "@google/genai";
import { Question, ElementResult } from "../types";

// Helper to ensure we have a client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (): Promise<Question[]> => {
  const ai = getClient();
  
  const prompt = `
    Generate a 30-question multiple-choice personality quiz. 
    The goal is to determine the user's affinity to an abstract "Element" (like Time, Shadow, Sand, Metal, Void, Light, Glass, Rust, etc.).
    
    The questions should be:
    1. Difficult and philosophical.
    2. Expose deep personality traits (fears, desires, ethics).
    3. Abstract and situation-based, not "What is your favorite color?".
    4. "Cool" and mysterious in tone.

    Return exactly 30 questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING, description: "The question text" },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "A, B, C, or D" },
                    text: { type: Type.STRING }
                  },
                  required: ["id", "text"]
                }
              }
            },
            required: ["id", "text", "options"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Failed to generate quiz", error);
    // Fallback or re-throw to be handled by UI
    throw error;
  }
};

export const analyzePersonality = async (questions: Question[], answers: Record<number, string>): Promise<ElementResult> => {
  const ai = getClient();

  // Prepare transcript
  const transcript = questions.map(q => {
    const selectedOption = q.options.find(o => o.id === answers[q.id]);
    return `Q: ${q.text} \n A: ${selectedOption?.text || "Unknown"}`;
  }).join('\n');

  const prompt = `
    Analyze the following quiz answers to assign the user a specific "Element".
    
    The Element should be creative, abstract, or fantasy-based. 
    Examples: Sand, Shadow, Space, Time, Metal, Rust, Glass, Neon, Void, Frostfire, Mercury, Stardust, Petrichor, Gravity.
    
    Do NOT stick to basic elements like Fire/Water unless the personality is extremely archetypal. Be specific and cool.
    
    Transcript:
    ${transcript}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          element: { type: Type.STRING, description: "The assigned element name" },
          description: { type: Type.STRING, description: "A deep, mystifying description of why this element fits them." },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          affinity: { type: Type.STRING, description: "e.g., Chaotic Neutral, Lawful Evil, Ethereal, Industrial" },
          hexColor: { type: Type.STRING, description: "A hex color code representing the element" }
        },
        required: ["element", "description", "strengths", "weaknesses", "affinity", "hexColor"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Analysis failed");
  return JSON.parse(text) as ElementResult;
};