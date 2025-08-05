import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "./lib/supabase"
import { jwtVerify } from 'jose'

const protectedRoutes = ["/admin", "/clinic-admin", "/doctor", "/secretary", "/purchasing", "/patient"]
const authRoutes = ["/login", "/register"]

// JWT secret for session validation
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

async function validateSessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.userId as string
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.includes(path)

  const sessionCookie = request.cookies.get("session")

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && sessionCookie) {
    // Verify session is valid and redirect based on role
    try {
      const userId = await validateSessionToken(sessionCookie.value)
      if (!userId) {
        // Invalid token, continue to auth page
        return NextResponse.next()
      }

      const supabase = createServerClient()
      const { data: user } = await supabase
        .from("users")
        .select("role, is_active, must_change_password")
        .eq("id", userId)
        .eq("is_active", true)
        .single()

      if (user) {
        // If user must change password, redirect to change password page
        if (user.must_change_password && path !== "/change-password") {
          return NextResponse.redirect(new URL("/change-password", request.url))
        }

        // Redirect based on role
        let dashboardPath = "/dashboard"
        switch (user.role) {
          case "super_admin":
            dashboardPath = "/admin"
            break
          case "clinic_admin":
            dashboardPath = "/clinic-admin"
            break
          case "doctor":
            dashboardPath = "/doctor"
            break
          case "secretary":
            dashboardPath = "/secretary"
            break
          case "purchasing":
            dashboardPath = "/purchasing"
            break
          case "patient":
            dashboardPath = "/patient"
            break
        }
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      }
    } catch (error) {
      // Invalid session, continue to auth page
    }
  }

  // Role-based route protection with clinic restrictions
  if (isProtectedRoute && sessionCookie) {
    try {
      const userId = await validateSessionToken(sessionCookie.value)
      if (!userId) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const supabase = createServerClient()
      const { data: user } = await supabase
        .from("users")
        .select("role, is_active, clinic_id, must_change_password")
        .eq("id", userId)
        .eq("is_active", true)
        .single()

      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Force password change if required
      if (user.must_change_password && path !== "/change-password") {
        return NextResponse.redirect(new URL("/change-password", request.url))
      }

      // Check if user has access to the requested route
      const roleRouteMap: Record<string, string[]> = {
        super_admin: ["/admin"],
        clinic_admin: ["/clinic-admin"],
        doctor: ["/doctor"],
        secretary: ["/secretary"],
        purchasing: ["/purchasing"],
        patient: ["/patient"],
      }

      const allowedRoutes = roleRouteMap[user.role] || []
      const hasAccess = allowedRoutes.some((route) => path.startsWith(route))

      if (!hasAccess) {
        // Redirect to appropriate dashboard
        const dashboardPath = allowedRoutes[0] || "/login"
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      }

      // Additional clinic-based restrictions
      if (["clinic_admin", "doctor", "secretary", "purchasing"].includes(user.role) && !user.clinic_id) {
        // Staff without clinic assignment should be redirected to error page
        return NextResponse.redirect(new URL("/error?message=no-clinic-assigned", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
