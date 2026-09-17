"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Settings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  telegram: string;
  instagram: string;
  twitter: string;
  youtube: string;
  footerText: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (
      status === "authenticated" &&
      (session?.user as { role?: string })?.role !== "admin"
    ) {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, session, router]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setSettings(data);
    } catch {
      console.error("خطا");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!settings) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("خطا در ذخیره");
    }
    setSaving(false);
  }

  if (loading || !settings) {
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
    padding: "10px 14px",
    border: "1px solid var(--border-dark)",
    borderRadius: "var(--r-md)",
    fontSize: "14px",
    background: "var(--bg)",
    color: "var(--text)",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "var(--sp-2)",
    color: "var(--text)",
  };

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">🔧 تنظیمات سایت</h1>
          <p className="page-header__subtitle">پیکربندی کلی برگ دانش</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ marginBottom: "var(--sp-5)" }}>
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
          </div>

          {saved && (
            <div
              style={{
                background: "var(--success-light)",
                color: "#047857",
                padding: "var(--sp-3)",
                borderRadius: "var(--r-md)",
                marginBottom: "var(--sp-5)",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              ✅ تنظیمات با موفقیت ذخیره شد
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
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
              📌 اطلاعات اصلی
            </h3>

            <div>
              <label style={labelStyle}>نام سایت</label>
              <input
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>توضیح سایت</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={2}
                style={inputStyle}
              />
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 700, marginTop: "var(--sp-3)" }}>
              📞 اطلاعات تماس
            </h3>

            <div>
              <label style={labelStyle}>ایمیل</label>
              <input
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>تلفن</label>
              <input
                name="sitePhone"
                value={settings.sitePhone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 700, marginTop: "var(--sp-3)" }}>
              🌐 شبکه‌های اجتماعی
            </h3>

            <div>
              <label style={labelStyle}>تلگرام</label>
              <input
                name="telegram"
                value={settings.telegram}
                onChange={handleChange}
                placeholder="https://t.me/..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>اینستاگرام</label>
              <input
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>توییتر</label>
              <input
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>یوتیوب</label>
              <input
                name="youtube"
                value={settings.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                style={inputStyle}
              />
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 700, marginTop: "var(--sp-3)" }}>
              📝 فوتر
            </h3>

            <div>
              <label style={labelStyle}>متن کپی‌رایت</label>
              <input
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-3)",
                padding: "var(--sp-4)",
                background: "var(--bg-alt)",
                borderRadius: "var(--r-md)",
                marginTop: "var(--sp-3)",
              }}
            >
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                id="maintenance"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
              <label
                htmlFor="maintenance"
                style={{ cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
              >
                🚧 حالت تعمیر (سایت موقتاً غیرفعال می‌شود)
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn--primary"
              style={{ width: "100%", marginTop: "var(--sp-3)" }}
            >
              {saving ? "در حال ذخیره..." : "💾 ذخیره تنظیمات"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}