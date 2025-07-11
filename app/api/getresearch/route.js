import OpenAI from "openai";
import nodemailer from "nodemailer"; // Import nodemailer

const NEXT_PUBLIC_OPENAI_API_KEY="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"
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
        model: "o3",
        input: response.instruction,
        background: true,
    });

    while (resp.status === "queued" || resp.status === "in_progress") {
        console.log("Current status: " + resp.status);
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        resp = await client.responses.retrieve(resp.id); // This reassignment is now allowed
    }

    console.log("Final status: " + resp.status + "\nOutput:\n" + resp.output_text);

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
    return Response.json({ status: resp.status, output_text: resp.output_text, id: resp.id });
}