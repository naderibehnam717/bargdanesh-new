"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Download {
  id: string;
  fileTitle: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

function toFaDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default function AdminDownloadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showLimit, setShowLimit] = useState(100);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (
      status === "authenticated" &&
      (session?.user as { role?: string })?.role !== "admin"
    ) {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchDownloads();
    }
  }, [status, session, router, showLimit]);

  async function fetchDownloads() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/downloads?limit=${showLimit}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDownloads(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const headers = ["تاریخ", "کاربر", "ایمیل", "فایل"];
    const rows = filtered.map((d) => [
      toFaDate(d.createdAt),
      d.user.name || "بدون نام",
      d.user.email,
      d.fileTitle,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `downloads-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const filtered = downloads.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.fileTitle.toLowerCase().includes(q) ||
      (d.user.name?.toLowerCase() || "").includes(q) ||
      d.user.email.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📥 تاریخچه دانلود</h1>
          <p className="page-header__subtitle">
            {toFa(downloads.length)} دانلود ثبت شده
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>

            <div
              style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
            >
              <select
                value={showLimit}
                onChange={(e) => setShowLimit(Number(e.target.value))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  background: "#fff",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value={50}>۵۰ دانلود آخر</option>
                <option value={100}>۱۰۰ دانلود آخر</option>
                <option value={250}>۲۵۰ دانلود آخر</option>
                <option value={500}>۵۰۰ دانلود آخر</option>
              </select>

              <button
                onClick={exportCSV}
                disabled={filtered.length === 0}
                className="btn btn--primary btn--sm"
                style={{
                  opacity: filtered.length === 0 ? 0.5 : 1,
                }}
              >
                📄 خروجی CSV
              </button>
            </div>
          </div>

          {/* جستجو */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در فایل، کاربر یا ایمیل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                background: "#fff",
              }}
            />
          </div>

          {loading ? (
            <div
              style={{
                background: "#fff",
                padding: "60px 20px",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                textAlign: "center",
                color: "#999",
              }}
            >
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                background: "#fff",
                padding: "60px 20px",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                textAlign: "center",
                color: "#999",
              }}
            >
              📥 دانلودی یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {filtered.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: "#fff",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e5e5e5",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #0066cc, #7c3aed)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {d.user.name?.charAt(0) || "ک"}
                  </div>

                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: "2px",
                      }}
                    >
                      {d.fileTitle}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      👤 {d.user.name || "بدون نام"} — {d.user.email}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flexShrink: 0,
                    }}
                  >
                    🕐 {toFaDate(d.createdAt)}
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