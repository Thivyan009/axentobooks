import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect super admin to their dashboard if they try to access regular routes
    if (token?.role === "SUPER_ADMIN" && path === "/") {
      return NextResponse.redirect(new URL("/super-admin/dashboard", req.url))
    }

    // Prevent non-super admins from accessing super admin routes
    if (path.startsWith("/super-admin") && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/super-admin/:path*",
    "/",
  ],
} 