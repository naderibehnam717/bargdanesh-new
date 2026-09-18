import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه یافت نشد | برگ دانش",
  description: "صفحه‌ای که دنبالش هستید پیدا نشد",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* عدد 404 */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
          }}
        >
          404
        </div>

        {/* ایموجی */}
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>

        {/* عنوان */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "12px",
          }}
        >
          صفحه‌ای که دنبالش بودید پیدا نشد!
        </h1>

        {/* توضیح */}
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: 1.9,
            marginBottom: "32px",
          }}
        >
          احتمالاً آدرس اشتباه تایپ شده یا این صفحه حذف شده است. نگران نباشید —
          می‌توانید از لینک‌های زیر استفاده کنید یا به صفحه‌ی اصلی برگردید.
        </p>

        {/* دکمه‌ها */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <Link
            href="/"
            className="btn btn--primary"
            style={{ padding: "12px 24px", fontSize: "15px" }}
          >
            🏠 صفحه اصلی
          </Link>
          <Link
            href="/university"
            className="btn btn--outline"
            style={{ padding: "12px 24px", fontSize: "15px" }}
          >
            🎓 جزوه‌های دانشگاهی
          </Link>
        </div>

        {/* لینک‌های مفید */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "right",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            📎 لینک‌های مفید
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <Link
              href="/university"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              🎓 دانشگاهی
            </Link>
            <Link
              href="/school"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              🏫 مدرسه‌ای
            </Link>
            <Link
              href="/exams"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              📝 نمونه سوال
            </Link>
            <Link
              href="/books"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              📖 منابع غیر درسی
            </Link>
            <Link
              href="/articles"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              📄 مقالات
            </Link>
            <Link
              href="/employment"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background 0.2s",
                fontSize: "14px",
              }}
            >
              💼 استخدامی
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}