import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Find valid reset token
    const { data: resetToken, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("user_id, expires_at")
      .eq("token", token)
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(resetToken.expires_at)

    if (now > expiresAt) {
      // Clean up expired token
      await supabase.from("password_reset_tokens").delete().eq("token", token)

      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", resetToken.user_id)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Delete the used reset token
    await supabase.from("password_reset_tokens").delete().eq("token", token)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
