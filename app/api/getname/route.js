import { NextResponse } from 'next/server';
import OpenAI from 'openai'; 
import { zodTextFormat } from "openai/helpers/zod";
// app/api/chat/route.js or pages/api/chat.js
import { z } from "zod";

const IndustryNames = z.object({
    commonNames: z.array(z.string()),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
    const { industryPrompt } = await req.json();

    const response = await openai.responses.create({
        input: industryPrompt,
        model: "gpt-5", // Changed to gpt-4o, often slightly better for detailed responses than latest if there are subtle differences in 'latest' deployment          
        text: {
            format: zodTextFormat(IndustryNames, "commonNames"),
        }
    });
    console.log("Received response:", response);
    
    return NextResponse.json(response, { status: 200 });

}
  