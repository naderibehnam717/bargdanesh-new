"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU: MenuGroup[] = [
  {
    title: "مدیریت محتوا",
    items: [
      { href: "/admin/files", icon: "📁", label: "فایل‌ها" },
      { href: "/admin/articles", icon: "📄", label: "مقالات" },
      { href: "/admin/konkur", icon: "📚", label: "کنکور" },
      { href: "/admin/quizzes", icon: "🎯", label: "کوییزها" },
      { href: "/admin/categories", icon: "📂", label: "دسته‌بندی‌ها" },
    ],
  },
  {
    title: "کاربران",
    items: [
      { href: "/admin/users", icon: "👥", label: "کاربران" },
      { href: "/admin/comments", icon: "💬", label: "کامنت‌ها" },
      { href: "/admin/downloads", icon: "📥", label: "تاریخچه دانلود" },
    ],
  },
  {
    title: "ارتباطات",
    items: [
      { href: "/admin/email", icon: "📧", label: "ایمیل گروهی" },
    ],
  },
  {
    title: "سیستم",
    items: [
      { href: "/admin/stats", icon: "📊", label: "آمار پیشرفته" },
      { href: "/admin/logs", icon: "📜", label: "لاگ فعالیت‌ها" },
      { href: "/admin/settings", icon: "🔧", label: "تنظیمات" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ─── دکمه موبایل ─── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="منوی ادمین"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1001,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0066cc, #7c3aed)",
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
          fontSize: "24px",
          cursor: "pointer",
          display: "none",
        }}
        className="admin-sidebar-mobile-toggle"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* ─── Overlay ─── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
          className="admin-sidebar-overlay"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`admin-sidebar ${mobileOpen ? "admin-sidebar--open" : ""}`}
        style={{
          position: "sticky",
          top: "80px",
          alignSelf: "flex-start",
          width: "240px",
          flexShrink: 0,
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e5e5e5",
          padding: "16px 12px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        {/* ─── لینک داشبورد ─── */}
        <Link
          href="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "10px",
            marginBottom: "12px",
            textDecoration: "none",
            background:
              pathname === "/admin"
                ? "linear-gradient(135deg, #0066cc, #7c3aed)"
                : "#f8fafc",
            color: pathname === "/admin" ? "#fff" : "#1a1a1a",
            fontWeight: 700,
            fontSize: "14px",
            transition: "all 0.2s ease",
            boxShadow:
              pathname === "/admin"
                ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                : "none",
          }}
        >
          <span style={{ fontSize: "18px" }}>⚙️</span>
          داشبورد
        </Link>

        <div
          style={{
            height: "1px",
            background: "#f0f0f0",
            margin: "8px 0",
          }}
        />

        {/* ─── گروه‌ها ─── */}
        {MENU.map((group) => (
          <div key={group.title} style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#94a3b8",
                padding: "8px 12px 4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {group.title}
            </div>

            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== "/admin");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#0066cc" : "#475569",
                    background: isActive ? "#f0f7ff" : "transparent",
                    borderRight: isActive
                      ? "3px solid #0066cc"
                      : "3px solid transparent",
                    transition: "all 0.15s ease",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 900px) {
              .admin-sidebar-mobile-toggle {
                display: flex !important;
                align-items: center;
                justify-content: center;
              }
              .admin-sidebar {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 260px !important;
                max-height: 100vh !important;
                border-radius: 0 !important;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 999;
                padding-top: 20px !important;
              }
              .admin-sidebar--open {
                transform: translateX(0) !important;
              }
              .admin-sidebar-overlay {
                display: block !important;
              }
            }
          `,
        }}
      />
    </>
  );
}