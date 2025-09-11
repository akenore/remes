import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
        protocol: 'https',
        hostname: 'remesapi.beandgo.us',
        pathname: '/api/files/**',
      },
    ],
    qualities: [75, 85, 90, 95, 100],
  },
};

export default withNextIntl(nextConfig);
