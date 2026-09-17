import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as { role?: string }).role !== "admin") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();
  const totalFavorites = await prisma.favorite.count();
  const totalDownloads = await prisma.download.count();

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">⚙️ پنل ادمین</h1>
          <p className="page-header__subtitle">
            مدیریت کامل سایت برگ دانش
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="stats-box" style={{ marginBottom: "var(--sp-7)" }}>
            <div className="stat-item">
              <div className="stat-item__number">{totalUsers}</div>
              <div className="stat-item__label">👥 کاربر</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__number">{totalFavorites}</div>
              <div className="stat-item__label">❤️ علاقه‌مندی</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__number">{totalDownloads}</div>
              <div className="stat-item__label">📥 دانلود</div>
            </div>
          </div>

          <div className="features">
            <Link
              href="/admin/users"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">👥</div>
              <h3 className="feature__title">مدیریت کاربران</h3>
              <p className="feature__desc">
                مشاهده، ویرایش و حذف کاربران
              </p>
            </Link>

            <Link
              href="/admin/files"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📁</div>
              <h3 className="feature__title">مدیریت فایل‌ها</h3>
              <p className="feature__desc">
                اضافه، ویرایش و حذف فایل‌ها
              </p>
            </Link>

            <Link
              href="/admin/comments"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">💬</div>
              <h3 className="feature__title">مدیریت کامنت‌ها</h3>
              <p className="feature__desc">
                تأیید یا حذف کامنت‌ها
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">🔧</div>
              <h3 className="feature__title">تنظیمات سایت</h3>
              <p className="feature__desc">
                پیکربندی کلی سایت
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}