"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StatsData {
  totals: {
    users: number;
    files: number;
    downloads: number;
    comments: number;
    quizzes: number;
    quizAttempts: number;
  };
  daily: {
    users: { date: string; count: number }[];
    downloads: { date: string; count: number }[];
    comments: { date: string; count: number }[];
  };
  topDownloads: { title: string; count: number }[];
  activeUsers: {
    id: string;
    name: string;
    email: string;
    downloads: number;
    comments: number;
    favorites: number;
  }[];
  topCommentFiles: { slug: string; count: number }[];
  quizByCategory: { category: string; count: number }[];
}

// ─── تبدیل عدد به فارسی ───
function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

// ─── Mini Bar Chart (بدون کتابخانه) ───
function BarChart({
  data,
  color = "#0066cc",
  maxHeight = 60,
  label,
}: {
  data: { date: string; count: number }[];
  color?: string;
  maxHeight?: number;
  label: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          color: "#666",
          marginBottom: "10px",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "2px",
          height: `${maxHeight}px`,
          padding: "8px 0",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        {data.map((d, i) => {
          const height = (d.count / maxValue) * maxHeight;
          return (
            <div
              key={i}
              title={`${d.date}: ${d.count}`}
              style={{
                flex: 1,
                height: `${Math.max(height, 2)}px`,
                background:
                  d.count > 0
                    ? `linear-gradient(180deg, ${color}, ${color}cc)`
                    : "#f0f0f0",
                borderRadius: "2px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                minWidth: "4px",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "6px",
          fontSize: "10px",
          color: "#999",
        }}
      >
        <span>۳۰ روز پیش</span>
        <span>امروز</span>
      </div>
    </div>
  );
}

export default function AdminStatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

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
      fetchStats();
    }
  }, [status, session, router]);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setData(result);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="section">
        <div
          className="container"
          style={{ textAlign: "center", padding: "60px" }}
        >
          در حال بارگذاری...
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="section">
        <div
          className="container"
          style={{ textAlign: "center", padding: "60px" }}
        >
          خطا در دریافت داده‌ها
        </div>
      </main>
    );
  }

  const totalUserCount = data.daily.users.reduce(
    (sum, d) => sum + d.count,
    0
  );
  const totalDownloadCount = data.daily.downloads.reduce(
    (sum, d) => sum + d.count,
    0
  );
  const totalCommentCount = data.daily.comments.reduce(
    (sum, d) => sum + d.count,
    0
  );

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📊 آمار پیشرفته</h1>
          <p className="page-header__subtitle">
            گزارش کامل از عملکرد برگ دانش
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "24px" }}>
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
          </div>

          {/* ─── آمار کلی ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                icon: "👥",
                label: "کاربران",
                value: data.totals.users,
                color: "#0066cc",
              },
              {
                icon: "📁",
                label: "فایل‌ها",
                value: data.totals.files,
                color: "#10b981",
              },
              {
                icon: "📥",
                label: "دانلودها",
                value: data.totals.downloads,
                color: "#7c3aed",
              },
              {
                icon: "💬",
                label: "کامنت‌ها",
                value: data.totals.comments,
                color: "#f59e0b",
              },
              {
                icon: "🎯",
                label: "کوییزها",
                value: data.totals.quizzes,
                color: "#e11d48",
              },
              {
                icon: "✅",
                label: "پاسخ‌ها",
                value: data.totals.quizAttempts,
                color: "#0ea5e9",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: item.color,
                    lineHeight: 1.2,
                  }}
                >
                  {toFa(item.value)}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* ─── نمودارها ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <BarChart
                data={data.daily.users}
                color="#0066cc"
                label={`👥 کاربران جدید (۳۰ روز اخیر: ${toFa(
                  totalUserCount
                )})`}
              />
            </div>

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <BarChart
                data={data.daily.downloads}
                color="#7c3aed"
                label={`📥 دانلودها (۳۰ روز اخیر: ${toFa(
                  totalDownloadCount
                )})`}
              />
            </div>

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <BarChart
                data={data.daily.comments}
                color="#f59e0b"
                label={`💬 کامنت‌ها (۳۰ روز اخیر: ${toFa(
                  totalCommentCount
                )})`}
              />
            </div>
          </div>

          {/* ─── دو ستونه: Top Downloads + Top Users ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {/* Top Downloads */}
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🔥 پرفروش‌ترین فایل‌ها
              </h3>

              {data.topDownloads.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  هنوز دانلودی ثبت نشده
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {data.topDownloads.map((item, i) => {
                    const maxCount = data.topDownloads[0]?.count || 1;
                    const width = (item.count / maxCount) * 100;
                    return (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                            marginBottom: "4px",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "#1a1a1a",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {i + 1}. {item.title}
                          </span>
                          <span
                            style={{
                              color: "#0066cc",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {toFa(item.count)}
                          </span>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#f0f0f0",
                            borderRadius: "100px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${width}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #0066cc, #7c3aed)",
                              borderRadius: "100px",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Users */}
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🏆 فعال‌ترین کاربران
              </h3>

              {data.activeUsers.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  هنوز کاربری نیست
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {data.activeUsers.map((user, i) => (
                    <div
                      key={user.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "#f8f9fa",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0066cc, #7c3aed)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {i + 1}. {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#666",
                            display: "flex",
                            gap: "8px",
                            marginTop: "2px",
                          }}
                        >
                          <span>📥 {toFa(user.downloads)}</span>
                          <span>💬 {toFa(user.comments)}</span>
                          <span>❤️ {toFa(user.favorites)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── دو ستونه: Top Comment Files + Quiz By Category ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Top Comment Files */}
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                💬 پرگفتگوترین فایل‌ها
              </h3>

              {data.topCommentFiles.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  هنوز کامنتی نیست
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {data.topCommentFiles.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1a1a1a",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {item.slug}
                      </span>
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "3px 10px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginRight: "8px",
                        }}
                      >
                        {toFa(item.count)} کامنت
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz By Category */}
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                🎯 کوییزها بر اساس دسته
              </h3>

              {data.quizByCategory.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  هنوز کوییز نیست
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {data.quizByCategory.map((item, i) => {
                    const maxCount = data.quizByCategory[0]?.count || 1;
                    const width = (item.count / maxCount) * 100;
                    return (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ color: "#1a1a1a", fontWeight: 600 }}>
                            {item.category}
                          </span>
                          <span
                            style={{ color: "#e11d48", fontWeight: 700 }}
                          >
                            {toFa(item.count)}
                          </span>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#f0f0f0",
                            borderRadius: "100px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${width}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #e11d48, #f59e0b)",
                              borderRadius: "100px",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}