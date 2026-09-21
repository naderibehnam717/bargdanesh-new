"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Log {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  admin: {
    id: string;
    name: string | null;
    email: string;
  };
}

const actionLabels: Record<string, string> = {
  create: "ایجاد",
  update: "ویرایش",
  delete: "حذف",
  approve: "تأیید",
  reject: "رد",
  send_email: "ارسال ایمیل",
  change_role: "تغییر نقش",
  login: "ورود",
  logout: "خروج",
};

const actionIcons: Record<string, string> = {
  create: "🟢",
  update: "🟡",
  delete: "🔴",
  approve: "✅",
  reject: "❌",
  send_email: "📧",
  change_role: "👑",
  login: "🔓",
  logout: "🔒",
};

const actionColors: Record<string, string> = {
  create: "#10b981",
  update: "#f59e0b",
  delete: "#ef4444",
  approve: "#10b981",
  reject: "#ef4444",
  send_email: "#7c3aed",
  change_role: "#f59e0b",
  login: "#0ea5e9",
  logout: "#6b7280",
};

const entityLabels: Record<string, string> = {
  File: "فایل",
  User: "کاربر",
  Comment: "کامنت",
  Quiz: "کوییز",
  Settings: "تنظیمات",
  Email: "ایمیل",
  Auth: "احراز هویت",
};

const entityIcons: Record<string, string> = {
  File: "📁",
  User: "👤",
  Comment: "💬",
  Quiz: "🎯",
  Settings: "🔧",
  Email: "📧",
  Auth: "🔐",
};

function toFaDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function parseDetails(details: string | null): Record<string, unknown> {
  if (!details) return {};
  try {
    return JSON.parse(details);
  } catch {
    return { text: details };
  }
}

function renderDetails(
  action: string,
  entityType: string,
  details: string | null
) {
  const data = parseDetails(details);

  // فایل
  if (entityType === "File") {
    if (action === "create" || action === "delete") {
      return (
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          📄 <strong>{String(data.title || "—")}</strong>
          {data.category ? (
            <span style={{ color: "#999" }}> ({String(data.category)})</span>
          ) : null}
        </div>
      );
    }
  }

  // کاربر
  if (entityType === "User") {
    if (action === "delete") {
      return (
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          👤 <strong>{String(data.name || "بدون نام")}</strong>
          {data.email ? (
            <span style={{ color: "#999" }}> ({String(data.email)})</span>
          ) : null}
        </div>
      );
    }
    if (action === "change_role") {
      return (
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          👤 <strong>{String(data.name || "بدون نام")}</strong>
          <span style={{ color: "#999" }}> — </span>
          <span
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {String(data.oldRole || "?")}
          </span>
          <span style={{ margin: "0 4px" }}>→</span>
          <span
            style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {String(data.newRole || "?")}
          </span>
        </div>
      );
    }
  }

  // کامنت
  if (entityType === "Comment") {
    const contentStr = String(data.content || "—");
    return (
      <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
        💬 «{contentStr.slice(0, 80)}
        {contentStr.length > 80 ? "..." : ""}»
        {data.authorName ? (
          <span style={{ color: "#999" }}> — {String(data.authorName)}</span>
        ) : null}
      </div>
    );
  }

  // کوییز
  if (entityType === "Quiz") {
    const questionStr = String(data.question || "—");
    return (
      <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
        ❓ «{questionStr.slice(0, 80)}
        {questionStr.length > 80 ? "..." : ""}»
        {data.category ? (
          <span style={{ color: "#999" }}> ({String(data.category)})</span>
        ) : null}
      </div>
    );
  }

  // ایمیل
  if (entityType === "Email") {
    return (
      <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
        📨 <strong>{String(data.subject || "—")}</strong>
        {data.recipientCount !== undefined ? (
          <span style={{ color: "#999" }}>
            {" "}
            — {String(data.recipientCount)} گیرنده
          </span>
        ) : null}
        {data.sentCount !== undefined ? (
          <span style={{ color: "#10b981" }}>
            {" "}
            ✅ {String(data.sentCount)} موفق
          </span>
        ) : null}
      </div>
    );
  }

  // تنظیمات
  if (entityType === "Settings") {
    const changes = data.changes as Record<string, unknown> | undefined;
    if (changes) {
      return (
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          🔧 {Object.keys(changes).join("، ")}
        </div>
      );
    }
  }

  return null;
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [showLimit, setShowLimit] = useState(100);

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
  }, [status, session, router, showLimit, filterAction, filterEntity]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(showLimit),
        action: filterAction,
        entityType: filterEntity,
      });
      const res = await fetch(`/api/admin/logs?${params}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q) ||
      (log.admin.name?.toLowerCase() || "").includes(q) ||
      log.admin.email.toLowerCase().includes(q) ||
      (log.details?.toLowerCase() || "").includes(q)
    );
  });

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📜 لاگ فعالیت‌ها</h1>
          <p className="page-header__subtitle">
            تاریخچه‌ی کامل فعالیت‌های ادمین‌ها
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e5e5e5",
                background: "#fff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="all">🔍 همه‌ی فعالیت‌ها</option>
              <option value="create">🟢 ایجاد</option>
              <option value="update">🟡 ویرایش</option>
              <option value="delete">🔴 حذف</option>
              <option value="approve">✅ تأیید</option>
              <option value="reject">❌ رد</option>
              <option value="send_email">📧 ارسال ایمیل</option>
              <option value="change_role">👑 تغییر نقش</option>
            </select>

            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e5e5e5",
                background: "#fff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="all">🗂️ همه‌ی دسته‌ها</option>
              <option value="File">📁 فایل</option>
              <option value="User">👤 کاربر</option>
              <option value="Comment">💬 کامنت</option>
              <option value="Quiz">🎯 کوییز</option>
              <option value="Settings">🔧 تنظیمات</option>
              <option value="Email">📧 ایمیل</option>
            </select>

            <select
              value={showLimit}
              onChange={(e) => setShowLimit(Number(e.target.value))}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e5e5e5",
                background: "#fff",
                fontSize: "13px",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value={50}>۵۰ لاگ آخر</option>
              <option value={100}>۱۰۰ لاگ آخر</option>
              <option value={250}>۲۵۰ لاگ آخر</option>
              <option value={500}>۵۰۰ لاگ آخر</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در لاگ‌ها..."
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

          {loading ? (
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
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
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
              📜 لاگی یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {filtered.map((log) => {
                const actionLabel = actionLabels[log.action] || log.action;
                const actionIcon = actionIcons[log.action] || "⚪";
                const actionColor = actionColors[log.action] || "#666";
                const entityLabel =
                  entityLabels[log.entityType] || log.entityType;
                const entityIcon = entityIcons[log.entityType] || "📦";

                return (
                  <div
                    key={log.id}
                    style={{
                      background: "#fff",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1px solid #e5e5e5",
                      borderRight: `4px solid ${actionColor}`,
                      display: "flex",
                      gap: "14px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: `${actionColor}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {actionIcon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: "4px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "14px",
                            color: "#1a1a1a",
                          }}
                        >
                          {log.admin.name || "ادمین"}
                        </strong>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {log.admin.email}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: "13.5px",
                          color: "#444",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{ color: actionColor, fontWeight: 700 }}
                        >
                          {actionLabel}
                        </span>
                        <span
                          style={{
                            background: "#f0f7ff",
                            color: "#0066cc",
                            padding: "2px 8px",
                            borderRadius: "100px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {entityIcon} {entityLabel}
                        </span>
                      </div>

                      {renderDetails(log.action, log.entityType, log.details)}
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                      title={toFaDate(log.createdAt)}
                    >
                      {timeAgo(log.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}