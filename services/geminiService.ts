import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImageWithText(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const newImageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return newImageData;
      }
    }

    throw new Error("AIが画像を返しませんでした。テキストで応答した可能性があります。");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to edit image with Gemini API.");
  }
}

export async function transformImageWithStyle(
  contentImage: { data: string; mimeType: string },
  styleImage: { data: string; mimeType: string },
  prompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: contentImage.data,
              mimeType: contentImage.mimeType,
            },
          },
          {
            inlineData: {
              data: styleImage.data,
              mimeType: styleImage.mimeType,
            },
          },
          {
            text: `Use the style from the second image to transform the first image. Also consider the following request: ${prompt}`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const newImageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return newImageData;
      }
    }

    throw new Error("AIが画像を返しませんでした。テキストで応答した可能性があります。");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to edit image with Gemini API.");
  }
}
