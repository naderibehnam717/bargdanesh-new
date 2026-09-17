"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Download {
  id: string;
  fileTitle: string;
  createdAt: string;
}

export default function DownloadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchDownloads();
    }
  }, [status, router]);

  async function fetchDownloads() {
    try {
      const res = await fetch("/api/user/downloads");
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setDownloads(data);
    } catch {
      console.error("خطا در دریافت تاریخچه");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container" style={{ textAlign: "center", padding: "60px" }}>
          در حال بارگذاری...
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📥 تاریخچه دانلود</h1>
          <p className="page-header__subtitle">
            {downloads.length} فایل دانلود شده
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "var(--sp-5)" }}>
            <Link href="/dashboard" className="btn btn--ghost">
              ← بازگشت به پنل کاربری
            </Link>
          </div>

          {downloads.length === 0 ? (
            <div
              style={{
                background: "var(--card)",
                padding: "60px 20px",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "var(--sp-3)" }}>
                📥
              </div>
              <p style={{ fontSize: "16px", marginBottom: "var(--sp-3)" }}>
                هنوز هیچ فایلی دانلود نکردی
              </p>
              <Link href="/" className="btn btn--primary">
                🔍 جستجوی فایل‌ها
              </Link>
            </div>
          ) : (
            <div
              style={{
                background: "var(--card)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              {downloads.map((dl) => (
                <div
                  key={dl.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--sp-4)",
                    borderBottom: "1px solid var(--border)",
                    gap: "var(--sp-3)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      📄 {dl.fileTitle}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      📅 {new Date(dl.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}