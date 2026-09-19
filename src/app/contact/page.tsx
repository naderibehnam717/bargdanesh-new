"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status !== "idle") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "خطا در ارسال پیام");
      }
    } catch {
      setStatus("error");
      setErrorMessage("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📬 تماس با ما</h1>
          <p className="page-header__subtitle">
            خوشحال می‌شویم صدای شما را بشنویم
          </p>
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
              <div className="feature__icon">📍</div>
              <h3 className="feature__title">آدرس</h3>
              <p className="feature__desc">کرمانشاه ، ایران</p>
            </div>

            <div className="feature">
              <div className="feature__icon">⏰</div>
              <h3 className="feature__title">ساعات پاسخگویی</h3>
              <p className="feature__desc">
                همه روز هفته
                <br />
                9 صبح تا 10 شب
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

            {/* ─────── پیام موفقیت ─────── */}
            {status === "success" && (
              <div
                style={{
                  background: "#d1fae5",
                  color: "#065f46",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: 600,
                  border: "1px solid #6ee7b7",
                }}
              >
                ✅ پیام شما با موفقیت ارسال شد!
                <br />
                <span style={{ fontSize: "13px", fontWeight: 400 }}>
                  به‌زودی پاسخ می‌دهیم.
                </span>
              </div>
            )}

            {/* ─────── پیام خطا ─────── */}
            {status === "error" && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: 600,
                  border: "1px solid #fca5a5",
                }}
              >
                ❌ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "var(--sp-4)" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="نام خود را وارد کنید"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px",
                    background: "var(--bg)",
                    color: "var(--text)",
                    outline: "none",
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--sp-4)" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px",
                    background: "var(--bg)",
                    color: "var(--text)",
                    outline: "none",
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--sp-5)" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  پیام
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="پیام خود را بنویسید..."
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.6 : 1,
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary"
                style={{
                  width: "100%",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "⏳ در حال ارسال..." : "📤 ارسال پیام"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}