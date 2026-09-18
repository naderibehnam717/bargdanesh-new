import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ امنیت و پاکیزگی
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // ✅ برای سئو: همه URLها بدون / انتهایی
  // اگه تصمیم گرفتی با / باشه، true کن
  trailingSlash: false,

  // ✅ ریدایرکت دامنه بدون www به www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bargdanesh.ir" }],
        destination: "https://www.bargdanesh.ir/:path*",
        permanent: true, // 301
      },
    ];
  },

  // ✅ هدرهای امنیتی و کش
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
      // کش طولانی برای فایل‌های استاتیک
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

  // ✅ بهینه‌سازی تصاویر
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // اگه از دامنه‌های خارجی عکس می‌گیری، اینجا اضافه کن
      // مثال:
      // { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // ✅ بهینه‌سازی import پکیج‌ها (کاهش bundle)
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },

  // ✅ کاهش حجم production
  productionBrowserSourceMaps: false,
};

export default nextConfig;