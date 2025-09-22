import OpenAI from "openai";
import nodemailer from "nodemailer"; // Import nodemailer

const NEXT_PUBLIC_OPENAI_API_KEY = "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"
const client = new OpenAI({
    apiKey: NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true // Use environment variable for OpenAI API key
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false for port 587 (TLS), true for port 465 (SSL)
    auth: {
        user: 'shiva92637@gmail.com', // Your Gmail address
        pass: 'rwhz havv alkk kfay' // !! IMPORTANT: Use an App Password here, NOT your regular Gmail password !!
    }
});

export async function POST(request) {
    const response = await request.json()
    const recipientEmail = response.recipient_email;
    console.log("Received request:", response)
    // CHANGE 'const resp' to 'let resp'
    let resp = await client.responses.create({
        model: response.models[0],
        input: response.instruction,
        tools: [
            { type: "web_search_preview" }
        ],
        reasoning: {
            "summary": "auto"
          },
        background: true,
        max_tool_calls: 5,
    });

    console.log("Initial response created:", resp);
   
    while (resp.status === "queued" || resp.status === "in_progress") {
        console.log("Current status: " + resp.status);
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        resp = await client.responses.retrieve(resp.id); // This reassignment is now allowed
    }

    console.log("Final status: " + resp.status + "\nOutput:\n" + resp.output_text, "resp>>>", resp);

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


    // --- Email Sending Logic ---
    if (resp.output_text) {
        try {
            await transporter.sendMail({
                from: 'shiva92637@gmail.com', // Your sender email address (must match transporter.auth.user)
                to: recipientEmail, // The recipient email from the request
                subject: "Deep Research API Output",
                html: `<p>Hello,</p><p>Here is the output from your deep research API request:</p><pre>${resp.output_text}</pre><p>Regards,</p><p>Your API Service</p>`,
                text: `Hello,\n\nHere is the output from your deep research API request:\n\n${resp.output_text}\n\nRegards,\nYour API Service`,
            });
            console.log(`Email sent successfully to ${recipientEmail}`);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            if (emailError.code === 'EENVELOPE' || emailError.responseCode === 535) {
                console.error("Authentication error. Please check your email and App Password.");
            }
            // You might want to return an error status to the client here
        }
    } else {
        console.warn("No output_text received from API, not sending email.");
    }
    return Response.json({ status: resp.status, output_text: resp.output_text, id: resp.id, resp: resp }); // Return the response with output_type
}


async function createDocx() {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Executive Summary Heading
            new Paragraph({
              text: 'Executive Summary',
              heading: HeadingLevel.HEADING_1,
            }),
            // Example Paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: "This is an example paragraph in the Executive Summary section.",
                  bold: true,
                }),
              ],
            }),
            // Example Table (e.g., Table 1.1)
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Category')] }),
                    new TableCell({ children: [new Paragraph('Description')] }),
                    new TableCell({ children: [new Paragraph('Typical Customers')] }),
                    new TableCell({ children: [new Paragraph('Est. % of Market')] }),
                  ],
                }),
                // Map API data to table rows
                // ...data.table1_1.map(
                //   (row) =>
                //     new TableRow({
                //       children: [
                //         new TableCell({ children: [new Paragraph(row.category)] }),
                //         new TableCell({ children: [new Paragraph(row.description)] }),
                //         new TableCell({ children: [new Paragraph(row.customers)] }),
                //         new TableCell({ children: [new Paragraph(row.marketShare)] }),
                //       ],
                //     })
                // ),
              ],
            }),
          ],
        },
      ],
    });
  
    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(path.join(process.cwd(), 'report.docx'), buffer);
    return buffer;
  }

  try {
    // Assume 'deepResearchOutput' is the structured data from your LLM/deep research API
    ; // Or however you get the data

    // Prepare data for the Django service (adjust structure as needed)
    // const reportData = {
    //   reportTitle: "Custom Traffic Control Report",
    //   reportDate: "August 8, 2025",
    //   executiveSummary: "Default summary...",
    //   industryDescription: "Default description...",
    //   marketSizeGrowthText: "Default market size text...",
    //   tableData: [
    //     ['Metric', 'Benchmark', 'Comment'] // default table data
    //   ],
    //   graphData: {
    //     // default graph data
    //   },
    //   conclusion: "Default conclusion..."
    // };

    // Call the Django microservice
    // IMPORTANT: Update this URL to where your Django service is running
    const djangoServiceUrl = process.env.NEXT_DJANGO_REPORT_SERVICE_URL || 'http://localhost:8000/api/generate-report/';
    const djangoResponse = await fetch(djangoServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Django's CSRF protection is disabled for this view with @csrf_exempt,
        // so you don't need to send a CSRF token for this API call.
      },
      body: JSON.stringify(resp),
    });

    if (!djangoResponse.ok) {
      const errorText = await djangoResponse.text();
      throw new Error(`Django service error: ${djangoResponse.status} - ${errorText}`);
    }

    // Get the DOCX file as a Blob or ArrayBuffer
    const docxBuffer = await djangoResponse.arrayBuffer();
    console.log("Received DOCX buffer from Django service>>>>", docxBuffer);

    const fileName = 'generated_report.docx';
    const filePath = path.join(process.cwd(), fileName); // process.cwd() points to the project root

    try {
      // Check if the file already exists
      await fs.access(filePath);
      // If it exists, delete it
      await fs.unlink(filePath);
      console.log(`Existing file ${fileName} deleted.`);
    } catch (error) {
      // If file doesn't exist (ENOENT error), proceed; otherwise, rethrow
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log(`No existing file ${fileName} found.`);
    }

    // Write the new DOCX buffer to the file
    await fs.writeFile(filePath, Buffer.from(docxBuffer));
    console.log(`New DOCX file saved at: ${filePath}`);

    // To view contents: DOCX is a binary format, so you can open the saved file in Microsoft Word or similar.
    // If you need to programmatically extract text/content, consider using a library like 'mammoth' or 'docx-parser'.
    // For example, install 'mammoth' via npm and use it to extract text:
    // const mammoth = require('mammoth');
    // const result = await mammoth.extractRawText({ path: filePath });
    // console.log('Extracted text:', result.value);
    
    // Set headers for DOCX download
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    // res.setHeader('Content-Disposition', 'attachment; filename="Traffic_Control_Report.docx"');
    // res.status(200).send(Buffer.from(docxBuffer)); // Send the buffer directly

  } catch (error) {
    console.error('Error in Next.js API route:', error);
    // res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }