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
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setUsers(data);
    } catch {
      console.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string | null) {
    if (!confirm(`آیا مطمئنی می‌خوای «${name || "این کاربر"}» رو حذف کنی؟`)) return;

    const res = await fetch(`/api/admin/users?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      alert("خطا در حذف کاربر");
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
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
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name?.toLowerCase() || "").includes(q) ||
      u.email.toLowerCase().includes(q)
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

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">👥 مدیریت کاربران</h1>
          <p className="page-header__subtitle">
            {users.length} کاربر ثبت‌نام کرده
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "var(--sp-5)" }}>
            <Link href="/admin" className="btn btn--ghost">
              ← بازگشت به پنل ادمین
            </Link>
          </div>

          <div className="search-box" style={{ marginBottom: "var(--sp-5)" }}>
            <input
              type="text"
              className="search-box__input"
              placeholder="جستجوی نام یا ایمیل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                padding: "var(--sp-3) var(--sp-4)",
                background: "var(--bg-alt)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-soft)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>نام</div>
              <div>ایمیل</div>
              <div>نقش</div>
              <div>تاریخ</div>
              <div>عملیات</div>
            </div>

            {filteredUsers.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                کاربری پیدا نشد
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                    padding: "var(--sp-3) var(--sp-4)",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{user.name || "—"}</div>
                  <div style={{ color: "var(--text-soft)" }}>{user.email}</div>
                  <div>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--r-sm)",
                        border: "1px solid var(--border-dark)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="user">کاربر</option>
                      <option value="admin">ادمین</option>
                    </select>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--r-sm)",
                        background: "var(--rose-light)",
                        color: "var(--rose)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}