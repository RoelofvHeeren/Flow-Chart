import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const runtime = 'nodejs'; // Force Node.js runtime to avoid SES/Edge issues


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, currentFlow } = body;

        // Construct context
        const flowContext = currentFlow ? `Current Flow State: ${JSON.stringify(currentFlow)}` : "No existing flow.";

        // Use Gemini 2.0 Flash Exp as requested for better performance
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const fullPrompt = `${SYSTEM_PROMPT}\n\nContext: ${flowContext}\n\nUser Instruction: ${prompt}\n\nTask: Generate or modify the flowchart JSON structure (nodes and edges). Return ONLY valid JSON format with keys "nodes" and "edges". Do not use markdown code blocks.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("No response from AI");
        }

        const jsonResult = JSON.parse(text);

        return NextResponse.json(jsonResult);
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
