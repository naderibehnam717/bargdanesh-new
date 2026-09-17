"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
      } else {
        setMessage("پروفایل با موفقیت به‌روزرسانی شد");
        await update({ name });
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="section">
        <div className="container" style={{ textAlign: "center", padding: "60px" }}>
          در حال بارگذاری...
        </div>
      </main>
    );
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
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">👤 پروفایل</h1>
          <p className="page-header__subtitle">ویرایش اطلاعات حساب کاربری</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ marginBottom: "var(--sp-5)" }}>
            <Link href="/dashboard" className="btn btn--ghost">
              ← بازگشت به پنل کاربری
            </Link>
          </div>

          {message && (
            <div
              style={{
                background: "var(--success-light)",
                color: "#047857",
                padding: "var(--sp-3)",
                borderRadius: "var(--r-md)",
                marginBottom: "var(--sp-4)",
                textAlign: "center",
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
                marginBottom: "var(--sp-4)",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--card)",
              padding: "var(--sp-6)",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              display: "grid",
              gap: "var(--sp-4)",
            }}
          >
            <div>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید"
                style={inputStyle}
              />
            </div>

            <div>
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
                disabled
                style={{
                  ...inputStyle,
                  opacity: 0.6,
                  cursor: "not-allowed",
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "var(--sp-2)",
                }}
              >
                ایمیل قابل تغییر نیست
              </p>
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}