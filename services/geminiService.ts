import { GoogleGenAI, Modality } from "@google/genai";

const PROMPT = `Transform the person in this image into an anthropomorphic frog, blending their features with those of a frog. The frog should have very large, glossy, and expressive eyes. Maintain the overall composition of the original image but reinterpret the subject in this new form. The final image should be a photorealistic, high-contrast, monochromatic charcoal drawing. The style should be dramatic and artistic, with deep blacks, strong lighting, and a texture resembling a detailed sketch on high-quality, textured paper.`;

export const generateMoggedImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  // Ensure the API key is available
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the first image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("API did not return an image. It may have refused the request.");

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("The AI model could not process the image. Please try a different one.");
  }
};