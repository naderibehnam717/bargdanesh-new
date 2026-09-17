"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Favorite {
  id: string;
  fileTitle: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, router]);

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/user/favorites");
      if (!res.ok) throw new Error("خطا");
      const data = await res.json();
      setFavorites(data);
    } catch {
      console.error("خطا در دریافت علاقه‌مندی‌ها");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`آیا می‌خوای «${title}» رو از علاقه‌مندی‌ها حذف کنی؟`)) return;

    const res = await fetch(`/api/user/favorites?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFavorites(favorites.filter((f) => f.id !== id));
    } else {
      alert("خطا در حذف");
    }
  }

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
          <h1 className="page-header__title">❤️ فایل‌های مورد علاقه</h1>
          <p className="page-header__subtitle">
            {favorites.length} فایل ذخیره شده
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "var(--sp-5)" }}>
            <Link href="/dashboard" className="btn btn--ghost">
              ← بازگشت به پنل کاربری
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div
              style={{
                background: "var(--card)",
                padding: "60px 20px",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "var(--sp-3)" }}>
                ❤️
              </div>
              <p style={{ fontSize: "16px", marginBottom: "var(--sp-3)" }}>
                هنوز هیچ فایلی رو به علاقه‌مندی‌ها اضافه نکردی
              </p>
              <Link href="/" className="btn btn--primary">
                🔍 جستجوی فایل‌ها
              </Link>
            </div>
          ) : (
            <div
              style={{
                background: "var(--card)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--sp-4)",
                    borderBottom: "1px solid var(--border)",
                    gap: "var(--sp-3)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {fav.fileTitle}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      📅 {new Date(fav.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(fav.id, fav.fileTitle)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--r-md)",
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
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}