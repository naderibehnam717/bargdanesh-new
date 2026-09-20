"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmailLog {
  id: string;
  subject: string;
  content: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  createdAt: string;
}

function toFaDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default function AdminEmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<
    "all" | "users" | "admins"
  >("all");
  const [onlySubscribed, setOnlySubscribed] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
      fetchLogs();
    }
  }, [status, session, router]);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/admin/email", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  function handleSendClick(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!subject.trim()) {
      setMessage({ type: "error", text: "موضوع ایمیل الزامی است" });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: "error", text: "متن ایمیل الزامی است" });
      return;
    }

    if (content.length > 10000) {
      setMessage({ type: "error", text: "متن ایمیل طولانی است" });
      return;
    }

    setShowConfirm(true);
  }

  async function handleConfirmSend() {
    setShowConfirm(false);
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          content,
          recipientType,
          onlySubscribed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "خطا در ارسال",
        });
        return;
      }

      setMessage({
        type: "success",
        text: `✅ ایمیل به ${toFa(data.sentCount)} کاربر ارسال شد${
          data.failedCount > 0
            ? ` (${toFa(data.failedCount)} ناموفق)`
            : ""
        }`,
      });

      setSubject("");
      setContent("");
      fetchLogs();
    } catch {
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setSending(false);
    }
  }

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
    padding: "12px 16px",
    border: "1px solid #e5e5e5",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    background: "#f8f9fa",
    color: "#1a1a1a",
    lineHeight: 1.8,
  };

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📧 ایمیل گروهی</h1>
          <p className="page-header__subtitle">
            ارسال ایمیل به کاربران برگ دانش
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "24px" }}>
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
          </div>

          {/* پیام */}
          {message && (
            <div
              style={{
                background:
                  message.type === "success" ? "#d1fae5" : "#fee2e2",
                color: message.type === "success" ? "#065f46" : "#991b1b",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: `1px solid ${
                  message.type === "success" ? "#6ee7b7" : "#fca5a5"
                }`,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {message.text}
            </div>
          )}

          {/* فرم */}
          <form
            onSubmit={handleSendClick}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e5e5",
              marginBottom: "32px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "20px",
                color: "#1a1a1a",
              }}
            >
              ✉️ ایمیل جدید
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#1a1a1a",
                }}
              >
                موضوع ایمیل *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: جزوه‌های جدید برگ دانش اضافه شد!"
                maxLength={200}
                style={inputStyle}
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#999",
                  marginTop: "4px",
                  textAlign: "left",
                }}
              >
                {subject.length} / ۲۰۰
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#1a1a1a",
                }}
              >
                متن ایمیل *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن ایمیل خود را بنویسید... (می‌توانید از Enter برای خط جدید استفاده کنید)"
                rows={8}
                maxLength={10000}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#999",
                  marginTop: "4px",
                  textAlign: "left",
                }}
              >
                {content.length} / ۱۰۰۰۰
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#1a1a1a",
                  }}
                >
                  گیرندگان
                </label>
                <select
                  value={recipientType}
                  onChange={(e) =>
                    setRecipientType(
                      e.target.value as "all" | "users" | "admins"
                    )
                  }
                  style={inputStyle}
                >
                  <option value="all">🌍 همه کاربران</option>
                  <option value="users">👤 فقط کاربران عادی</option>
                  <option value="admins">👑 فقط ادمین‌ها</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#1a1a1a",
                  }}
                >
                  فیلتر
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  <input
                    type="checkbox"
                    id="onlySubscribed"
                    checked={onlySubscribed}
                    onChange={(e) => setOnlySubscribed(e.target.checked)}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="onlySubscribed"
                    style={{
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#444",
                    }}
                  >
                    فقط مشترکان خبرنامه
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn btn--primary"
              style={{
                width: "100%",
                opacity: sending ? 0.6 : 1,
                cursor: sending ? "not-allowed" : "pointer",
              }}
            >
              {sending ? "⏳ در حال ارسال..." : "📤 ارسال ایمیل"}
            </button>
          </form>

          {/* پیش‌نمایش */}
          {(subject || content) && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                marginBottom: "32px",
              }}
            >
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  color: "#666",
                }}
              >
                👁️ پیش‌نمایش
              </h4>
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #e5e5e5",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#0066cc",
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {subject || "(بدون موضوع)"}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#444",
                    lineHeight: 2,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {content || "(بدون محتوا)"}
                </div>
              </div>
            </div>
          )}

          {/* تاریخچه */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "16px",
                color: "#1a1a1a",
              }}
            >
              📜 تاریخچه ارسال‌ها
            </h3>

            {logs.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  padding: "40px",
                  borderRadius: "16px",
                  border: "1px solid #e5e5e5",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                هنوز ایمیلی ارسال نشده
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {logs.map((log) => {
                  const statusInfo =
                    log.status === "success"
                      ? { icon: "✅", color: "#065f46", bg: "#d1fae5" }
                      : log.status === "partial"
                      ? { icon: "⚠️", color: "#92400e", bg: "#fef3c7" }
                      : { icon: "⏳", color: "#1e40af", bg: "#dbeafe" };

                  return (
                    <div
                      key={log.id}
                      style={{
                        background: "#fff",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "14px",
                            color: "#1a1a1a",
                          }}
                        >
                          {log.subject}
                        </strong>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "100px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: statusInfo.bg,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.icon} {log.status}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "12px",
                          color: "#666",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>👥 {toFa(log.recipientCount)} گیرنده</span>
                        <span>✅ {toFa(log.sentCount)} موفق</span>
                        {log.failedCount > 0 && (
                          <span style={{ color: "#991b1b" }}>
                            ❌ {toFa(log.failedCount)} ناموفق
                          </span>
                        )}
                        <span>🕐 {toFaDate(log.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* مودال تایید */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📧</div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              ارسال ایمیل گروهی؟
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "20px",
                lineHeight: 1.8,
              }}
            >
              این ایمیل به{" "}
              {recipientType === "all"
                ? "همه کاربران"
                : recipientType === "users"
                ? "کاربران عادی"
                : "ادمین‌ها"}
              {onlySubscribed && recipientType === "all"
                ? " (فقط مشترکان)"
                : ""}{" "}
              ارسال می‌شود.
              <br />
              <strong style={{ color: "#e11d48" }}>
                این عمل قابل بازگشت نیست!
              </strong>
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn--ghost"
                style={{ flex: 1 }}
              >
                لغو
              </button>
              <button
                onClick={handleConfirmSend}
                className="btn btn--primary"
                style={{ flex: 1 }}
              >
                📤 ارسال
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}