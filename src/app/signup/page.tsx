"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

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
            📝 ثبت‌نام
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-soft)",
              textAlign: "center",
              marginBottom: "var(--sp-6)",
            }}
          >
            به برگ دانش خوش آمدید
          </p>

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
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "var(--sp-2)",
                }}
              >
                رمز عبور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="حداقل ۶ کاراکتر"
                required
                minLength={6}
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

            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{ width: "100%", marginBottom: "var(--sp-3)" }}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sp-3)",
              margin: "var(--sp-4) 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>یا</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn--outline"
            style={{ width: "100%", marginBottom: "var(--sp-4)" }}
          >
            🔵 ورود با گوگل
          </button>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-soft)",
              textAlign: "center",
            }}
          >
            قبلاً ثبت‌نام کردی؟{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
              وارد شو
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}