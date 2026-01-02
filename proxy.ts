import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Generate a cryptographically secure nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Run the intl middleware first
  const response = intlMiddleware(request);

  // Define CSP directives
  // We use 'unsafe-inline' for styles as many libraries inject styles dynamically.
  // 'strict-dynamic' is used for script-src to allow trusted scripts to load their dependencies.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https: http:;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://koalendar.com https://cdn.tiny.cloud https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https:;
    font-src 'self' https://fonts.gstatic.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://player.vimeo.com https://koalendar.com https://cdn.strakon.fr;
    frame-ancestors 'self';
    media-src 'self' https: blob:;
    connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pocket.remes-tunisie.com https://koalendar.com https://cdn.tiny.cloud https://cdn.jsdelivr.net https://api.web3forms.com https://sst.remes-tunisie.com;
    upgrade-insecure-requests;
  `;

  // Filter out extra whitespace
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Set the nonce and CSP headers
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};