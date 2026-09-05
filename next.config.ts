import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/image/heic-to-jpg',
        destination: '/image/convert-heic',
        permanent: true,
      },
      {
        source: '/guides/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
