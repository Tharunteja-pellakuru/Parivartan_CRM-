
import { GoogleGenAI, Type } from "@google/genai";
import { Client, Project, Enquiry } from '../types';

// The API key is obtained exclusively from the environment variable process.env.API_KEY.
// We initialize the GoogleGenAI client with this key inside each service function.

export const generateClientSummary = async (client: Client, projects: Project[]): Promise<string> => {
  try {
    // Initializing GoogleGenAI directly with process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const projectSummary = projects.map(p => `- ${p.name} (${p.status}, $${p.budget})`).join('\n');
    
    const prompt = `
      You are an expert CRM assistant. Analyze the following client data and provide a concise, professional executive summary (max 3 sentences).
      Highlight key risks or opportunities based on the notes and project status.
      
      Client: ${client.name} (${client.company})
      Status: ${client.status}
      Notes: ${client.notes}
      Projects:
      ${projectSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate summary at this time.";
  }
};

export const generateEmailDraft = async (client: Client, context: string): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Draft a professional, short email to ${client.name} from ${client.company}.
        Context: ${context}
        Tone: Professional, helpful, concise.
        Sign off: "Best, The Parivartan Team"
      `;
  
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
  
      return response.text || "No draft generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Unable to generate email draft.";
    }
  };

export const suggestNextAction = async (client: Client): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on these notes: "${client.notes}", suggest the single most important next step for a CRM manager. Start with a verb. Keep it under 10 words.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "Review account.";
    } catch (e) {
        return "Review account.";
    }
}

export const analyzeEnquiryRelevance = async (enquiry: Enquiry): Promise<{ isRelevant: boolean; reason: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Analyze this website enquiry for "Parivartan" (Corporate Training/Consulting firm).
      Determine if it is a relevant sales lead or spam.
      
      Enquiry Name: ${enquiry.name}
      Message: ${enquiry.message}
      Email: ${enquiry.email}
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                isRelevant: { type: Type.BOOLEAN },
                reason: { type: Type.STRING }
            },
            propertyOrdering: ["isRelevant", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
        isRelevant: result.isRelevant ?? true,
        reason: result.reason || "AI analysis completed"
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { isRelevant: true, reason: "AI analysis failed" };
  }
};
