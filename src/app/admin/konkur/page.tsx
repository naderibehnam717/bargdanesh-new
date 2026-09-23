"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Konkur {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  year: number;
  field: string;
  description: string | null;
  questionUrl: string | null;
  answerUrl: string | null;
  createdAt: string;
}

const FIELDS = [
  "ریاضی و فنی",
  "علوم تجربی",
  "علوم انسانی",
  "هنر",
  "زبان‌های خارجی",
];

const YEARS = [1405, 1404, 1403, 1402, 1401, 1400];

const emptyForm = {
  title: "",
  subtitle: "",
  year: 1404,
  field: "",
  description: "",
  questionUrl: "",
  answerUrl: "",
};

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default function AdminKonkurPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [konkurList, setKonkurList] = useState<Konkur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
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
      fetchKonkur();
    }
  }, [status, session, router]);

  async function fetchKonkur() {
    try {
      const res = await fetch("/api/admin/konkur", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setKonkurList(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "year" ? parseInt(value) : value,
    });
  }

  function handleEdit(item: Konkur) {
    setForm({
      title: item.title,
      subtitle: item.subtitle || "",
      year: item.year,
      field: item.field,
      description: item.description || "",
      questionUrl: item.questionUrl || "",
      answerUrl: item.answerUrl || "",
    });
    setEditingId(item.id);
    setShowForm(true);
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

    if (!form.title.trim() || !form.field) {
      setError("عنوان و رشته الزامی هستند");
      return;
    }

    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/konkur", {
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
        // ویرایش
        setKonkurList(
          konkurList.map((k) => (k.id === editingId ? data : k))
        );
      } else {
        // جدید
        setKonkurList([data, ...konkurList]);
      }

      handleCancel();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (
      !confirm(
        `آیا مطمئنی می‌خوای «${title}» رو حذف کنی؟\n\n⚠️ این عمل قابل بازگشت نیست!`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/konkur?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setKonkurList(konkurList.filter((k) => k.id !== id));
      }
    } catch {
      alert("خطا در حذف");
    }
  }

  const filtered = konkurList.filter((k) => {
    const q = search.toLowerCase();
    const matchSearch =
      k.title.toLowerCase().includes(q) ||
      k.field.toLowerCase().includes(q) ||
      (k.subtitle?.toLowerCase() || "").includes(q);
    const matchYear = filterYear === "all" || k.year === filterYear;
    return matchSearch && matchYear;
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
          <h1 className="page-header__title">📚 مدیریت آرشیو کنکور</h1>
          <p className="page-header__subtitle">
            {toFa(konkurList.length)} آزمون موجود
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
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }
              }}
              className="btn btn--primary"
            >
              {showForm ? "✕ بستن فرم" : "➕ افزودن کنکور جدید"}
            </button>
          </div>

          {/* فرم */}
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
                {editingId ? "✏️ ویرایش کنکور" : "➕ افزودن کنکور جدید"}
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
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="مثال: کنکور ۱۴۰۴ - ریاضی و فنی"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  📌 زیرعنوان (نوبت / شماره دفترچه)
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="مثال: دفترچه ۱ - ریاضی | نوبت اول"
                  style={inputStyle}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "4px",
                  }}
                >
                  این متن زیر عنوان کارت نمایش داده می‌شه
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
                  <label style={labelStyle}>سال *</label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {toFa(y)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>رشته *</label>
                  <select
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  >
                    <option value="">— انتخاب کنید —</option>
                    {FIELDS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>لینک دفترچه سوالات (Google Drive)</label>
                <input
                  type="url"
                  name="questionUrl"
                  value={form.questionUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/.../view"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>لینک کلید پاسخ (Google Drive)</label>
                <input
                  type="url"
                  name="answerUrl"
                  value={form.answerUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/.../view"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>توضیحات (اختیاری)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="توضیحات اختیاری درباره‌ی این آزمون..."
                  rows={3}
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
                    : "💾 ذخیره کنکور"}
                </button>
              </div>
            </form>
          )}

          {/* فیلترها */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="🔍 جستجو در عنوان، رشته یا زیرعنوان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                background: "#fff",
              }}
            />

            <select
              value={filterYear}
              onChange={(e) =>
                setFilterYear(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
              style={{
                padding: "10px 14px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                cursor: "pointer",
                background: "#fff",
              }}
            >
              <option value="all">📅 همه‌ی سال‌ها</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {toFa(y)}
                </option>
              ))}
            </select>
          </div>

          {/* لیست */}
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
              📚 کنکوری یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filtered.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #0066cc, #7c3aed)",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {toFa(item.year)}
                  </div>

                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </div>

                    {item.subtitle && (
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#0066cc",
                          marginBottom: "4px",
                          display: "inline-block",
                          padding: "2px 8px",
                          background: "#f0f7ff",
                          borderRadius: "6px",
                        }}
                      >
                        📌 {item.subtitle}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>🎓 {item.field}</span>
                      {item.questionUrl && <span>📄 دفترچه</span>}
                      {item.answerUrl && <span>✅ کلید</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#fef3c7",
                        color: "#92400e",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 700,
                        fontFamily: "inherit",
                      }}
                    >
                      ✏️ ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 700,
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