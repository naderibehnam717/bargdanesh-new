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
  const totalComments = await prisma.comment.count();
  const totalFiles = await prisma.file.count();
  const totalQuizzes = await prisma.quiz.count();
  const totalLogs = await prisma.activityLog.count();
  const totalKonkur = await prisma.konkur.count();
  const totalCategories = await prisma.category.count();
  const totalArticles = await prisma.article.count();

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
          {/* آمار سریع */}
          <div className="stats-box" style={{ marginBottom: "var(--sp-7)" }}>
            <div className="stat-item">
              <div className="stat-item__number">{totalUsers}</div>
              <div className="stat-item__label">👥 کاربر</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__number">{totalFiles}</div>
              <div className="stat-item__label">📁 فایل</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__number">{totalDownloads}</div>
              <div className="stat-item__label">📥 دانلود</div>
            </div>
            <div className="stat-item">
              <div className="stat-item__number">{totalComments}</div>
              <div className="stat-item__label">💬 کامنت</div>
            </div>
          </div>

          {/* لینک‌ها */}
          <div className="features">
            <Link
              href="/admin/stats"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📊</div>
              <h3 className="feature__title">آمار پیشرفته</h3>
              <p className="feature__desc">نمودارها و گزارش‌های کامل</p>
            </Link>

            <Link
              href="/admin/users"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">👥</div>
              <h3 className="feature__title">مدیریت کاربران</h3>
              <p className="feature__desc">مشاهده، ویرایش و حذف کاربران</p>
            </Link>

            <Link
              href="/admin/files"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📁</div>
              <h3 className="feature__title">مدیریت فایل‌ها</h3>
              <p className="feature__desc">اضافه، ویرایش و حذف فایل‌ها</p>
            </Link>

            <Link
              href="/admin/categories"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📂</div>
              <h3 className="feature__title">مدیریت دسته‌بندی‌ها</h3>
              <p className="feature__desc">
                {totalCategories} دسته‌بندی فعال
              </p>
            </Link>

            <Link
              href="/admin/articles"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📄</div>
              <h3 className="feature__title">مدیریت مقالات</h3>
              <p className="feature__desc">
                {totalArticles} مقاله
              </p>
            </Link>

            <Link
              href="/admin/konkur"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📚</div>
              <h3 className="feature__title">آرشیو کنکور</h3>
              <p className="feature__desc">
                مدیریت آزمون‌های کنکور ({totalKonkur})
              </p>
            </Link>

            <Link
              href="/admin/downloads"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📥</div>
              <h3 className="feature__title">تاریخچه دانلود</h3>
              <p className="feature__desc">
                گزارش دانلودها ({totalDownloads})
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
                تأیید یا حذف کامنت‌ها ({totalComments})
              </p>
            </Link>

            <Link
              href="/admin/quizzes"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">🎯</div>
              <h3 className="feature__title">مدیریت کوییزها</h3>
              <p className="feature__desc">
                افزودن و حذف سوالات ({totalQuizzes})
              </p>
            </Link>

            <Link
              href="/admin/email"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📧</div>
              <h3 className="feature__title">ایمیل گروهی</h3>
              <p className="feature__desc">ارسال ایمیل به کاربران</p>
            </Link>

            <Link
              href="/admin/logs"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📜</div>
              <h3 className="feature__title">لاگ فعالیت‌ها</h3>
              <p className="feature__desc">
                تاریخچه‌ی کامل ({totalLogs})
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">🔧</div>
              <h3 className="feature__title">تنظیمات سایت</h3>
              <p className="feature__desc">پیکربندی کلی سایت</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}