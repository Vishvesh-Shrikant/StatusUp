import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname, search } = req.nextUrl;

    // 🔒 Protected routes
    const protectedRoutes = ["/dashboard"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !req.nextauth.token) {
      // redirect to signin if not logged in
      const url = req.nextUrl.clone();
      const callbackUrl = pathname + search;
      url.pathname = "/signin";
      url.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(url);
    }

    // Prevent logged-in users from accessing /signin and /signup
    const authRoutes = [
      "/signin",
      "/signup",
      "/verifyEmail",
      "/email-verified",
    ];
    if (
      req.nextauth.token &&
      authRoutes.some((route) => pathname.startsWith(route))
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow access to auth pages (signin, signup)
        const publicAuthRoutes = ["/signin", "/signup"];
        if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // For protected routes, require token
        const protectedRoutes = ["/dashboard"];
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (isProtectedRoute) {
          return !!token;
        }

        // Allow everything else
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/verifyEmail",
    "/email-verified",
  ],
};
