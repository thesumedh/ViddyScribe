import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Initialize the Gemini client inside the handler to prevent build errors
// when the GEMINI_API_KEY is not set in the build environment

export async function POST(request: NextRequest) {
    let tempFilePath = '';

    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not defined in the environment' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const formData = await request.formData();
        const videoFile = formData.get('video') as File | null;

        if (!videoFile) {
            return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
        }

        // Convert Next.js File to Buffer and save temporarily to upload to Gemini API
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a temporary file path
        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `upload-${Date.now()}-${videoFile.name}`);
        fs.writeFileSync(tempFilePath, buffer);

        console.log(`Uploaded file to temp path: ${tempFilePath}`);

        // Upload to Gemini File API
        const uploadedFile = await ai.files.upload({
            file: tempFilePath,
            config: { mimeType: videoFile.type || 'video/mp4' },
        });

        if (!uploadedFile.name) {
            throw new Error('Failed to upload file to Gemini API.');
        }

        console.log(`File uploaded to Gemini API: ${uploadedFile.name}`);

        // Wait for the file to be processed
        let fileState = await ai.files.get({ name: uploadedFile.name });
        while (fileState.state === 'PROCESSING') {
            console.log('Waiting for video processing...');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            fileState = await ai.files.get({ name: uploadedFile.name });
        }

        if (fileState.state === 'FAILED') {
            throw new Error('Video processing failed on Gemini servers.');
        }

        // Define the prompt for audio descriptions
        const prompt = `
You are an expert audio describer for visually impaired audiences.
Watch the uploaded video and generate a detailed, objective audio description for the visual scenes.
Identify key moments, actions, changes in scenery, and important text on screen.

Output your response strictly as a JSON array of objects. Each object must have:
- "id": A unique string identifier.
- "timestamp": The time in seconds (integer or float) when this description should be read.
- "text": The audio description text.

Ensure the descriptions are concise enough to be read aloud in real-time.
Only return valid JSON without markdown wrapping. For example:
[
  { "id": "1", "timestamp": 0, "text": "A man opens a heavy wooden door and enters a dimly lit room." },
  { "id": "2", "timestamp": 5.5, "text": "He looks around cautiously and notices a glowing object on a table." }
]
`;

        // Generate content using Gemini 2.0 Flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                uploadedFile,
                prompt
            ],
            config: {
                responseMimeType: 'application/json',
            }
        });

        const responseText = response.text || '[]';

        // Parse the JSON response
        let descriptions = [];
        try {
            descriptions = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Gemini response as JSON', responseText);
            // Fallback or attempt to extract JSON if it was wrapped in markdown
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                descriptions = JSON.parse(jsonMatch[0]);
            }
        }

        // Clean up Gemini file
        try {
            if (uploadedFile.name) {
                await ai.files.delete({ name: uploadedFile.name });
                console.log(`Deleted file from Gemini API: ${uploadedFile.name}`);
            }
        } catch (e) {
            console.warn("Failed to delete file from Gemini:", e);
        }

        // Clean up local temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        return NextResponse.json({ descriptions });

    } catch (error) {
        console.error('Error processing video:', error);

        // Clean up on error
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error processing video' },
            { status: 500 }
        );
    }
}
