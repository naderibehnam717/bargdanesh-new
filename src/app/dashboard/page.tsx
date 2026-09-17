import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">👋 سلام {session.user.name}</h1>
          <p className="page-header__subtitle">به پنل کاربری برگ دانش خوش آمدی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="features" style={{ marginBottom: "var(--sp-7)" }}>
            <Link
              href="/dashboard/favorites"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">❤️</div>
              <h3 className="feature__title">فایل‌های مورد علاقه</h3>
              <p className="feature__desc">فایل‌هایی که ذخیره کردی</p>
            </Link>

            <Link
              href="/dashboard/downloads"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">📥</div>
              <h3 className="feature__title">تاریخچه دانلود</h3>
              <p className="feature__desc">فایل‌هایی که دانلود کردی</p>
            </Link>

            <Link
              href="/dashboard/profile"
              className="feature"
              style={{ textDecoration: "none" }}
            >
              <div className="feature__icon">👤</div>
              <h3 className="feature__title">پروفایل</h3>
              <p className="feature__desc">ویرایش اطلاعات حساب</p>
            </Link>

            {(session.user as { role?: string }).role === "admin" && (
              <Link
                href="/admin"
                className="feature"
                style={{ textDecoration: "none" }}
              >
                <div className="feature__icon">⚙️</div>
                <h3 className="feature__title">پنل ادمین</h3>
                <p className="feature__desc">مدیریت سایت</p>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}