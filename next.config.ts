import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
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
