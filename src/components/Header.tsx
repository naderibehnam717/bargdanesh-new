"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="logo">
            <span className="logo__icon">📚</span>
            <span>برگ دانش</span>
          </Link>

          <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
            <Link href="/" className="nav__link" onClick={closeMenu}>خانه</Link>
            <Link href="/university" className="nav__link" onClick={closeMenu}>دانشگاهی</Link>
            <Link href="/school" className="nav__link" onClick={closeMenu}>مدرسه ای</Link>
            <Link href="/exams" className="nav__link" onClick={closeMenu}>نمونه سوال</Link>
            <Link href="/articles" className="nav__link" onClick={closeMenu}>مقالات</Link>
            <Link href="/books" className="nav__link" onClick={closeMenu}>منابع غیر درسی</Link>
            <Link href="/employment" className="nav__link" onClick={closeMenu}>منابع استخدامی</Link>
          </nav>

          <div className="header__actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="theme-toggle__icon">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>
            <a href="#" className="btn btn--ghost">ورود</a>
            <a href="#" className="btn btn--primary">ثبت‌نام</a>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="menu-toggle__icon">{menuOpen ? "✕" : "☰"}</span>
            <span className="menu-toggle__text">دسته‌بندی</span>
          </button>
        </div>
      </header>

      <button
        className="nav-close"
        onClick={closeMenu}
        style={{ display: menuOpen ? "inline-flex" : "none" }}
        aria-label="بستن منو"
      >
        ✕
      </button>
      <div
        className={`nav-overlay ${menuOpen ? "nav-overlay--active" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}