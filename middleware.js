import { NextResponse } from "next/server";

export function middleware(request) {
  // Middleware can't access localStorage (client-side storage)
  // Auth protection happens in client components instead
  // This middleware just passes through - see DashboardLayout for client-side auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
