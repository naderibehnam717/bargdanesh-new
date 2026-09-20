"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  fileSlug: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
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

export default function AdminCommentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

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
      fetchComments();
    }
  }, [status, session, router]);

  async function fetchComments() {
    try {
      const res = await fetch("/api/admin/comments", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, current: boolean) {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !current }),
      });

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c.id === id ? { ...c, isApproved: !current } : c
          )
        );
      }
    } catch {
      // خطا
    }
  }

  async function handleDelete(id: string, content: string) {
    if (
      !confirm(
        `آیا مطمئنی می‌خوای این نظر رو حذف کنی؟\n\n"${content.slice(0, 50)}..."`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch {
      // خطا
    }
  }

  const filtered = comments.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.content.toLowerCase().includes(q) ||
      (c.user.name?.toLowerCase() || "").includes(q) ||
      c.user.email.toLowerCase().includes(q) ||
      c.fileSlug.toLowerCase().includes(q);

    const matchFilter =
      filter === "all"
        ? true
        : filter === "approved"
        ? c.isApproved
        : !c.isApproved;

    return matchSearch && matchFilter;
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

  const approvedCount = comments.filter((c) => c.isApproved).length;
  const pendingCount = comments.filter((c) => !c.isApproved).length;

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">💬 مدیریت کامنت‌ها</h1>
          <p className="page-header__subtitle">
            {comments.length} کامنت — {approvedCount} تاییدشده، {pendingCount} در
            انتظار
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

          {/* فیلترها */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setFilter("all")}
              className={`btn btn--sm ${
                filter === "all" ? "btn--primary" : "btn--ghost"
              }`}
            >
              همه ({comments.length})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`btn btn--sm ${
                filter === "approved" ? "btn--primary" : "btn--ghost"
              }`}
            >
              ✅ تاییدشده ({approvedCount})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`btn btn--sm ${
                filter === "pending" ? "btn--primary" : "btn--ghost"
              }`}
            >
              ⏳ در انتظار ({pendingCount})
            </button>
          </div>

          {/* جستجو */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در محتوا، کاربر، ایمیل یا slug..."
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
              💬 کامنتی یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filtered.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    border: comment.isApproved
                      ? "1px solid #e5e5e5"
                      : "2px solid #fbbf24",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0066cc, #7c3aed)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {comment.user.name?.charAt(0) || "ک"}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {comment.user.name || "کاربر"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {comment.user.email}
                        </div>
                      </div>
                    </div>

                    {!comment.isApproved && (
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        ⏳ در انتظار
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#444",
                      lineHeight: 1.9,
                      margin: "0 0 12px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {comment.content}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "12px",
                      borderTop: "1px solid #f0f0f0",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      <span>📁 {comment.fileSlug}</span>
                      <span>🕐 {toFaDate(comment.createdAt)}</span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() =>
                          toggleApproval(comment.id, comment.isApproved)
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: comment.isApproved
                            ? "#fef3c7"
                            : "#d1fae5",
                          color: comment.isApproved ? "#92400e" : "#065f46",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 700,
                          fontFamily: "inherit",
                        }}
                      >
                        {comment.isApproved ? "⏸️ لغو تایید" : "✅ تایید"}
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(comment.id, comment.content)
                        }
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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}