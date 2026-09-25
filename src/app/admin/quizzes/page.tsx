"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string | null;
  category: string;
  level: string;
  isPublished: boolean;
  createdAt: string;
}

interface CategoryOption {
  id: string;
  slug: string;
  title: string;
  icon: string;
}

const emptyForm = {
  question: "",
  options: ["", "", "", ""],
  correctIdx: 0,
  explanation: "",
  category: "",
  level: "دانشگاهی",
};

const LEVELS = ["دانشگاهی", "مدرسه‌ای", "غیر درسی"];

export default function AdminQuizzesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
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
      fetchQuizzes();
      fetchCategories();
    }
  }, [status, session, router]);

  async function fetchQuizzes() {
    try {
      const res = await fetch("/api/admin/quizzes", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuizzes(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCategories(
        data.filter((c: CategoryOption & { isActive: boolean }) => c.isActive)
      );
    } catch {
      console.error("خطا در دریافت دسته‌ها");
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleOptionChange(idx: number, value: string) {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm({ ...form, options: newOptions });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.question.trim()) {
      setError("متن سوال الزامی است");
      return;
    }

    if (form.options.some((o) => !o.trim())) {
      setError("همه‌ی گزینه‌ها باید پر شوند");
      return;
    }

    if (!form.category) {
      setError("دسته‌بندی الزامی است");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ذخیره");
        return;
      }

      setQuizzes([data, ...quizzes]);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, question: string) {
    if (
      !confirm(
        `آیا مطمئنی می‌خوای این سوال رو حذف کنی؟\n\n"${question.slice(0, 60)}..."`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/quizzes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== id));
      }
    } catch {
      // خطا
    }
  }

  const filtered = quizzes.filter((q) => {
    const term = search.toLowerCase();
    return (
      q.question.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term)
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

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">🎯 مدیریت کوییزها</h1>
          <p className="page-header__subtitle">{quizzes.length} سوال موجود</p>
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
              onClick={() => setShowForm(!showForm)}
              className="btn btn--primary"
            >
              {showForm ? "✕ بستن فرم" : "➕ افزودن سوال جدید"}
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
                ➕ افزودن سوال جدید
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

              <textarea
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="متن سوال *"
                required
                rows={3}
                style={inputStyle}
              />

              <div style={{ display: "grid", gap: "10px", paddingTop: "8px" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  گزینه‌ها (گزینه‌ی درست رو انتخاب کن):
                </label>

                {form.options.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="radio"
                      name="correctIdx"
                      checked={form.correctIdx === idx}
                      onChange={() => setForm({ ...form, correctIdx: idx })}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background:
                          form.correctIdx === idx ? "#d1fae5" : "#f0f0f0",
                        color: form.correctIdx === idx ? "#065f46" : "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {["الف", "ب", "ج", "د"][idx]}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`گزینه‌ی ${["الف", "ب", "ج", "د"][idx]}`}
                      required
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <textarea
                name="explanation"
                value={form.explanation}
                onChange={handleChange}
                placeholder="توضیح پاسخ (اختیاری)"
                rows={2}
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    دسته‌بندی *
                  </label>
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
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    سطح
                  </label>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn--primary"
                style={{ width: "100%" }}
              >
                {saving ? "در حال ذخیره..." : "💾 ذخیره سوال"}
              </button>
            </form>
          )}

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در سوال یا دسته‌بندی..."
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
              🎯 سوالی یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filtered.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {quiz.category}
                      </span>
                      <span
                        style={{
                          background: "#f0f0f0",
                          color: "#666",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {quiz.level}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      marginBottom: "12px",
                      lineHeight: 1.7,
                    }}
                  >
                    {quiz.question}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    {quiz.options.map((opt, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          background:
                            idx === quiz.correctIdx ? "#d1fae5" : "#f8f9fa",
                          color:
                            idx === quiz.correctIdx ? "#065f46" : "#444",
                          fontWeight: idx === quiz.correctIdx ? 700 : 400,
                          border:
                            idx === quiz.correctIdx
                              ? "1px solid #6ee7b7"
                              : "1px solid #f0f0f0",
                        }}
                      >
                        {idx === quiz.correctIdx ? "✅ " : ""}
                        {opt}
                      </div>
                    ))}
                  </div>

                  {quiz.explanation && (
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: 1.8,
                        marginBottom: "12px",
                        borderRight: "3px solid #0066cc",
                      }}
                    >
                      💡 {quiz.explanation}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(quiz.id, quiz.question)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
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