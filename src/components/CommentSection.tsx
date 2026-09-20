"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  fileSlug: string;
}

function toFaDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return toFaDate(dateStr);
}

export default function CommentSection({ fileSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComments();
  }, [fileSlug]);

  async function loadComments() {
    try {
      const res = await fetch(
        `/api/comments?fileSlug=${encodeURIComponent(fileSlug)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      setError("برای ثبت نظر باید وارد شوید");
      return;
    }

    if (content.trim().length < 3) {
      setError("متن نظر باید حداقل ۳ کاراکتر باشد");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileSlug, content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ثبت نظر");
        return;
      }

      setComments([data, ...comments]);
      setContent("");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا مطمئنی می‌خوای این نظر رو حذف کنی؟")) return;

    try {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch {
      // خطا
    }
  }

  const userRole = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto 0",
        padding: "24px",
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        <span style={{ fontSize: "24px" }}>💬</span>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          نظرات کاربران
        </h2>
        <span
          style={{
            background: "#e0f2fe",
            color: "#0369a1",
            padding: "2px 10px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {comments.length}
        </span>
      </div>

      {/* ─── فرم ارسال ─── */}
      {session?.user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "12px",
                fontSize: "13px",
                border: "1px solid #fca5a5",
              }}
            >
              ❌ {error}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            disabled={submitting}
            rows={3}
            maxLength={1000}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              background: "#f8f9fa",
              color: "#1a1a1a",
              lineHeight: 1.8,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#999" }}>
              {content.length} / ۱۰۰۰
            </span>
            <button
              type="submit"
              disabled={submitting || content.trim().length < 3}
              className="btn btn--primary btn--sm"
              style={{
                opacity:
                  submitting || content.trim().length < 3 ? 0.5 : 1,
                cursor:
                  submitting || content.trim().length < 3
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitting ? "⏳ در حال ارسال..." : "📤 ارسال نظر"}
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            background: "#fff8e1",
            border: "1px solid #ffe082",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#856404",
          }}
        >
          🔒 برای ثبت نظر،{" "}
          <Link
            href="/login"
            style={{ color: "#0066cc", fontWeight: 700 }}
          >
            وارد شوید
          </Link>{" "}
          یا{" "}
          <Link
            href="/signup"
            style={{ color: "#0066cc", fontWeight: 700 }}
          >
            ثبت‌نام کنید
          </Link>
        </div>
      )}

      {/* ─── لیست کامنت‌ها ─── */}
      {loading ? (
        <p
          style={{
            textAlign: "center",
            color: "#999",
            padding: "40px 0",
            fontSize: "14px",
          }}
        >
          ⏳ در حال بارگذاری...
        </p>
      ) : comments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#999",
            fontSize: "14px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>💭</div>
          هنوز نظری ثبت نشده. اولین نفر باش!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {comments.map((comment) => {
            const isOwner = comment.user.id === userId;
            const isAdmin = userRole === "admin";
            const canDelete = isOwner || isAdmin;

            return (
              <div
                key={comment.id}
                style={{
                  padding: "14px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #0066cc, #7c3aed)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {comment.user.name?.charAt(0) || "ک"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1a1a1a",
                        }}
                      >
                        {comment.user.name || "کاربر برگ دانش"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#999" }}>
                        {timeAgo(comment.createdAt)}
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px",
                        color: "#e11d48",
                      }}
                      aria-label="حذف"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#444",
                    lineHeight: 1.9,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}