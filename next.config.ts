import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  trailingSlash: false,

  // ─── ریدایرکت صفحات قدیمی رشته‌ها به /subject/[slug] ───
  async redirects() {
    return [
      { source: "/physics", destination: "/subject/physics", permanent: true },
      { source: "/chemistry", destination: "/subject/chemistry", permanent: true },
      { source: "/computer", destination: "/subject/computer", permanent: true },
      { source: "/psychology", destination: "/subject/psychology", permanent: true },
      { source: "/education", destination: "/subject/education", permanent: true },
      { source: "/sociology", destination: "/subject/sociology", permanent: true },
      { source: "/english", destination: "/subject/english", permanent: true },
      { source: "/islamic", destination: "/subject/islamic", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },

  productionBrowserSourceMaps: false,
};

export default nextConfig;