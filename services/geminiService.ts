import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AISuggestionResponse, ThemeConfig, Website, AIMarketingResponse } from "../types";

// In a real app, this would be properly secured.
// For this MVP, we rely on the environment variable as per instructions.
// If API_KEY is missing, we handle it gracefully in the UI.

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const generateWebsiteContent = async (businessName: string, businessType: string): Promise<AISuggestionResponse | null> => {
  if (!apiKey) {
    console.warn("[GeminiService] API Key is missing. Skipping AI content generation.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Generate comprehensive website content for a business. The business name is "${businessName}" and it is a "${businessType}". Provide the following:

- A compelling hero section title and subtext.
- A vivid image prompt for the hero section banner.
- A detailed "About Us" text (around 100-150 words).
- Three diverse product/service offerings, each with a name, description, price (use PHP currency symbol if applicable), and an image prompt.
- Three key benefits, each with a title, description, and an icon name (from lucide-react, e.g., Star, Check, Heart).
- Three customer testimonials, each with a customer name, role, and a brief content snippet.
- Three frequently asked questions (FAQ), each with a question and a concise answer.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        heroTitle: { type: Type.STRING },
        heroSubtext: { type: Type.STRING },
        heroImagePrompt: { type: Type.STRING },
        aboutText: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ["name", "description", "price", "imagePrompt"]
          }
        },
        benefits: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["title", "description", "icon"]
          }
        },
        testimonials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["name", "role", "content"]
          }
        },
        faq: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      },
      required: ["heroTitle", "heroSubtext", "heroImagePrompt", "aboutText", "products", "benefits", "testimonials", "faq"]
    };

    const maxRetries = 3;
    let retryCount = 0;
    let lastError: any;

    while (retryCount < maxRetries) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });
        
        // Check if result has text property or method (handling different SDK versions/types)
        let responseText = '';
        if (result && typeof (result as any).text === 'function') {
             responseText = (result as any).text();
        } else if (result && (result as any).text) {
             responseText = (result as any).text;
        } else if (result && (result as any).response && typeof (result as any).response.text === 'function') {
             responseText = (result as any).response.text();
        }

        if (!responseText) {
          throw new Error('Empty response from Gemini');
        }

        responseText = responseText.trim();
        
        // Clean up the response text (remove markdown code blocks if present)
        let cleanedText = responseText;
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const parsedResponse = JSON.parse(cleanedText);
        return parsedResponse as AISuggestionResponse;

      } catch (error: any) {
        lastError = error;
        const isRetryable = 
          error?.status === 503 || 
          error?.code === 503 || 
          error?.message?.includes('503') || 
          error?.message?.includes('overloaded') ||
          error?.message?.includes('UNAVAILABLE');

        if (isRetryable) {
          console.warn(`[GeminiService] Attempt ${retryCount + 1} failed with 503/Overloaded. Retrying...`);
          retryCount++;
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          continue;
        }
        throw error;
      }
    }
    
    throw lastError;

  } catch (error) {
    console.error('[GeminiService] Error generating website content:', error);
    if (error instanceof SyntaxError) {
      console.error('[GeminiService] JSON parsing error. Response might be malformed.');
    }
    return null;
  }
};

export const generateTheme = async (description: string): Promise<ThemeConfig | null> => {
  if (!apiKey) {
    console.warn("API Key is missing. Skipping AI theme generation.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Generate a color theme palette for a website based on this description: "${description}".
    Return a primary color, secondary color, button color, and whether it should be light or dark mode.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "Hex color code e.g. #FF0000" },
        secondary: { type: Type.STRING, description: "Hex color code e.g. #00FF00" },
        button: { type: Type.STRING, description: "Hex color code e.g. #0000FF" },
        background: { type: Type.STRING, enum: ["light", "dark"] },
      },
      required: ["primary", "secondary", "button", "background"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as ThemeConfig;

  } catch (error) {
    console.error("Gemini API Error (Theme):", error);
    return null;
  }
};

export const generateMarketingContent = async (website: Website): Promise<AIMarketingResponse | null> => {
  if (!apiKey) {
    console.warn("API Key is missing. Skipping AI marketing generation.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Extract relevant content to send to the model to keep context size manageable
    const context = `
      Business Name: ${website.title}
      Description: ${website.content.hero.subtext}
      About: ${website.content.about}
      Products/Services: ${website.content.products.map(p => p.name).join(', ')}
    `;

    const prompt = `Based on the following business website content, generate a Marketing Kit.
    
    Website Context:
    ${context}

    Tasks:
    1. SEO: Generate a concise Meta Title (max 60 chars), a Meta Description (max 160 chars), and 5-7 target keywords.
    2. Social Media: Write an engaging launch post for Facebook/Instagram announcing the website or services. Include emojis and hashtags.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        metaTitle: { type: Type.STRING },
        metaDescription: { type: Type.STRING },
        keywords: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        socialPost: { type: Type.STRING },
      },
      required: ["metaTitle", "metaDescription", "keywords", "socialPost"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as AIMarketingResponse;

  } catch (error) {
    console.error("Gemini API Error (Marketing):", error);
    return null;
  }
};
