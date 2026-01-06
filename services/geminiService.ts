import { GoogleGenAI, Type } from "@google/genai";
import { Question, ElementResult } from "../types";

// Helper to ensure we have a client
const getClient = () => {
  // Guidelines: 
  // - The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // - Use this process.env.API_KEY string directly when initializing the client.
  // - Assume this variable is pre-configured, valid, and accessible.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuizQuestions = async (): Promise<Question[]> => {
  const ai = getClient();
  
  const prompt = `
    Generate a 30-question multiple-choice personality quiz. 
    The goal is to determine the user's affinity to an abstract "Element".
    
    Elements to draw inspiration from: Sand, Shadow, Space, Time, Metal, Void, Light, Rust, Glass, Gravity, Obsidian, Neon, Echo, Chaos, Silence.
    
    The questions MUST be:
    1. EXTREMELY Difficult, philosophical, and thought-provoking. No easy answers.
    2. Expose deep personality traits (fears, desires, ethics, perception of reality).
    3. Abstract and situation-based. 
       Example: "You are the last consciousness in a dying universe. What memory do you choose to preserve?"
    4. "Cool", mysterious, and slightly esoteric in tone.
    5. Avoid mundane questions like "Do you like parties?".

    Return EXACTLY 30 questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING, description: "The philosophical question text" },
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
    Priority Elements: Sand, Shadow, Space, Time, Metal, Obsidian, Neon, Echo, Chaos, Silence, Rust, Glass, Void, Gravity.
    
    Do NOT use basic elements like Fire or Water unless strictly necessary. Aim for something unique.
    
    The description should be poetic, deep, and slightly edgy/cool.
    
    Transcript:
    ${transcript}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          element: { type: Type.STRING, description: "The assigned element name (e.g. Void, Chromium, Deep Time)" },
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
