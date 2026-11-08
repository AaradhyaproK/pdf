import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "sonner"],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild',
      'node_modules/webpack',
      'node_modules/terser',
    ],
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
            value: "public, max-age=86400, s-maxage=86400",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/.well-known/security.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif|woff|woff2|ttf|eot|wasm|mjs|mp3|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
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
      // 1. PDF Target Size Consolidation (Merged into /pdf/compress with #hash)
      {
        source: '/pdf/compress-to-100kb',
        destination: '/pdf/compress#100kb',
        permanent: true,
      },
      {
        source: '/pdf/compress-to-200kb',
        destination: '/pdf/compress#200kb',
        permanent: true,
      },
      {
        source: '/pdf/compress-to-300kb',
        destination: '/pdf/compress#300kb',
        permanent: true,
      },
      {
        source: '/pdf/compress-to-500kb',
        destination: '/pdf/compress#500kb',
        permanent: true,
      },
      {
        source: '/pdf/compress-to-1mb',
        destination: '/pdf/compress#1mb',
        permanent: true,
      },

      // 2. Image Target Size Consolidation (Merged into /image/compress with #hash)
      {
        source: '/image/compress-to-20kb',
        destination: '/image/compress#20kb',
        permanent: true,
      },
      {
        source: '/image/compress-to-50kb',
        destination: '/image/compress#50kb',
        permanent: true,
      },
      {
        source: '/image/compress-to-100kb',
        destination: '/image/compress#100kb',
        permanent: true,
      },

      // 3. Duplicate Exam & Portal Presets Consolidation
      {
        source: '/tools/railway-rrb-photo-resizer',
        destination: '/tools/rrb-railway-photo-resizer',
        permanent: true,
      },
      {
        source: '/tools/ibps-photo-resizer',
        destination: '/tools/ibps-sbi-photo-resizer',
        permanent: true,
      },
      {
        source: '/tools/sbi-po-photo-resizer',
        destination: '/tools/ibps-sbi-photo-resizer',
        permanent: true,
      },
      {
        source: '/tools/ssc-cgl-photo-signature-resizer',
        destination: '/tools/ssc-photo-resizer#cgl',
        permanent: true,
      },
      {
        source: '/tools/upsc-otr-photo-resizer',
        destination: '/tools/upsc-photo-resizer#otr',
        permanent: true,
      },
      {
        source: '/tools/jee-photo-resizer',
        destination: '/tools/jee-cuet-photo-resizer#jee',
        permanent: true,
      },
      {
        source: '/tools/cuet-photo-resizer',
        destination: '/tools/jee-cuet-photo-resizer#cuet',
        permanent: true,
      },
      {
        source: '/tools/signature-resizer-10-to-20kb',
        destination: '/tools/online-signature-maker#resize',
        permanent: true,
      },
      {
        source: '/tools/gate-signature-resizer',
        destination: '/tools/online-signature-maker#gate',
        permanent: true,
      },
      {
        source: '/tools/clean-black-white-signature',
        destination: '/tools/online-signature-maker#clean',
        permanent: true,
      },

      // 4. Duplicate Novelty Tool
      {
        source: '/utility/roll-the-dice',
        destination: '/utility/dice-roller',
        permanent: true,
      },

      // 5. Category Hub Aliases
      {
        source: '/pdf',
        destination: '/pdf-tools',
        permanent: true,
      },
      {
        source: '/image',
        destination: '/image-tools',
        permanent: true,
      },
      {
        source: '/utility',
        destination: '/utility-tools',
        permanent: true,
      },
      {
        source: '/social',
        destination: '/social-tools',
        permanent: true,
      },

      // 6. Legacy & Established Site Redirects
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
        destination: '/tools/online-signature-maker#resize',
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
        destination: '/pdf/compress#200kb',
        permanent: true,
      },
      {
        source: '/presets/upsc-pdf-300kb',
        destination: '/pdf/compress#300kb',
        permanent: true,
      },
      {
        source: '/blog/income-tax-slabs-fy-2025-26',
        destination: '/blog/old-vs-new-tax-regime-calculator-guide',
        permanent: true,
      },
      {
        source: '/tools/compress-image-to-20kb',
        destination: '/image/compress#20kb',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-excel',
        destination: '/pdf/pdf-to-excel',
        permanent: true,
      },
      {
        source: '/tools/compress-image-to-50kb',
        destination: '/image/compress#50kb',
        permanent: true,
      },
      {
        source: '/tools/compress-image-to-100kb',
        destination: '/image/compress#100kb',
        permanent: true,
      },
      {
        source: '/tools/exam-age-calculator',
        destination: '/utility/age-calculator',
        permanent: true,
      },
      {
        source: '/tools/cgpa-to-percentage',
        destination: '/utility/cgpa-to-percentage',
        permanent: true,
      },
      {
        source: '/calculators/age-calculator',
        destination: '/utility/age-calculator',
        permanent: true,
      },
      {
        source: '/calculators/cgpa-to-percentage',
        destination: '/utility/cgpa-to-percentage',
        permanent: true,
      },
      {
        source: '/utility/love-calculator',
        destination: '/image/greeting-card-maker',
        permanent: true,
      },
      {
        source: '/presets/:slug',
        destination: '/tools/:slug',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/affiliate-disclosure',
        destination: '/editorial-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
