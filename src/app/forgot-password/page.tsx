"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "خطایی رخ داد");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid var(--border-dark)",
    borderRadius: "var(--r-md)",
    fontSize: "14px",
    background: "var(--bg)",
    color: "var(--text)",
    outline: "none",
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "480px" }}>
        <div
          style={{
            background: "var(--card)",
            padding: "var(--sp-6)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: "var(--sp-2)",
              textAlign: "center",
            }}
          >
            🔑 فراموشی رمز عبور
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-soft)",
              textAlign: "center",
              marginBottom: "var(--sp-6)",
            }}
          >
            ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
          </p>

          {message && (
            <div
              style={{
                background: "var(--success-light)",
                color: "#047857",
                padding: "var(--sp-3)",
                borderRadius: "var(--r-md)",
                fontSize: "14px",
                marginBottom: "var(--sp-4)",
                textAlign: "center",
                lineHeight: 1.8,
              }}
            >
              ✅ {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "var(--rose-light)",
                color: "var(--rose)",
                padding: "var(--sp-3)",
                borderRadius: "var(--r-md)",
                fontSize: "14px",
                marginBottom: "var(--sp-4)",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "var(--sp-5)" }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{ width: "100%", marginBottom: "var(--sp-4)" }}
            >
              {loading ? "در حال ارسال..." : "📤 ارسال لینک بازیابی"}
            </button>
          </form>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-soft)",
              textAlign: "center",
            }}
          >
            رمزت رو یاد آوردی؟{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
              بازگشت به ورود
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}