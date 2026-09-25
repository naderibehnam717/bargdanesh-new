"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string | null;
  author: string | null;
  isPublished: boolean;
  viewCount: number;
  order: number;
  createdAt: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  tags: "",
  author: "",
  isPublished: true,
  order: 0,
};

export default function AdminArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: string; slug: string; title: string; icon: string }[]>([]);
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
      fetchArticles();
      fetchCategories();
    }
  }, [status, session, router]);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/admin/articles", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setArticles(data);
    } catch {
      console.error("خطا در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.filter((c: { isActive: boolean }) => c.isActive));
    } catch {
      console.error("خطا در دریافت دسته‌ها");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "order") {
      setForm({ ...form, order: value === "" ? 0 : parseInt(value) });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleEdit(article: Article) {
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      coverImage: article.coverImage || "",
      category: article.category || "",
      tags: article.tags || "",
      author: article.author || "",
      isPublished: article.isPublished,
      order: article.order,
    });
    setEditingId(article.id);
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

    if (!form.title.trim()) {
      setError("عنوان الزامی است");
      return;
    }

    if (!form.content.trim()) {
      setError("محتوای مقاله الزامی است");
      return;
    }

    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/articles", {
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
        setArticles(articles.map((a) => (a.id === editingId ? data : a)));
      } else {
        setArticles([data, ...articles]);
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

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert("خطا در حذف");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  }

  async function togglePublish(article: Article) {
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, isPublished: !article.isPublished }),
      });

      if (res.ok) {
        setArticles(
          articles.map((a) =>
            a.id === article.id ? { ...a, isPublished: !a.isPublished } : a
          )
        );
      }
    } catch {
      // خطا
    }
  }

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.category?.toLowerCase() || "").includes(q) ||
      (a.tags?.toLowerCase() || "").includes(q)
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
          <h1 className="page-header__title">📄 مدیریت مقالات</h1>
          <p className="page-header__subtitle">{articles.length} مقاله موجود</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
            <button
              onClick={() => {
                if (showForm) handleCancel();
                else setShowForm(true);
              }}
              className="btn btn--primary"
            >
              {showForm ? "✕ بستن فرم" : "➕ افزودن مقاله جدید"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--card)",
                padding: "var(--sp-5)",
                borderRadius: "var(--r-lg)",
                border: editingId ? "2px solid #f59e0b" : "1px solid var(--border)",
                marginBottom: "var(--sp-5)",
                display: "grid",
                gap: "var(--sp-3)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                {editingId ? "✏️ ویرایش مقاله" : "➕ افزودن مقاله جدید"}
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
                <label style={labelStyle}>عنوان مقاله *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="عنوان مقاله"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>خلاصه (اختیاری)</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="خلاصه‌ی کوتاه از مقاله..."
                  rows={2}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>محتوای مقاله * (Markdown پشتیبانی می‌شود)</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="محتوای کامل مقاله..."
                  required
                  rows={12}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.9 }}
                />
              </div>

              <div>
                <label style={labelStyle}>لینک عکس کاور (اختیاری)</label>
                <input
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label style={labelStyle}>دسته‌بندی (اختیاری)</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">— انتخاب دسته —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.icon} {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>نویسنده (اختیاری)</label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="نام نویسنده"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>برچسب‌ها (با کاما جدا کن)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="مثلاً: مطالعه، حافظه، کنکور"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label style={labelStyle}>ترتیب نمایش</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min="0"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    background: "var(--bg-alt)",
                    borderRadius: "var(--r-md)",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    id="isPublished"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="isPublished"
                    style={{ cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
                  >
                    ✅ منتشر شود
                  </label>
                </div>
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
                    : "💾 ذخیره مقاله"}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در عنوان، دسته یا برچسب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                background: "#fff",
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                background: "#fff",
                padding: "60px 20px",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                textAlign: "center",
                color: "#999",
              }}
            >
              📄 هنوز مقاله‌ای اضافه نشده است
            </div>
          ) : (
            <div className="cards-grid">
              {filtered.map((article) => (
                <div
                  key={article.id}
                  style={{
                    background: "#fff",
                    padding: "18px",
                    borderRadius: "12px",
                    border: article.isPublished ? "1px solid #e5e5e5" : "2px dashed #fbbf24",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    opacity: article.isPublished ? 1 : 0.7,
                  }}
                >
                  {article.coverImage && (
                    <div
                      style={{
                        width: "100%",
                        height: "120px",
                        borderRadius: "8px",
                        background: `url(${article.coverImage}) center/cover`,
                        marginBottom: "4px",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {article.category && (
                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "3px 10px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {article.category}
                      </span>
                    )}
                    {!article.isPublished && (
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "3px 10px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        پیش‌نویس
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        margin: 0,
                        lineHeight: 1.7,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.excerpt}
                    </p>
                  )}

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: "8px",
                    }}
                  >
                    {article.author && <span>✍️ {article.author}</span>}
                    <span>👁️ {article.viewCount}</span>
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleEdit(article)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "6px",
                        background: "#fef3c7",
                        color: "#92400e",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      ✏️ ویرایش
                    </button>
                    <button
                      onClick={() => togglePublish(article)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "6px",
                        background: article.isPublished ? "#fef3c7" : "#d1fae5",
                        color: article.isPublished ? "#92400e" : "#065f46",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      {article.isPublished ? "⏸️ لغو" : "▶️ انتشار"}
                    </button>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      🗑️
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