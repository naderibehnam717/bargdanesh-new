"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: CommentUser;
  replies?: Comment[];
}

interface CommentSectionProps {
  fileSlug: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── آواتار ───
function Avatar({ name, size = 40 }: { name: string | null; size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0066cc, #7c3aed)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${size / 2.5}px`,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {name?.charAt(0) || "ک"}
    </div>
  );
}

// ─── فرم ارسال (کامنت یا ریپلای) ───
function CommentForm({
  fileSlug,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "نظر خود را بنویسید...",
  autoFocus = false,
}: {
  fileSlug: string;
  parentId?: string;
  onSuccess: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (content.trim().length < 3) {
      setError("حداقل ۳ کاراکتر بنویسید");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileSlug, content: content.trim(), parentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ثبت");
        return;
      }

      setContent("");
      onSuccess(data);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "8px 12px",
            borderRadius: "8px",
            marginBottom: "8px",
            fontSize: "12px",
            border: "1px solid #fca5a5",
          }}
        >
          ❌ {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={submitting}
        rows={parentId ? 2 : 3}
        maxLength={1000}
        autoFocus={autoFocus}
        style={{
          width: "100%",
          padding: "10px 14px",
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
          marginTop: "8px",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "11px", color: "#999" }}>
          {content.length} / ۱۰۰۰
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn--ghost btn--sm"
              style={{ fontSize: "12px" }}
            >
              لغو
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || content.trim().length < 3}
            className="btn btn--primary btn--sm"
            style={{
              opacity: submitting || content.trim().length < 3 ? 0.5 : 1,
              cursor:
                submitting || content.trim().length < 3
                  ? "not-allowed"
                  : "pointer",
              fontSize: "12px",
            }}
          >
            {submitting ? "⏳..." : parentId ? "📤 پاسخ" : "📤 ارسال"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── کارت کامنت ───
function CommentCard({
  comment,
  fileSlug,
  onDelete,
  onReply,
  isReply = false,
  currentUserId,
  isAdmin,
}: {
  comment: Comment;
  fileSlug: string;
  onDelete: (id: string) => void;
  onReply: (comment: Comment) => void;
  isReply?: boolean;
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);

  const isOwner = comment.user.id === currentUserId;
  const canDelete = isOwner || isAdmin;
  const canReply = !isReply; // فقط به کامنت اصلی

  return (
    <div
      style={{
        padding: isReply ? "10px" : "14px",
        background: isReply ? "#f0f7ff" : "#f8f9fa",
        borderRadius: "10px",
        border: isReply ? "1px solid #dbeafe" : "1px solid #f0f0f0",
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar name={comment.user.name} size={isReply ? 28 : 32} />
          <div>
            <div
              style={{
                fontSize: isReply ? "12px" : "13px",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              {comment.user.name || "کاربر برگ دانش"}
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>
              {timeAgo(comment.createdAt)}
            </div>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: isReply ? "13px" : "15px",
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
          fontSize: isReply ? "13px" : "14px",
          color: "#444",
          lineHeight: 1.9,
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {comment.content}
      </p>

      {canReply && (
        <div style={{ marginTop: "8px" }}>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#0066cc",
              fontWeight: 700,
              padding: "4px 0",
              fontFamily: "inherit",
            }}
          >
            {showReplyForm ? "✕ لغو" : "↩️ پاسخ"}
          </button>
        </div>
      )}

      {/* فرم ریپلای */}
      {showReplyForm && (
        <div style={{ marginTop: "10px" }}>
          <CommentForm
            fileSlug={fileSlug}
            parentId={comment.id}
            placeholder={`پاسخ به ${comment.user.name || "این کاربر"}...`}
            autoFocus
            onCancel={() => setShowReplyForm(false)}
            onSuccess={(newReply) => {
              setReplies([...replies, newReply]);
              setShowReplyForm(false);
            }}
          />
        </div>
      )}

      {/* نمایش ریپلای‌ها */}
      {replies.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            paddingRight: "16px",
            borderRight: "2px solid #dbeafe",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              fileSlug={fileSlug}
              onDelete={onDelete}
              onReply={onReply}
              isReply
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ fileSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;
  const isAdmin = userRole === "admin";

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

  // ─── شمارش کل کامنت‌ها (اصلی + ریپلای) ───
  function countAll(list: Comment[]): number {
    return list.reduce((total, c) => {
      return total + 1 + (c.replies ? countAll(c.replies) : 0);
    }, 0);
  }

  const totalCount = countAll(comments);

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
          {totalCount}
        </span>
      </div>

      {/* ─── فرم ارسال ─── */}
      {session?.user ? (
        <div style={{ marginBottom: "24px" }}>
          <CommentForm
            fileSlug={fileSlug}
            onSuccess={(newComment) => {
              setComments([newComment, ...comments]);
            }}
          />
        </div>
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
          <Link href="/login" style={{ color: "#0066cc", fontWeight: 700 }}>
            وارد شوید
          </Link>{" "}
          یا{" "}
          <Link href="/signup" style={{ color: "#0066cc", fontWeight: 700 }}>
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
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              fileSlug={fileSlug}
              onDelete={handleDelete}
              onReply={() => {}}
              currentUserId={userId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}