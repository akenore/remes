import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const ContentSecurityPolicy = [
  "default-src 'self';",
  "base-uri 'self';",
  "form-action 'self';",
  "font-src 'self' https://fonts.gstatic.com data:;",
  "frame-ancestors 'self';",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com;",
  "img-src 'self' data: blob: https:;",
  "object-src 'none';",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pocket.remes-tunisie.com;",
  "media-src 'self' https:;",
  "manifest-src 'self';",
  "upgrade-insecure-requests;",
].join(' ');

const securityHeaders: Array<{ key: string; value: string }> = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '0',
  },
];

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async headers() {
    if (!isProd) {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.78',
        port: '3000',
        pathname: '/api/pb/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/pb/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/pb/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'pocket.remes-tunisie.com',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'pocket.remes-tunisie.com',
        pathname: '/api/files/*/*/*',
      },
      {
        protocol: 'https',
        hostname: 'pocket.remes-tunisie.com',
        pathname: '/api/files/pbc_*/*/*',
      },
      {
        protocol: 'https',
        hostname: 'remes-tunisie.com',
        pathname: '/api/pb/api/files/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 85, 90, 95, 100],
  },
};

export default withNextIntl(nextConfig);
