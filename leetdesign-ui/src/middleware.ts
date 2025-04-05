import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// JWT secret key (same as in login route)
const JWT_SECRET = 'your-jwt-secret-key-change-this-in-production';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/about'];

// Routes that require authentication to access
const protectedRoutes = ['/problems/create']; // Add other protected routes here

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a public asset (like images, CSS)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if the user is trying to access a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // If there's no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify the token
      verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if the user is already logged in and trying to access login/signup pages
  if (token && (pathname === '/login' || pathname === '/signup')) {
    try {
      // Verify the token
      verify(token, JWT_SECRET);
      // If token is valid, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // If token is invalid, allow access to login/signup
      return NextResponse.next();
    }
  }
  
  // For all other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth).*)'],
}; 