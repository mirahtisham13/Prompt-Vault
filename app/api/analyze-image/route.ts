import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// We check if the key exists, if not we'll handle it gracefully in the route
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in environment variables.' },
        { status: 500 }
      );
    }

    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // Prepare the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // The prompt instructs the AI on exactly what to do and what JSON schema to output
    const prompt = `You are an expert AI Image Prompt Engineer. 
I am providing you with an image. Your job is to reverse-engineer this image into a highly detailed text prompt that would generate a similar image in an AI image generator like Midjourney or DALL-E.

Analyze the image carefully and output a JSON object with two fields:
1. "title": A short, catchy title for this prompt (max 5 words).
2. "promptText": A highly detailed prompt describing the subject, environment, lighting, camera angle, colors, and artistic style. Use comma-separated descriptive keywords common in Midjourney prompts. Use [Variables] if there is a specific subject that the user might want to change (e.g. "[Subject] standing in a neon-lit cyberpunk city").

Return ONLY valid JSON.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''), // Strip the data URL prefix if present
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Parse the JSON returned by Gemini
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
