import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: '/image/heic-to-jpg',
        destination: '/image/convert-heic',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
