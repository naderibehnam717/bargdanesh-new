"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email") || "";
    const t = searchParams.get("token") || "";
    setEmail(e);
    setToken(t);

    if (!e || !t) {
      setError("لینک بازیابی نامعتبر است");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("خطا در ارتباط با سرور");
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

  if (success) {
    return (
      <div
        style={{
          background: "var(--card)",
          padding: "var(--sp-6)",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "var(--sp-4)" }}>✅</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--success)",
            marginBottom: "var(--sp-3)",
          }}
        >
          رمز عبور تغییر کرد!
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-soft)",
            marginBottom: "var(--sp-5)",
            lineHeight: 2,
          }}
        >
          رمز عبور شما با موفقیت تغییر کرد.
          <br />
          در حال انتقال به صفحه‌ی ورود...
        </p>
        <Link href="/login" className="btn btn--primary">
          🔐 ورود به حساب
        </Link>
      </div>
    );
  }

  return (
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
        🔓 تنظیم رمز جدید
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-soft)",
          textAlign: "center",
          marginBottom: "var(--sp-6)",
        }}
      >
        رمز عبور جدید خود را وارد کنید
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

      {!error && email && (
        <div
          style={{
            background: "var(--primary-soft)",
            color: "var(--primary-dark)",
            padding: "var(--sp-3)",
            borderRadius: "var(--r-md)",
            fontSize: "13px",
            marginBottom: "var(--sp-4)",
            textAlign: "center",
          }}
        >
          📧 حساب: <strong>{email}</strong>
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
            رمز عبور جدید
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="حداقل ۶ کاراکتر"
            required
            minLength={6}
            style={inputStyle}
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
            تکرار رمز عبور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="رمز عبور را دوباره وارد کنید"
            required
            minLength={6}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading || !email || !token}
          style={{ width: "100%", marginBottom: "var(--sp-4)" }}
        >
          {loading ? "در حال ذخیره..." : "💾 تغییر رمز عبور"}
        </button>
      </form>

      <p
        style={{
          fontSize: "14px",
          color: "var(--text-soft)",
          textAlign: "center",
        }}
      >
        <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          بازگشت به ورود
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "480px" }}>
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "60px" }}>
              در حال بارگذاری...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}