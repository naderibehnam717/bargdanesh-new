"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FileData {
  id: string;
  slug: string;
  title: string;
  desc: string;
  category: string;
  type: string;
  level: string;
  author?: string | null;
  viewUrl?: string | null;
  downloadUrl?: string | null;
  downloadName?: string | null;
  color?: string | null;
  createdAt?: string;
}

interface CategoryOption {
  id: string;
  slug: string;
  title: string;
  icon: string;
}

const emptyForm = {
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
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      fetchCategories();
    }
  }, [status, session, router]);

  async function fetchFiles() {
    try {
      const res = await fetch("/api/admin/files", { cache: "no-store" });
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setFiles(data);
    } catch {
      console.error("خطا در دریافت فایل‌ها");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      // فقط دسته‌های فعال
      setCategories(data.filter((c: CategoryOption & { isActive: boolean }) => c.isActive));
    } catch {
      console.error("خطا در دریافت دسته‌ها");
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEdit(file: FileData) {
    setForm({
      title: file.title,
      desc: file.desc,
      category: file.category,
      type: file.type,
      level: file.level,
      author: file.author || "",
      viewUrl: file.viewUrl || "",
      downloadUrl: file.downloadUrl || "",
      downloadName: file.downloadName || "",
      color: file.color || "blue",
    });
    setEditingId(file.id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/files", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ذخیره");
        return;
      }

      if (editingId) {
        setFiles(files.map((f) => (f.id === editingId ? data : f)));
      } else {
        setFiles([data, ...files]);
      }

      handleCancel();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
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
      f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <main className="section">
        <div
          className="container"
          style={{ textAlign: "center", padding: "60px" }}
        >
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
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "6px",
    color: "var(--text)",
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
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }
              }}
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
                border: editingId
                  ? "2px solid #f59e0b"
                  : "1px solid var(--border)",
                marginBottom: "var(--sp-5)",
                display: "grid",
                gap: "var(--sp-3)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                {editingId ? "✏️ ویرایش فایل" : "➕ افزودن فایل جدید"}
              </h3>

              {error && (
                <div
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    border: "1px solid #fca5a5",
                  }}
                >
                  ❌ {error}
                </div>
              )}

              <div>
                <label style={labelStyle}>عنوان *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="عنوان فایل"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>توضیح *</label>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="توضیح کوتاه"
                  required
                  rows={3}
                  style={inputStyle}
                />
              </div>

              {/* ─── دسته‌بندی: dropdown از دیتابیس ─── */}
              <div>
                <label style={labelStyle}>دسته‌بندی *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">— انتخاب دسته —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.icon} {cat.title}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "4px",
                  }}
                >
                  💡 برای دسته‌ی جدید، برو به{" "}
                  <Link
                    href="/admin/categories"
                    style={{ color: "#0066cc", textDecoration: "underline" }}
                  >
                    مدیریت دسته‌بندی‌ها
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label style={labelStyle}>نوع *</label>
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
                </div>

                <div>
                  <label style={labelStyle}>مقطع *</label>
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
                </div>
              </div>

              <div>
                <label style={labelStyle}>نویسنده (اختیاری)</label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="نویسنده"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>لینک مشاهده (Google Drive)</label>
                <input
                  name="viewUrl"
                  value={form.viewUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/.../view"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>لینک دانلود</label>
                <input
                  name="downloadUrl"
                  value={form.downloadUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/uc?export=download&id=..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>اسم فایل دانلود (انگلیسی)</label>
                <input
                  name="downloadName"
                  value={form.downloadName}
                  onChange={handleChange}
                  placeholder="file-name.pdf"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>رنگ</label>
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
                  <option value="pink">صورتی</option>
                  <option value="black">مشکی</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn--ghost"
                    style={{ flex: 1 }}
                  >
                    لغو
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn--primary"
                  style={{ flex: 2 }}
                >
                  {saving
                    ? "در حال ذخیره..."
                    : editingId
                    ? "💾 ذخیره تغییرات"
                    : "💾 ذخیره فایل"}
                </button>
              </div>
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
                    className={`content-card__badge content-card__badge--${
                      file.color || "blue"
                    }`}
                  >
                    {file.category}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
                    {file.title}
                  </h3>
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

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(file)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "var(--r-md)",
                        background: "#fef3c7",
                        color: "#92400e",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      ✏️ ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(file.id, file.title)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "var(--r-md)",
                        background: "var(--rose-light)",
                        color: "var(--rose)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}