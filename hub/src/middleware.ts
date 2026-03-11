import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/me']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Allow static assets
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.endsWith('.ico') || pathname.endsWith('.svg') || pathname.endsWith('.png') || pathname.endsWith('.jpg')) {
    return NextResponse.next()
  }

  // Allow API calls with valid API key
  if (pathname.startsWith('/api/')) {
    const apiKey = request.headers.get('x-api-key') || ''
    const authHeader = request.headers.get('authorization') || ''
    if (apiKey || authHeader) {
      return NextResponse.next()
    }
  }

  // Check session cookie
  const session = request.cookies.get('mc-session')
  if (!session?.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
