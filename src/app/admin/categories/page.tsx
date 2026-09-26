"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  title: string;
  icon: string;
  color: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const ICONS = [
  // عمومی
  "📁", "📚", "📖", "📄", "📝", "✏️", "📌",
  // آموزشی
  "🎓", "🏫", "🎯", "🧑‍🏫", "📐", "🔬", "🧪", "⚛️",
  // تخصصی
  "💻", "🧠", "👥", "📿", "🎨", "🌍", "🕌",
  // موضوعی
  "🏛️", "🗺️", "⚽", "🎬", "🎭", "🌱", "🌟",
  "🎵", "📷", "🏆", "🚀", "💰", "⚖️", "🩺",
  "💊", "🔧", "🏗️", "🌾", "🐾", "🍎", "☕",
  // نمادها
  "❤️", "💡", "🔥", "✨", "🌈", "☀️", "🌙", "⭐",
];

const COLORS = [
  { value: "blue", label: "آبی" },
  { value: "green", label: "سبز" },
  { value: "purple", label: "بنفش" },
  { value: "rose", label: "قرمز" },
  { value: "yellow", label: "زرد" },
  { value: "orange", label: "نارنجی" },
  { value: "pink", label: "صورتی" },
  { value: "black", label: "مشکی" },
];

const emptyForm = {
  title: "",
  slug: "",
  icon: "📁",
  color: "blue",
  description: "",
  order: 0,
};

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
      fetchCategories();
    }
  }, [status, session, router]);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error("خطا در دریافت دسته‌ها");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "order") {
      setForm({ ...form, order: value === "" ? 0 : parseInt(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleEdit(cat: Category) {
    setForm({
      title: cat.title,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      description: cat.description || "",
      order: cat.order,
    });
    setEditingId(cat.id);
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

    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/categories", {
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
        setCategories(categories.map((c) => (c.id === editingId ? data : c)));
      } else {
        setCategories([...categories, data]);
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
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("خطا در حذف");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  }

  async function toggleActive(cat: Category) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
      });

      if (res.ok) {
        setCategories(
          categories.map((c) =>
            c.id === cat.id ? { ...c, isActive: !c.isActive } : c
          )
        );
      }
    } catch {
      // خطا
    }
  }

  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
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
          <h1 className="page-header__title">📂 مدیریت دسته‌بندی‌ها</h1>
          <p className="page-header__subtitle">
            {categories.length} دسته‌بندی موجود
          </p>
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
              {showForm ? "✕ بستن فرم" : "➕ افزودن دسته جدید"}
            </button>
          </div>

          {/* ─── فرم ─── */}
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
                {editingId ? "✏️ ویرایش دسته" : "➕ افزودن دسته جدید"}
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
                <label style={labelStyle}>عنوان دسته *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="مثلاً: ریاضی، روانشناسی"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  نامک (slug) — اختیاری، خودکار ساخته می‌شه
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="مثلاً: math, psychology"
                  style={inputStyle}
                />
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                  این آدرس صفحه‌ست: /subject/{form.slug || "auto"}
                </div>
              </div>

              <div>
                <label style={labelStyle}>آیکون</label>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    padding: "8px",
                    background: "var(--bg-alt)",
                    borderRadius: "10px",
                  }}
                >
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({ ...form, icon })}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background:
                          form.icon === icon ? "var(--primary)" : "#fff",
                        border:
                          form.icon === icon
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        cursor: "pointer",
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>رنگ</label>
                <select
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {COLORS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>توضیحات (اختیاری)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="توضیح کوتاه درباره‌ی این دسته..."
                  rows={3}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  ترتیب نمایش (عدد کوچک‌تر = بالاتر)
                </label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min="0"
                  style={inputStyle}
                />
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
                    : "💾 ذخیره دسته"}
                </button>
              </div>
            </form>
          )}

          {/* ─── جستجو ─── */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در دسته‌ها..."
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

          {/* ─── لیست ─── */}
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
              📂 هنوز دسته‌ای اضافه نشده است
            </div>
          ) : (
            <div className="cards-grid">
              {filtered.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    background: "#fff",
                    padding: "18px",
                    borderRadius: "12px",
                    border: cat.isActive
                      ? "1px solid #e5e5e5"
                      : "2px dashed #fbbf24",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    opacity: cat.isActive ? 1 : 0.7,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--primary-soft)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        flexShrink: 0,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      {!cat.isActive && (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            padding: "3px 8px",
                            borderRadius: "100px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          غیرفعال
                        </span>
                      )}
                      <span
                        style={{
                          background: "#f0f7ff",
                          color: "#0066cc",
                          padding: "3px 8px",
                          borderRadius: "100px",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        #{cat.order}
                      </span>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    {cat.title}
                  </h3>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      direction: "ltr",
                      textAlign: "left",
                      fontFamily: "monospace",
                    }}
                  >
                    /subject/{cat.slug}
                  </div>

                  {cat.description && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        margin: 0,
                        lineHeight: 1.7,
                      }}
                    >
                      {cat.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      paddingTop: "10px",
                      borderTop: "1px solid #f0f0f0",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(cat)}
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
                      onClick={() => toggleActive(cat)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "6px",
                        background: cat.isActive ? "#fef3c7" : "#d1fae5",
                        color: cat.isActive ? "#92400e" : "#065f46",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      {cat.isActive ? "⏸️ غیرفعال" : "▶️ فعال"}
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.title)}
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