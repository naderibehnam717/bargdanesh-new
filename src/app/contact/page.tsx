export default function ContactPage() {
  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📬 تماس با ما</h1>
          <p className="page-header__subtitle">خوشحال می‌شویم صدای شما را بشنویم</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--sp-5)",
              marginBottom: "var(--sp-7)",
            }}
          >
            <div className="feature">
              <div className="feature__icon">📧</div>
              <h3 className="feature__title">ایمیل</h3>
              <p className="feature__desc">info@bargdanesh.ir</p>
            </div>
            <div className="feature">
              <div className="feature__icon">📱</div>
              <h3 className="feature__title">تلفن</h3>
              <p className="feature__desc">۰۹۱۲۳۴۵۶۷۸۹</p>
            </div>
            <div className="feature">
              <div className="feature__icon">📍</div>
              <h3 className="feature__title">آدرس</h3>
              <p className="feature__desc">تهران، ایران</p>
            </div>
            <div className="feature">
              <div className="feature__icon">⏰</div>
              <h3 className="feature__title">ساعات پاسخگویی</h3>
              <p className="feature__desc">
                شنبه تا پنجشنبه
                <br />
                ۹ صبح تا ۶ عصر
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--card)",
              padding: "var(--sp-6)",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--sp-3)",
                textAlign: "center",
              }}
            >
              ✉️ پیام خود را بفرستید
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-soft)",
                textAlign: "center",
                marginBottom: "var(--sp-5)",
              }}
            >
              هر سوال، پیشنهاد یا انتقادی دارید — بنویسید برایمان.
            </p>

            <form action="#" method="post">
              <div style={{ marginBottom: "var(--sp-4)" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "var(--sp-2)" }}>
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="نام خود را وارد کنید"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px",
                    background: "var(--bg)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--sp-4)" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "var(--sp-2)" }}>
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px",
                    background: "var(--bg)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--sp-5)" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "var(--sp-2)" }}>
                  پیام
                </label>
                <textarea
                  name="message"
                  placeholder="پیام خود را بنویسید..."
                  required
                  style={{
                    width: "100%",
                    minHeight: "140px",
                    padding: "12px 16px",
                    border: "1px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px",
                    background: "var(--bg)",
                    color: "var(--text)",
                    resize: "vertical",
                    outline: "none",
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%" }}
              >
                📤 ارسال پیام
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}