import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * SPRED Command Center Middleware
 * Protects administrative routes and ensures secure session state.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const isPublicPage = pathname.startsWith('/login') || pathname.startsWith('/api/public')
  
  // Skip middleware for static assets, images, and next internals
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check for admin token in cookies or localStorage
  // Note: localStorage isn't accessible in Next.js middleware (Server-side)
  // For production, we should use a session cookie.
  // For this implementation, we will check a 'spred_session' cookie.
  const sessionToken = request.cookies.get('spred_admin_token')?.value

  // If trying to access dashboard without a token, redirect to login
  if (!sessionToken && !isPublicPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access login page with a valid token, redirect to dashboard
  if (sessionToken && isPublicPage) {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
