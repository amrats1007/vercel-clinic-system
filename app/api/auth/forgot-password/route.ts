import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single()

    // Always return success to prevent email enumeration
    if (userError || !user) {
      console.log("User not found for email:", email)
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenError) {
      console.error("Error storing reset token:", tokenError)
      return NextResponse.json({ error: "Failed to generate reset token" }, { status: 500 })
    }

    // In production, you would send an actual email here
    // For development, we'll just log the reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    console.log("Password reset link for", email, ":", resetUrl)

    // TODO: Send actual email in production
    // await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
