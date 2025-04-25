import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request: NextRequest) {
    try {
      const { pathname } = request.nextUrl;

      // If the user is authenticated and trying to access auth pages, redirect to dashboard
      if (
        request.nextauth.token &&
        (pathname.startsWith("/auth") || pathname === "/")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // If not authenticated and trying to access protected routes, redirect to signin
      if (!request.nextauth.token && !pathname.startsWith("/auth")) {
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check onboarding status for authenticated users
      if (request.nextauth.token && !pathname.startsWith("/auth")) {
        const isOnboardingRoute = pathname.startsWith("/onboarding");
        
        // For non-onboarding routes, check if onboarding is completed
        if (!isOnboardingRoute) {
          const response = await fetch(`${request.nextUrl.origin}/api/auth/check-onboarding`, {
            headers: {
              Cookie: request.headers.get("cookie") || "",
            },
          });
          
          if (response.ok) {
            const { onboardingCompleted } = await response.json();
            if (!onboardingCompleted) {
              return NextResponse.redirect(new URL("/onboarding/controller", request.url));
            }
          }
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      // On error, redirect to signin page
      const signInUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        try {
          // Allow all requests to /auth/* routes
          if (req.nextUrl.pathname.startsWith("/auth/")) {
            return true;
          }
          // For all other routes, require authentication
          return !!token;
        } catch (error) {
          console.error("Authorization error:", error);
          return false;
        }
      },
    },
  }
);

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
};
