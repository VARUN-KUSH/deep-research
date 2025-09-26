import OpenAI from "openai";
// Import nodemailer
import nodemailer from 'nodemailer';
import { marked } from 'marked'; // The Markdown parser
// import fs from 'fs/promises';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';  // Import promise-based versions
import path from 'node:path';
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { Client } from "@upstash/qstash";
import { NextResponse } from 'next/server';
// import path from 'path';
import { getContext, instruction2, instruction3, instruction4, getSourcesListInstruction, MarketReportSummaryInstruction } from "@/utils/context"; // Import the context generation function
import { EkgReportInstruction1, EkgReportInstruction2, GetSourceListForEkgInstruction, CreateAudioSummaryInstruction } from "../../../utils/context";

const NEXT_PUBLIC_OPENAI_API_KEY = "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"
// "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"
const client = new OpenAI({
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true // Use environment variable for OpenAI API key
});
// Parse the JSON credentials from the environment variable
// const credentials = JSON.parse(process.env.NEXT_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

// Initialize QStash client outside the handler
const qstashClient = new Client({
  token: "eyJVc2VySUQiOiJmMjQzZWU4Zi00ZWIzLTQ0NDAtOTJlZC0xYzQ1MTIwYTQ1NTEiLCJQYXNzd29yZCI6IjhiMGUyNzFlMWUyYTRlMjk4ZDhjNzM3YmU1ZWU4YWZlIn0=",
});


// Use a named export for the POST method
export async function POST(request) {
  try {
    // Get the request body by awaiting request.json()
    const body = await request.json();
    const { recipient_email, industry_name, models } = body;

    // 1. Validate the input
    if (!recipient_email || !industry_name || !models) {
      // Return a NextResponse for errors
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }
    
    console.log("Received request to queue deep research:", body);

    // This logic determines the correct URL for the worker endpoint
    // It uses the Vercel URL in production and localhost for local development
    const host = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
      
    // 2. Publish the job to QStash
    await qstashClient.publishJSON({
      url: `https://deep-research-six-bay.vercel.app/api/researchworker`, 
      body: {
        recipient_email,
        industry_name,
        models,
      },
    });

    console.log("Job successfully queued for:", recipient_email);

    // 3. Immediately respond to the frontend using NextResponse
    return NextResponse.json(
      { message: "Research request accepted. The report will be generated in the background and emailed to you." },
      { status: 202 } // 202 Accepted is the correct status code here
    );

  } catch (error) {
    console.error("Error queueing research job:", error);
    return NextResponse.json({ error: "Failed to start the research process." }, { status: 500 });
  }
}





// const basePrompt = industryName.trim() ? 
//                     `Generate a detailed research query for the industry: "${industryName}".` :
//                     `Generate a comprehensive deep research query on a relevant topic.`;

//                 const instructions = `Rewrite the following as a detailed and specific deep research query: ${basePrompt}`;

//                 const rewriteResult = await openai.chat.completions.create({
//                     messages: [{ role: "user", content: instructions }],
//                     model: "gpt-4o",
//                 });

//                 if (rewriteResult && rewriteResult.choices[0].message.content) {
//                     const newPrompt = rewriteResult.choices[0].message.content;
//                     setRewrittenPrompt(newPrompt);
//                     setFinalPromptForResearch(newPrompt); // Set the rewritten prompt as the final one
//                     setShowPromptConfirmation(true);
//                     setMessage('Please review the rewritten prompt below.');
//                 } else {
//                     setMessage('Failed to rewrite prompt. Please try again.');
//                     setFinalPromptForResearch(''); // Clear final prompt if rewrite fails
//                 }


// handling data in frontend

// let reasoning = null;
// for (const item of resp.output) {
//     if (item.type === "reasoning") {
//         reasoning = item;
//         break; // Found the first reasoning step, so we can stop
//     }
// }

// if (reasoning) {
//     for (const s of reasoning.summary) {
//         console.log(s.text);
//         Response.json({ status: resp.status, reasoning_text: s.text, id: resp.id, output_type: "reasoning" });
//     }
// } else {
//     console.log("No reasoning step found.");
// }

// let search = null;
// for (const item of resp.output) {
//     if (item.type === "web_search_call") {
//         search = item;
//         break; // Found the first web search step, so we can stop
//     }
// }

// if (search) {
//     console.log("Query:", search.action);
//     console.log("Status:", search.status);
//     Response.json({ status: search.status, web_search_call_text: search.action, id: resp.id, output_type: "web_search_call" });
// } else {
//     console.log("No web search step found.");
// }


// Example in a Next.js API route (pages/api/generate-report.js)
// Example in a Next.js API route (pages/api/generate-report.js)






//     // --- Step 3: Await parallel tasks and email the results ---
//     const [reportFilePath, audioFilePath] = await Promise.all([reportGenerationPromise, audioSummaryPromise]);

//     console.log("📧 Preparing to send final report and audio summary...");
//     await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: recipient_email,
//       subject: `Your Industry Report & Audio Summary for "${industryName}" is Ready!`,
//       html: `<p>Hello,</p><p>Your requested deep research report for <strong>${industryName}</strong> is complete.</p><p>Attached, you will find the full report and a 15-minute audio summary podcast.</p><p>Regards,<br/>The Noah Research Team</p>`,
//       attachments: [
//         {
//           filename: 'industry_report.html', // Change to .pdf if you generate a PDF
//           path: reportFilePath,
//           contentType: 'text/html',
//         },
//         {
//           filename: 'audio_summary.mp3',
//           path: audioFilePath,
//           contentType: 'audio/mpeg',
//         },
//       ],
//     });
//     console.log(`✅ Email sent successfully to ${recipient_email}`);

//     return new Response(JSON.stringify({ status: "success", message: "Report and audio summary generated and sent." }), { status: 200 });

//   } catch (error) {
//     console.error("❌ An unexpected error occurred in the main process:", error);
//     return new Response(JSON.stringify({ error: "An internal server error occurred." }), { status: 500 });
//   }
// }