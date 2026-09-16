import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "700px", textAlign: "center" }}
      >
        <div style={{ marginBottom: "var(--sp-5)" }}>
          <h1
            style={{
              fontSize: "160px",
              fontWeight: 900,
              lineHeight: 1,
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "var(--sp-3)",
            }}
          >
            404
          </h1>
          <div style={{ fontSize: "72px", marginBottom: "var(--sp-4)" }}>📖</div>
        </div>

        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: "var(--sp-3)",
          }}
        >
          این برگ پیدا نشد!
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "var(--text-soft)",
            lineHeight: 2,
            marginBottom: "var(--sp-6)",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
          نگران نباشید — می‌توانید از لینک‌های زیر استفاده کنید.
        </p>

        <div
          style={{
            display: "flex",
            gap: "var(--sp-3)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "var(--sp-7)",
          }}
        >
          <Link href="/" className="btn btn--primary">
            🏠 بازگشت به خانه
          </Link>
          <Link href="/articles" className="btn btn--outline">
            📄 مشاهده مقالات
          </Link>
        </div>

        <div
          style={{
            padding: "var(--sp-5)",
            background: "var(--card)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "var(--sp-4)",
            }}
          >
            🔗 شاید دنبال این‌ها بودید:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "var(--sp-3)",
            }}
          >
            <Link
              href="/university"
              className="btn btn--ghost"
              style={{ border: "1px solid var(--border)" }}
            >
              🎓 دانشگاهی
            </Link>
            <Link
              href="/school"
              className="btn btn--ghost"
              style={{ border: "1px solid var(--border)" }}
            >
              🏫 مدرسه‌ای
            </Link>
            <Link
              href="/exams"
              className="btn btn--ghost"
              style={{ border: "1px solid var(--border)" }}
            >
              📝 نمونه سوال
            </Link>
            <Link
              href="/books"
              className="btn btn--ghost"
              style={{ border: "1px solid var(--border)" }}
            >
              📖 منابع غیر درسی
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}