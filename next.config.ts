import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Don't ignore build errors in development for better debugging
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Only modify webpack config in production or for specific optimizations
    if (!dev && !isServer) {
      // Production optimizations can go here
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
      };
    }
    return config;
  },
  eslint: {
    // Only ignore ESLint errors in production builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  // Allow cross-origin requests from the development environment
  allowedDevOrigins: [
    'preview-chat-b2755342-82d3-4016-ac9a-28f4a6f92221.space.z.ai',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
};

export default nextConfig;
