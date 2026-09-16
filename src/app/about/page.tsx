export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">✨ درباره ما</h1>
          <p className="page-header__subtitle">با برگ دانش بیشتر آشنا شوید</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--sp-8)" }}>
            <div style={{ marginBottom: "var(--sp-4)", display: "inline-flex" }}>
              <span
                className="logo__icon"
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "20px",
                  fontSize: "44px",
                }}
              >
                📚
              </span>
            </div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--primary-dark)",
                marginBottom: "var(--sp-3)",
              }}
            >
              برگ دانش
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-soft)", lineHeight: 2 }}>
              <strong
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                دانش، یک برگ فاصله دارد.
              </strong>
            </p>
          </div>

          <div
            style={{
              background: "var(--card)",
              padding: "var(--sp-6)",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              marginBottom: "var(--sp-6)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--sp-3)",
              }}
            >
              📖 داستان ما
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-soft)",
                lineHeight: 2,
                marginBottom: "var(--sp-3)",
              }}
            >
              <strong>برگ دانش</strong> با هدف ساده‌ای شروع شد: دسترسی آسان دانشجویان
              به منابع آموزشی باکیفیت. ما باور داریم که دانش نباید پشت دیوارهای پیچیده
              و هزینه‌های سنگین پنهان بماند.
            </p>
            <p style={{ fontSize: "15px", color: "var(--text-soft)", lineHeight: 2 }}>
              از یک ایده کوچک تا امروز، هزاران دانشجو از منابع ما استفاده کرده‌اند و
              این مسیر همچنان ادامه دارد.
            </p>
          </div>

          <div
            style={{
              background: "var(--primary-soft)",
              padding: "var(--sp-6)",
              borderRadius: "var(--r-lg)",
              borderRight: "4px solid var(--primary)",
              marginBottom: "var(--sp-6)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--primary-dark)",
                marginBottom: "var(--sp-3)",
              }}
            >
              🎯 ماموریت ما
            </h3>
            <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 2 }}>
              دسترسی <strong>رایگان</strong> و <strong>آسان</strong> تمام دانشجویان
              ایرانی به منابع آموزشی باکیفیت — بدون تبلیغات مزاحم، بدون هزینه، بدون
              محدودیت.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}