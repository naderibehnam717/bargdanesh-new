import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as { role?: string }).role !== "admin") {
    redirect("/dashboard");
  }

  const [
    totalUsers,
    totalDownloads,
    totalComments,
    totalFiles,
    totalQuizzes,
    totalLogs,
    totalKonkur,
    totalCategories,
    totalArticles,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.download.count(),
    prisma.comment.count(),
    prisma.file.count(),
    prisma.quiz.count(),
    prisma.activityLog.count(),
    prisma.konkur.count(),
    prisma.category.count(),
    prisma.article.count(),
  ]);

  const stats = [
    {
      icon: "👥",
      label: "کاربر",
      value: totalUsers,
      color: "#2563eb",
      bg: "#dbeafe",
      href: "/admin/users",
    },
    {
      icon: "📁",
      label: "فایل",
      value: totalFiles,
      color: "#10b981",
      bg: "#d1fae5",
      href: "/admin/files",
    },
    {
      icon: "📄",
      label: "مقاله",
      value: totalArticles,
      color: "#8b5cf6",
      bg: "#ede9fe",
      href: "/admin/articles",
    },
    {
      icon: "📚",
      label: "کنکور",
      value: totalKonkur,
      color: "#f59e0b",
      bg: "#fef3c7",
      href: "/admin/konkur",
    },
    {
      icon: "📂",
      label: "دسته",
      value: totalCategories,
      color: "#0ea5e9",
      bg: "#e0f2fe",
      href: "/admin/categories",
    },
    {
      icon: "📥",
      label: "دانلود",
      value: totalDownloads,
      color: "#e11d48",
      bg: "#ffe4e6",
      href: "/admin/downloads",
    },
    {
      icon: "💬",
      label: "کامنت",
      value: totalComments,
      color: "#f97316",
      bg: "#ffedd5",
      href: "/admin/comments",
    },
    {
      icon: "🎯",
      label: "کوییز",
      value: totalQuizzes,
      color: "#7c3aed",
      bg: "#ede9fe",
      href: "/admin/quizzes",
    },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">⚙️ پنل ادمین</h1>
          <p className="page-header__subtitle">مدیریت کامل سایت برگ دانش</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "flex-start",
            }}
            className="admin-layout"
          >
            {/* ─── Sidebar ─── */}
            <AdminSidebar />

            {/* ─── محتوا ─── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* ─── کارت‌های آمار ─── */}
              <div style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    marginBottom: "16px",
                    color: "var(--text)",
                  }}
                >
                  📊 آمار کلی
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {stats.map((stat) => (
                    <Link
                      key={stat.label}
                      href={stat.href}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        padding: "20px 16px",
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: "14px",
                        textDecoration: "none",
                        transition: "all 0.25s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "14px",
                          background: stat.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "26px",
                        }}
                      >
                        {stat.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: 900,
                          color: stat.color,
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                        }}
                      >
                        {stat.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ─── لینک‌های سریع ─── */}
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    marginBottom: "16px",
                    color: "var(--text)",
                  }}
                >
                  🚀 دسترسی سریع
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      href: "/admin/files",
                      icon: "📁",
                      title: "افزودن فایل",
                      desc: "جزوه، کتاب، نمونه سوال",
                      color: "#10b981",
                    },
                    {
                      href: "/admin/articles",
                      icon: "📄",
                      title: "نوشتن مقاله",
                      desc: "مقاله جدید بنویس",
                      color: "#8b5cf6",
                    },
                    {
                      href: "/admin/konkur",
                      icon: "📚",
                      title: "افزودن کنکور",
                      desc: "دفترچه و کلید پاسخ",
                      color: "#f59e0b",
                    },
                    {
                      href: "/admin/categories",
                      icon: "📂",
                      title: "مدیریت دسته‌ها",
                      desc: `${totalCategories} دسته فعال`,
                      color: "#0ea5e9",
                    },
                    {
                      href: "/admin/email",
                      icon: "📧",
                      title: "ارسال ایمیل",
                      desc: "به کاربران سایت",
                      color: "#e11d48",
                    },
                    {
                      href: "/admin/stats",
                      icon: "📊",
                      title: "آمار پیشرفته",
                      desc: "نمودارها و گزارش‌ها",
                      color: "#2563eb",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px",
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: "14px",
                        textDecoration: "none",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "12px",
                          background: `${item.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                            marginBottom: "2px",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .admin-layout a:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
              border-color: #2563eb !important;
            }
            .admin-sidebar a:hover {
              background: #f0f7ff;
              color: #0066cc;
            }
            @media (max-width: 900px) {
              .admin-layout {
                flex-direction: column !important;
              }
            }
          `,
        }}
      />
    </>
  );
}