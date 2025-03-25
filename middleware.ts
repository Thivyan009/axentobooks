import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // If the user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && (pathname.startsWith("/auth") || pathname === "/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If not authenticated and trying to access protected routes, redirect to signin
    if (!token && !pathname.startsWith("/auth")) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Check if user is admin
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow all requests to /auth/* routes
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true
        }

        // For admin routes, require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
} 