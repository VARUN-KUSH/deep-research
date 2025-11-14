// src/auth.ts

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // Adjust path if you put prisma.ts elsewhere
import Resend from "next-auth/providers/resend" // Example email provider

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // This is the provider for magic links.
    // You'll need to set up an email service like Resend, Nodemailer, or SendGrid.
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "login@your-domain.com", // Must be a verified domain
    }),
    // You can add other providers here (e.g., Google, GitHub)
  ],
  session: {
    // Use "database" strategy so sessions are stored in your Azure DB
    strategy: "database",
  },
  // Define custom pages for the auth flow
  pages: {
    signIn: "/auth/signin",          // Page with the email input form
    verifyRequest: "/auth/verify-request", // Page shown after email is sent
    error: "/auth/error",            // Page to display auth errors
  }
})