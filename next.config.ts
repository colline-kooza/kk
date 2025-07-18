// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable experimental features for subdomain handling
  experimental: {
    // This helps with subdomain routing
    serverComponentsExternalPackages: [],
  },

  // Configure headers for subdomain support
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Configure rewrites for subdomain handling
  async rewrites() {
    return {
      beforeFiles: [
        // Handle subdomain routing
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "(?<subdomain>.*)\\.localhost:3000",
            },
          ],
          destination: "/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
