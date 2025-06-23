import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disabled - PocketBase uses localStorage which isn't accessible in middleware
  // The AdminGuard component handles client-side protection instead
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}; 