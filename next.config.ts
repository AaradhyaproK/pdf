import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
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
        source: '/image/to-pdf',
        destination: '/image/pics-to-pdf',
        permanent: true,
      },
      {
        source: '/image/png-to-pdf',
        destination: '/image/pics-to-pdf',
        permanent: true,
      },
      {
        source: '/image/passport-photo-maker',
        destination: '/image/passport-maker',
        permanent: true,
      },
      {
        source: '/image/resize-signature',
        destination: '/tools/signature-resizer-10-to-20kb',
        permanent: true,
      },
      {
        source: '/image/convert',
        destination: '/image/jpg-to-png',
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
      {
        source: '/presets/ssc-pdf-200kb',
        destination: '/pdf/compress-to-200kb',
        permanent: true,
      },
      {
        source: '/presets/upsc-pdf-300kb',
        destination: '/pdf/compress-to-200kb',
        permanent: true,
      },
      {
        source: '/presets/:slug',
        destination: '/tools/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
