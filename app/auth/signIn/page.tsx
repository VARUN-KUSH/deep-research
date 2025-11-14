// src/app/auth/signin/page.tsx
'use client'

import { signIn } from "next-auth/react"

export default function SignInPage() {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    if (!email) return

    // This will trigger the "resend" provider and send the magic link
    await signIn("resend", { email, redirect: false })

    // Optionally, redirect to the verify-request page
    window.location.href = "/auth/verify-request"
  }

  return (
    <div>
      <h2>Sign in with a magic link</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" required />
        <button type="submit">Send Magic Link</button>
      </form>
    </div>
  )
}