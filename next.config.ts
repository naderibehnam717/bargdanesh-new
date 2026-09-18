import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ امنیت و پاکیزگی
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  // ✅ برای سئو: همه URLها بدون / انتهایی
  trailingSlash: false,

  // ✅ توجه: ریدایرکت www در Vercel انجام می‌شه
  //    پس اینجا لازم نیست (جلوگیری از double redirect)

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
    remotePatterns: [],
  },

  // ✅ بهینه‌سازی import پکیج‌ها (کاهش bundle)
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },

  // ✅ کاهش حجم production
  productionBrowserSourceMaps: false,
};

export default nextConfig;