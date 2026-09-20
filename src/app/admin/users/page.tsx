"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count?: {
    downloads: number;
    comments: number;
    favorites: number;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all");

  const currentUserId = (session?.user as { id?: string })?.id;

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
      fetchUsers();
    }
  }, [status, session, router]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string | null) {
    if (id === currentUserId) {
      alert("❌ نمی‌تونی خودت رو حذف کنی!");
      return;
    }

    if (
      !confirm(
        `آیا مطمئنی می‌خوای «${name || "این کاربر"}» رو حذف کنی؟\n\n⚠️ این عمل قابل بازگشت نیست!`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert("خطا در حذف کاربر");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  }

  async function handleRoleChange(id: string, newRole: string, name: string | null) {
    if (id === currentUserId) {
      alert("❌ نمی‌تونی نقش خودت رو تغییر بدی!");
      return;
    }

    const roleLabel = newRole === "admin" ? "ادمین" : "کاربر";
    if (
      !confirm(
        `آیا مطمئنی می‌خوای نقش «${name || "این کاربر"}» رو به «${roleLabel}» تغییر بدی؟`
      )
    ) {
      fetchUsers();
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
        );
      } else {
        alert("خطا در تغییر نقش");
        fetchUsers();
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      (u.name?.toLowerCase() || "").includes(q) ||
      u.email.toLowerCase().includes(q);

    const matchFilter =
      filter === "all"
        ? true
        : filter === "admin"
        ? u.role === "admin"
        : u.role !== "admin";

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

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.length - adminCount;

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">👥 مدیریت کاربران</h1>
          <p className="page-header__subtitle">
            {users.length} کاربر — {adminCount} ادمین، {userCount} کاربر عادی
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
              همه ({users.length})
            </button>
            <button
              onClick={() => setFilter("admin")}
              className={`btn btn--sm ${
                filter === "admin" ? "btn--primary" : "btn--ghost"
              }`}
            >
              👑 ادمین‌ها ({adminCount})
            </button>
            <button
              onClick={() => setFilter("user")}
              className={`btn btn--sm ${
                filter === "user" ? "btn--primary" : "btn--ghost"
              }`}
            >
              👤 کاربران ({userCount})
            </button>
          </div>

          {/* جستجو */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو در نام یا ایمیل..."
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

          {/* لیست */}
          {filteredUsers.length === 0 ? (
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
              👥 کاربری یافت نشد
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filteredUsers.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                const isAdmin = user.role === "admin";
                const date = new Date(user.createdAt).toLocaleDateString(
                  "fa-IR",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

                return (
                  <div
                    key={user.id}
                    style={{
                      background: "#fff",
                      padding: "18px",
                      borderRadius: "12px",
                      border: isCurrentUser
                        ? "2px solid #0066cc"
                        : "1px solid #e5e5e5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* موبایل: عمودی، دسکتاپ: افقی */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* اطلاعات کاربر */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flex: 1,
                          minWidth: "220px",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: isAdmin
                              ? "linear-gradient(135deg, #f59e0b, #e11d48)"
                              : "linear-gradient(135deg, #0066cc, #7c3aed)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {user.name?.charAt(0) || "ک"}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "#1a1a1a",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            {user.name || "بدون نام"}
                            {isCurrentUser && (
                              <span
                                style={{
                                  background: "#dbeafe",
                                  color: "#1e40af",
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                }}
                              >
                                شما
                              </span>
                            )}
                            {isAdmin && (
                              <span
                                style={{
                                  background: "#fef3c7",
                                  color: "#92400e",
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                }}
                              >
                                👑 ادمین
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "2px",
                              wordBreak: "break-all",
                            }}
                          >
                            📧 {user.email}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#999",
                              marginTop: "2px",
                            }}
                          >
                            🕐 عضویت: {date}
                          </div>
                        </div>
                      </div>

                      {/* عملیات */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* تغییر نقش */}
                        {!isCurrentUser ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value,
                                user.name
                              )
                            }
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid #e5e5e5",
                              background: "#f8f9fa",
                              color: "#1a1a1a",
                              fontSize: "13px",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontWeight: 600,
                            }}
                          >
                            <option value="user">👤 کاربر</option>
                            <option value="admin">👑 ادمین</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              padding: "8px 12px",
                              fontSize: "12px",
                              color: "#999",
                            }}
                          >
                            (نقش خودت)
                          </span>
                        )}

                        {/* حذف */}
                        {!isCurrentUser && (
                          <button
                            onClick={() =>
                              handleDelete(user.id, user.name)
                            }
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
                        )}
                      </div>
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