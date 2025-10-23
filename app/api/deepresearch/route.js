// import OpenAI from "openai";
// // Import nodemailer
// import nodemailer from 'nodemailer';
// import { marked } from 'marked'; // The Markdown parser
// // import fs from 'fs/promises';
// import { createReadStream } from 'node:fs';
// import { mkdir, writeFile, readFile } from 'node:fs/promises';  // Import promise-based versions
// import path from 'node:path';
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";
// import { NextResponse } from 'next/server';
// // import path from 'path';
// import { getContext, instruction2, instruction3, instruction4, getSourcesListInstruction, MarketReportSummaryInstruction } from "@/utils/context"; // Import the context generation function
// import { EkgReportInstruction1, EkgReportInstruction2, GetSourceListForEkgInstruction, CreateAudioSummaryInstruction } from "../../../utils/context";

// const NEXT_PUBLIC_OPENAI_API_KEY = "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"
// // "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"
// const client = new OpenAI({
//   apiKey: NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true // Use environment variable for OpenAI API key
// });
// // Parse the JSON credentials from the environment variable
// // const credentials = JSON.parse(process.env.NEXT_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);



// // Helper function to generate PDF from HTML file
// async function generatePDFFromHTML(htmlContent) {
//   let browser;
//   try {
//       const isVercel = !!process.env.VERCEL_ENV;
//       let puppeteerLib, launchOptions = { headless: true };

//       if (isVercel) {
//           puppeteerLib = puppeteer;
//           launchOptions = {
//               ...launchOptions,
//               args: chromium.args,
//               executablePath: await chromium.executablePath(),
//           };
//       } else {
//           puppeteerLib = require("puppeteer"); // Use full puppeteer locally
//       }

//       browser = await puppeteerLib.launch(launchOptions);
//       const page = await browser.newPage();


//       // Load the HTML file with file:// protocol
//       // const htmlContent = await readFile(htmlFilePath, "utf8");
//       await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//       // Ensure external styles are applied
//       await page.addStyleTag({ path: path.join(process.cwd(), "public", "styles", "report.css") });

//       const disclaimerText = "This report was generated in its entirety by Artificial Intelligence. It has not been independently verified, reviewed, or edited by a human expert.";
//       // Define the footer template with the disclaimer and Arial font
//       const footerTemplate = `
//       <div style="width: 100%; font-size: 8px; font-family: Arial, sans-serif; text-align: center; padding: 0 40px;">
//         ${disclaimerText}
//       </div>
//     `;

//       // Generate PDF and return it as a buffer
//       const pdfBuffer = await page.pdf({
//           format: "A4",
//           printBackground: true,
//           displayHeaderFooter: true,
//           footerTemplate: footerTemplate,
//           margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
//       });

//       // console.log(`✅ PDF generated at: ${pdfFilePath}`);
//       return pdfBuffer;
//   } catch (error) {
//       console.error("❌ Error generating PDF:", error);
//       throw error;
//   } finally {
//       if (browser) {
//           await browser.close();
//       }
//   }
// }

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // false for port 587 (TLS), true for port 465 (SSL)
//   auth: {
//       user: 'shiva92637@gmail.com', // Your Gmail address
//       pass: 'rwhz havv alkk kfay' // !! IMPORTANT: Use an App Password here, NOT your regular Gmail password !!
//   }
// });

// async function getApiResponse(config, retries = 3) {
//   // Loop for the specified number of retry attempts
//   for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//           console.log(`Attempt ${attempt}/${retries}: Sending API request for: ${config.input.substring(0, 50)}...`);
//           let response = await client.responses.create(config);
//           console.log(`Request sent. Response ID: ${response.id}`);

//           // Poll for the result
//           while (response.status === "queued" || response.status === "in_progress") {
//               await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
//               response = await client.responses.retrieve(response.id);
//           }

//           // Check the final status of the response
//           if (response.status === 'completed') {
//               console.log(`✅ Request ${response.id} completed successfully on attempt ${attempt}.`);
//               return { ResponseId: response.id, markdown: response.output_text }; // Success, so we return the result and exit the function
//           } else {
//               // If status is 'failed' or another non-complete status, throw an error to trigger the catch block
//               throw new Error(`API job failed for response ID ${response.id} with status: ${response.status}`);
//           }
//       } catch (error) {
//           console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

//           // If this was the final attempt, re-throw the error to be handled by the calling code
//           if (attempt === retries) {
//               console.error("All retry attempts failed. Propagating error.");
//               throw error;
//           }

//           // Wait before the next retry to avoid hammering the server
//           console.log(`Retrying in 2 seconds...`);
//           await new Promise(resolve => setTimeout(resolve, 2000));
//       }
//   }
// }

// async function getCoversationResponse(config) {
//   console.log(`Sending API request with input: ${config.input.substring(0, 50)}...`);
//   let response = await client.responses.create(config);
//   console.log(`Request sent. Response ID: ${response.id}`);
//   if (response.status === 'completed') {
//       console.log(`✅ Request ${response.id} completed successfully.`);
//       return { ResponseId: response.id, markdown: response.output_text };
//   } else {
//       throw new Error(`API call failed for response ID ${response.id} with status: ${response.status}`);
//   }

// }

export async function POST(request) {}
//   try {
//         const response = await request.json()
//       // Generate context based on the industry name
//       // Verify the signature from QStash and parse the body
//       const body = await request.json()
//       console.log("Received request body:", body);
//       const { recipient_email, industry_name, models } = body;
//       let industryName = industry_name; // Use a consistent variable name
//       console.log(`WORKER STARTED: Processing job for ${recipient_email} on industry ${industryName}`);
      
//       const instruction1 = getContext(industryName);
//       //   const models = response.models
//       let markdownPart1, markdownPart2, markdownPart3, markdownPart4, markdowntop, markdownoflist, industryReportPdfBuffer, ekgReportPdfBuffer;
//       let lastResponseId;

//       async function main() {
//           const filePath = path.resolve(process.cwd(), "_Idea scorecard for chatGPT.pdf");
//           const file = await client.files.create({
//               file: createReadStream(filePath),
//               purpose: "user_data"

//           });

//           console.log(file);
//           return file;
//       }

//       let fileId = 'file-3RFqN75HL6HpTnZbdWgXDK';
//       const checkFileIdExists = async (fileId) => {

//           const file = await client.files.retrieve(fileId);

//           console.log(file);
//           return file;

//       }
//       let file = await checkFileIdExists(fileId);
//       if (!file.id) {
//           console.log("Uploading file...");
//           file = await main().catch(console.error);
//           console.log("File ID:", file.id);
//           fileId = file.id;
//           console.log("New File ID:", fileId);
//       }

//       try {
//           let resp = await client.responses.create({
//               model: models[0],
//               input: [
//                   {
//                       "role": "user",
//                       "content": [
//                           {
//                               "type": "input_file",
//                               "file_id": `${fileId}`  // Use the file ID from the uploaded file
//                           },
//                           {
//                               "type": "input_text",
//                               "text": `${instruction1}`
//                           }
//                       ]
//                   }
//               ],
//               store: true,
//               tools: [
//                   { type: "web_search_preview" }
//               ],
//               reasoning: {
//                   "summary": "auto"
//               },
//               background: true,
//               max_tool_calls: 1,
//           });

//           console.log("Initial response created:", resp);
//           console.log("Response ID:", resp.id);
//           lastResponseId = resp.id;

//           while (resp.status === "queued" || resp.status === "in_progress") {
//               // console.log("Current status: " + resp.status);
//               await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
//               resp = await client.responses.retrieve(resp.id); // This reassignment is now allowed
//               // console.log("Updated response: " + resp);
//           }

//           console.log("Final status: " + resp.status + "\nOutput:\n" + resp.output_text, "resp>>>", resp);

//           markdownPart1 = resp.output_text;
//           console.log("Markdown Part 1:", markdownPart1);
//           // 2. Convert the Markdown text to an HTML fragment
//           // const parsedHtml1 = marked(markdownText);
//           // console.log("Parsed HTML:", parsedHtml1);

//           const result2 = await getApiResponse({ model: models[0], previous_response_id: lastResponseId, input: instruction2, store: true, tools: [{ type: "web_search_preview" }], background: true, max_tool_calls: 1 });
//           lastResponseId = result2.ResponseId;
//           markdownPart2 = result2.markdown;
//           console.log("Markdown Part 2:", markdownPart2);

//           const result3 = await getApiResponse({ model: models[0], previous_response_id: lastResponseId, input: instruction3, store: true, tools: [{ type: "web_search_preview" }], background: true, max_tool_calls: 1 });
//           lastResponseId = result3.ResponseId;
//           markdownPart3 = result3.markdown;
//           console.log("Markdown Part 3:", markdownPart3);

//           const result4 = await getApiResponse({ model: models[0], previous_response_id: lastResponseId, input: instruction4, store: true, tools: [{ type: "web_search_preview" }], background: true, max_tool_calls: 1 });
//           markdownPart4 = result4.markdown;
//           lastResponseId = result4.ResponseId;
//           console.log("Markdown Part 4:", markdownPart4);

//           const listSources = await getCoversationResponse({ model: "gpt-5", previous_response_id: lastResponseId, input: getSourcesListInstruction });
//           const getSummary = await getCoversationResponse({ model: "gpt-5", previous_response_id: lastResponseId, input: MarketReportSummaryInstruction });
//           markdowntop = getSummary.markdown;
//           markdownoflist = listSources.markdown;

//       } catch (error) {
//           console.error("❌ Error during Deep Research API calls:", error);
//           return new Response(JSON.stringify({ error: "Failed to generate report content from API." }), { status: 500 });
//       }

//       // Subsequent calls using previous_response_id


//       const fullMarkdownReport = [markdowntop, markdownoflist, markdownPart1, markdownPart2, markdownPart3, markdownPart4].join('\n\n---\n\n');


//       // Create HTML content
//       const fullHtmlContent = `
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                   <meta charset="UTF-8">
//                   <title>Industry Report: ${industryName}</title>
//                   <link rel="stylesheet" href="/styles/report.css">
//                 </head>
//                 <body>
//                   <div>${marked(fullMarkdownReport)}</div>
//                 </body>
//                 </html>`;


//       industryReportPdfBuffer = await generatePDFFromHTML(fullHtmlContent);
//       // Convert the generated PDF buffer to a Base64 string for the API call
//       const safeBuffer = Buffer.from(industryReportPdfBuffer);
//       const base64Pdf = safeBuffer.toString('base64');

//       const EkgReport = EkgReportInstruction1(industryName);

//       let ekgresp = await client.responses.create({
//           model: response.models[0],
//           input: [
//               {
//                   "role": "user",
//                   "content": [
//                       {
//                           "type": "input_file",
//                           "filename": "industry_report.pdf",
//                           "file_data": `data:application/pdf;base64,${base64Pdf}`  // Use the file ID from the uploaded file
//                       },
//                       {
//                           "type": "input_text",
//                           "text": `${EkgReport}`
//                       }
//                   ]
//               }
//           ],
//           store: true,
//           tools: [
//               { type: "web_search_preview" }
//           ],
//           reasoning: {
//               "summary": "auto"
//           },
//           background: true,
//           max_tool_calls: 1,
//       });


//       console.log("Response ID:", ekgresp.id);


//       while (ekgresp.status === "queued" || ekgresp.status === "in_progress") {
//           console.log("Current status: " + ekgresp.status);
//           await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
//           ekgresp = await client.responses.retrieve(ekgresp.id); // This reassignment is now allowed
//           // console.log("Updated response: " + resp);
//       }

//       console.log("Final status: " + ekgresp.status + "\nOutput:\n" + ekgresp.output_text, "resp>>>", ekgresp);

//       let ekgmarkdownPart1 = ekgresp.output_text;
//       // const ekgparsetHtml1 = marked(ekgmarkdownPart1);

//       const ekgresult2 = await getApiResponse({ model: models[0], previous_response_id: ekgresp.id, input: EkgReportInstruction2, store: true, tools: [{ type: "web_search_preview" }], background: true, max_tool_calls: 1 });

//       let ekgmarkdownPart2 = ekgresult2.markdown;
//       // const ekgparsetHtml2 = marked(ekgmarkdownPart2);

//       const ekgListSources = await getCoversationResponse({ model: "gpt-5", previous_response_id: lastResponseId, input: GetSourceListForEkgInstruction });
//       let ekgMarkdownSources = ekgListSources.markdown;
//       const fullEkgMarkdownReport = [ekgMarkdownSources, ekgmarkdownPart1, ekgmarkdownPart2].join('\n\n---\n\n');

//       // Create HTML content
//       const fullEkgHtmlContent = `
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                   <meta charset="UTF-8">
//                   <title>Industry Report: ${industryName}</title>
//                   <link rel="stylesheet" href="/styles/report.css">
//                 </head>
//                 <body>
//                   <div>${marked(fullEkgMarkdownReport)}</div>                
//                 </body>
//                 </html>`;


//       ekgReportPdfBuffer = await generatePDFFromHTML(fullEkgHtmlContent);



//       // const audioSummaryPromise = (async () => {
//       //   // 2a. Create Summary from Markdown
//       //   console.log("Generating podcast summary...");
//       //   const summaryPrompt = `Create a podcast script based on the following research report. Podcast name should be "The Deep-dive by Noah Research". Keep the script's speaking length to around 15 minutes. Structure it as a compelling narrative.

//       //             REPORT:
//       //             ${fullMarkdownReport}`;

//       //   const summaryResponse = await openAIClient.chat.completions.create({
//       //     model: "gpt-4-turbo",
//       //     messages: [{ role: "user", content: summaryPrompt }],
//       //   });
//       //   const podcastScript = summaryResponse.choices[0].message.content;
//       //   console.log("✅ Podcast summary script created.");

//       //   // 2b. Convert Summary to Audio using OpenAI TTS
//       //   console.log("Generating audio from script...");
//       //   const ttsResponse = await openAIClient.audio.speech.create({
//       //     model: "tts-1-hd",
//       //     voice: "alloy",
//       //     input: podcastScript,
//       //   });

//       //   const audioDir = path.join(process.cwd(), 'public', 'audio');
//       //   await fs.mkdir(audioDir, { recursive: true });
//       //   const audioFilePath = path.join(audioDir, 'report_summary.mp3');

//       //   const buffer = Buffer.from(await ttsResponse.arrayBuffer());
//       //   await fs.writeFile(audioFilePath, buffer);
//       //   console.log(`✅ Audio summary saved to: ${audioFilePath}`);
//       //   return audioFilePath;
//       // })();

//       // async function uploadPOV() {
//       //   const filePath = path.resolve(process.cwd(), "Vehicle_Service_Contract(VSC).pdf");
//       //   const file = await client.files.create({
//       //     file: createReadStream(filePath),
//       //     purpose: "user_data"

//       //   });

//       //   console.log(file);
//       //   return file.id;
//       // }

//       // const POV_FileId = await uploadPOV()
//       // console.log("POV File ID:", POV_FileId);



//       // --- Email Sending Logic ---
//       if (industryReportPdfBuffer && ekgReportPdfBuffer) {
//           try {
//               await transporter.sendMail({
//                   from: 'shiva92637@gmail.com', // Your sender email address (must match transporter.auth.user)
//                   to: recipient_email, // The recipient email from the request
//                   subject: "Your Industry & EKG Reports for ${industryName}",
//                   html: `<p>Hello,</p><p>Please find your requested reports attached.</p><p>Regards,<br/>Your API Service</p>`,
//                   text: `Hello,\n\nPlease find your requested reports attached.\n\nRegards,\nYour API Service`,
//                   attachments: [
//                       {
//                           filename: 'industry_report.pdf',
//                           content: industryReportPdfBuffer,
//                           contentType: 'application/pdf'
//                       },
//                       {
//                           filename: 'ekg_report.pdf',
//                           content: ekgReportPdfBuffer,
//                           contentType: 'application/pdf'
//                       }
//                   ]
//               });
//               console.log(`Email sent successfully to ${recipient_email}`);
//           } catch (emailError) {
//               console.error("Error sending email:", emailError);
//               if (emailError.code === 'EENVELOPE' || emailError.responseCode === 535) {
//                   console.error("Authentication error. Please check your email and App Password.");
//               }
//               // You might want to return an error status to the client here
//           }
//       } else {
//           console.warn("No output_text received from API, not sending email.");
//       }


//       // --- End of your main logic ---

//       console.log(`✅ WORKER FINISHED: Successfully processed job for ${recipient_email}`);
//       return new NextResponse("Job processed successfully.", { status: 200 });

//   } catch (error) {
//       console.error("❌ WORKER FAILED:", error);
//       if (error.message.includes("invalid signature")) {
//           return new NextResponse("Invalid signature.", { status: 401 });
//       }
//       return new NextResponse("Job processing failed.", { status: 500 });
//   }

// }





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