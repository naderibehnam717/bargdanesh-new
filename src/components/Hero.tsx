"use client";

import { useState } from "react";
import FileCard from "./FileCard";
import LoginAlert from "./LoginAlert";
import { useSession } from "next-auth/react";
import type { FileItem } from "@/lib/files";

interface HeroProps {
  files: FileItem[];
}

// ─── برگ SVG با طراحی اختصاصی ───
function LeafSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "1em",
        height: "1em",
        verticalAlign: "middle",
        margin: "0 0.15em",
      }}
    >
      {/* بدنه‌ی برگ */}
      <path
        d="M50 5 C 20 20, 5 50, 15 80 C 20 90, 30 95, 50 95 C 70 95, 80 90, 85 80 C 95 50, 80 20, 50 5 Z"
        fill="url(#leafGradient)"
        stroke="#2d7d46"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* رگه‌ی اصلی */}
      <path
        d="M50 10 L 50 90"
        stroke="#2d7d46"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* رگه‌های فرعی */}
      <path
        d="M50 30 Q 35 35, 25 45"
        stroke="#2d7d46"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 30 Q 65 35, 75 45"
        stroke="#2d7d46"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 50 Q 38 55, 28 65"
        stroke="#2d7d46"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 50 Q 62 55, 72 65"
        stroke="#2d7d46"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* گرادیانت */}
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6ee7a8" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero({ files }: HeroProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();

    if (!q) {
      setShowResults(false);
      return;
    }

    const found = files.filter((file) => {
      const text = (
        file.title +
        " " +
        file.desc +
        " " +
        file.category +
        " " +
        file.type +
        " " +
        file.level
      ).toLowerCase();
      return text.includes(q);
    });

    setResults(found);
    setShowResults(true);
  }

  return (
    <section className="hero">
      <div className="hero-float" aria-hidden="true">
        <span className="hero-float__particle hero-float__particle--1"></span>
        <span className="hero-float__particle hero-float__particle--2"></span>
        <span className="hero-float__particle hero-float__particle--3"></span>
        <span className="hero-float__particle hero-float__particle--4"></span>
        <span className="hero-float__particle hero-float__particle--5"></span>
        <span className="hero-float__particle hero-float__particle--6"></span>

        <span className="hero-float__item hero-float__item--1">📚</span>
        <span className="hero-float__item hero-float__item--2">📖</span>
        <span className="hero-float__item hero-float__item--3">🍃</span>
        <span className="hero-float__item hero-float__item--4">✏️</span>
        <span className="hero-float__item hero-float__item--5">🎓</span>
        <span className="hero-float__item hero-float__item--6">🍃</span>
        <span className="hero-float__item hero-float__item--7">📝</span>
        <span className="hero-float__item hero-float__item--8">💡</span>
        <span className="hero-float__item hero-float__item--9">📐</span>
        <span className="hero-float__item hero-float__item--10">🌿</span>
      </div>

      <div className="container">
        <div className="hero__inner">
          <span className="hero__badge">
            <span className="hero__badge-dot"></span>
            به برگ دانش خوش آمدید
          </span>

          <h1 className="hero__title">
            دانش، یک
            <span className="hero__title-highlight">
              <LeafSVG className="hero__leaf" />
              برگ
            </span>
            فاصله دارد
          </h1>

          <p className="hero__subtitle">
            جزوه، کتاب، نمونه سوال و مقاله — همه در یک جا، رایگان و مرتب.
          </p>

          {!session?.user && <LoginAlert />}

          <form className="search" onSubmit={handleSubmit}>
            <input
              type="text"
              className="search__input"
              placeholder="چی می‌خوای پیدا کنی؟"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              🔍 جستجو
            </button>
          </form>

          {showResults && (
            <div
              style={{
                marginTop: "24px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  🔍 نتایج جستجو برای:{" "}
                  <span style={{ color: "var(--primary)" }}>{query}</span>
                </h3>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                >
                  ✕ بستن
                </button>
              </div>

              <div className="cards-grid">
                {results.length === 0 ? (
                  <p
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                      fontSize: "15px",
                    }}
                  >
                    نتیجه‌ای پیدا نشد 🔍
                  </p>
                ) : (
                  results.map((file, i) => (
                    <FileCard key={i} file={file} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}