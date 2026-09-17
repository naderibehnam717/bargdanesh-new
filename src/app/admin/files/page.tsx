"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FileData {
  id: string;
  title: string;
  desc: string;
  category: string;
  type: string;
  level: string;
  author?: string;
  viewUrl?: string;
  downloadUrl?: string;
  downloadName?: string;
  color?: string;
  createdAt?: string;
}

const emptyForm: Omit<FileData, "id" | "createdAt"> = {
  title: "",
  desc: "",
  category: "",
  type: "جزوه",
  level: "دانشگاهی",
  author: "",
  viewUrl: "",
  downloadUrl: "",
  downloadName: "",
  color: "blue",
};

export default function AdminFilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
      fetchFiles();
    }
  }, [status, session, router]);

  async function fetchFiles() {
    try {
      const res = await fetch("/api/admin/files");
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setFiles(data);
    } catch {
      console.error("خطا در دریافت فایل‌ها");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admin/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newFile = await res.json();
      setFiles([newFile, ...files]);
      setForm(emptyForm);
      setShowForm(false);
    } else {
      alert("خطا در ذخیره فایل");
    }
    setSaving(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`آیا مطمئنی می‌خوای «${title}» رو حذف کنی؟`)) return;

    const res = await fetch(`/api/admin/files?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setFiles(files.filter((f) => f.id !== id));
    } else {
      alert("خطا در حذف");
    }
  }

  const filtered = files.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  if (loading) {
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

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📁 مدیریت فایل‌ها</h1>
          <p className="page-header__subtitle">{files.length} فایل موجود</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "var(--sp-3)",
              marginBottom: "var(--sp-5)",
              flexWrap: "wrap",
            }}
          >
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn--primary"
            >
              {showForm ? "✕ بستن فرم" : "➕ افزودن فایل جدید"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--card)",
                padding: "var(--sp-5)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                marginBottom: "var(--sp-5)",
                display: "grid",
                gap: "var(--sp-3)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                ➕ افزودن فایل جدید
              </h3>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="عنوان فایل *"
                required
                style={inputStyle}
              />
              <textarea
                name="desc"
                value={form.desc}
                onChange={handleChange}
                placeholder="توضیح کوتاه *"
                required
                rows={3}
                style={inputStyle}
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="دسته‌بندی (مثل: فیزیک، روانشناسی) *"
                required
                style={inputStyle}
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="جزوه">جزوه</option>
                <option value="کتاب">کتاب</option>
                <option value="نمونه سوال">نمونه سوال</option>
                <option value="منابع غیر درسی">منابع غیر درسی</option>
                <option value="منابع استخدامی">منابع استخدامی</option>
              </select>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="دانشگاهی">دانشگاهی</option>
                <option value="مدرسه ای">مدرسه ای</option>
                <option value="غیر درسی">غیر درسی</option>
                <option value="استخدامی">استخدامی</option>
              </select>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="نویسنده (اختیاری)"
                style={inputStyle}
              />
              <input
                name="viewUrl"
                value={form.viewUrl}
                onChange={handleChange}
                placeholder="لینک مشاهده (Google Drive)"
                style={inputStyle}
              />
              <input
                name="downloadUrl"
                value={form.downloadUrl}
                onChange={handleChange}
                placeholder="لینک دانلود"
                style={inputStyle}
              />
              <input
                name="downloadName"
                value={form.downloadName}
                onChange={handleChange}
                placeholder="اسم فایل دانلود (انگلیسی)"
                style={inputStyle}
              />
              <select
                name="color"
                value={form.color}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="blue">آبی</option>
                <option value="green">سبز</option>
                <option value="purple">بنفش</option>
                <option value="rose">قرمز</option>
                <option value="yellow">زرد</option>
                <option value="orange">نارنجی</option>
              </select>

              <button
                type="submit"
                disabled={saving}
                className="btn btn--primary"
                style={{ width: "100%" }}
              >
                {saving ? "در حال ذخیره..." : "💾 ذخیره فایل"}
              </button>
            </form>
          )}

          <div className="search-box" style={{ marginBottom: "var(--sp-5)" }}>
            <input
              type="text"
              className="search-box__input"
              placeholder="جستجوی عنوان یا دسته‌بندی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                background: "var(--card)",
                padding: "60px 20px",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              📁 هنوز فایلی اضافه نشده است
            </div>
          ) : (
            <div className="cards-grid">
              {filtered.map((file) => (
                <div
                  key={file.id}
                  style={{
                    background: "var(--card)",
                    padding: "var(--sp-4)",
                    borderRadius: "var(--r-lg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--sp-2)",
                  }}
                >
                  <span
                    className={`content-card__badge content-card__badge--${file.color || "blue"}`}
                  >
                    {file.category}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{file.title}</h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-soft)",
                      flexGrow: 1,
                    }}
                  >
                    {file.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--sp-2)",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "var(--sp-2)",
                    }}
                  >
                    <span>📎 {file.type}</span>
                    <span>🎯 {file.level}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id, file.title)}
                    style={{
                      padding: "8px",
                      borderRadius: "var(--r-md)",
                      background: "var(--rose-light)",
                      color: "var(--rose)",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    🗑️ حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}