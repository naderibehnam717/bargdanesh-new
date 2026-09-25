import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import { prisma } from "@/lib/prisma";

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function StatsBanner() {
  const allFiles = await getAllFiles();
  const konkurCount = await prisma.konkur.count();
  const totalCount = allFiles.length + konkurCount;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
        borderRadius: "16px",
        padding: "28px 20px",
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0, 102, 204, 0.25)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          fontSize: "42px",
          marginBottom: "8px",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      >
        📚
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: 900,
          lineHeight: 1.2,
          marginBottom: "4px",
          letterSpacing: "-1px",
        }}
      >
        +{toFa(totalCount)}
      </div>

      <div
        style={{
          fontSize: "14px",
          opacity: 0.95,
          marginBottom: "20px",
          fontWeight: 500,
        }}
      >
        منبع آموزشی رایگان
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.25)",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            opacity: 0.9,
            lineHeight: 1.8,
          }}
        >
          ✨ همه رایگان
          <br />
          ⚡ دانلود سریع
          <br />
          🎯 کیفیت بالا
        </div>
      </div>

      <Link
        href="/signup"
        style={{
          display: "block",
          background: "#fff",
          color: "#0066cc",
          padding: "10px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 700,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        🚀 شروع کن (رایگان)
      </Link>
    </div>
  );
}