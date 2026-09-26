"use client";

import { useState } from "react";
import Link from "next/link";
import FileCard from "./FileCard";
import LoginAlert from "./LoginAlert";
import { useSession } from "next-auth/react";
import type { FileItem } from "@/lib/files";

interface HeroProps {
  files: FileItem[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  href: string;
  badge: string;
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
        filter: "drop-shadow(0 8px 24px rgba(16, 185, 129, 0.4))",
      }}
    >
      <path
        d="M50 5 C 20 20, 5 50, 15 80 C 20 90, 30 95, 50 95 C 70 95, 80 90, 85 80 C 95 50, 80 20, 50 5 Z"
        fill="url(#leafGradient)"
        stroke="#2d7d46"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 10 L 50 90"
        stroke="#2d7d46"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();

    if (!q || q.length < 2) {
      setShowResults(false);
      return;
    }

    setLoading(true);
    setSearchedQuery(q);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results || []);
      setShowResults(true);
    } catch {
      setResults([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
      {/* ─── درخشش پس‌زمینه ─── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

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

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero__inner">
          {/* ─── Badge ─── */}
          <span
            className="hero__badge"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,247,255,0.95))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 8px 24px rgba(37, 99, 235, 0.12), 0 2px 6px rgba(0,0,0,0.04)",
              border: "1px solid rgba(37, 99, 235, 0.15)",
              animation: "fadeInDown 0.6s ease",
            }}
          >
            <span className="hero__badge-dot"></span>
            به برگ دانش خوش آمدید
          </span>

          {/* ─── عنوان ─── */}
          <h1
            className="hero__title"
            style={{
              animation: "fadeInUp 0.8s ease 0.1s backwards",
            }}
          >
            دانش، یک
            <span
              className="hero__title-highlight"
              style={{
                position: "relative",
                display: "inline-block",
                padding: "0 4px",
              }}
            >
              <LeafSVG className="hero__leaf" />
              برگ
              {/* ─── خط زیرین با گرادیانت ─── */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  right: 0,
                  height: "12px",
                  background:
                    "linear-gradient(90deg, rgba(251, 191, 36, 0.6), rgba(245, 158, 11, 0.8), rgba(251, 191, 36, 0.6))",
                  borderRadius: "100px",
                  zIndex: -1,
                  filter: "blur(0.5px)",
                }}
              />
            </span>
            فاصله دارد
          </h1>

          {/* ─── زیرعنوان ─── */}
          <p
            className="hero__subtitle"
            style={{
              animation: "fadeInUp 0.8s ease 0.2s backwards",
            }}
          >
            جزوه، کتاب، نمونه سوال و مقاله — همه در یک جا، رایگان و مرتب.
          </p>

          {!session?.user && <LoginAlert />}

          {/* ─── کادر جستجو ─── */}
          <form
            className="search"
            onSubmit={handleSubmit}
            style={{
              position: "relative",
              animation: "fadeInUp 0.8s ease 0.3s backwards",
              boxShadow: searchFocused
                ? "0 20px 50px rgba(37, 99, 235, 0.25), 0 0 0 4px rgba(37, 99, 235, 0.1)"
                : "0 12px 32px rgba(15, 23, 42, 0.10)",
              transition: "box-shadow 0.3s ease",
              borderRadius: "16px",
            }}
          >
            <input
              type="text"
              className="search__input"
              placeholder="چی می‌خوای پیدا کنی؟"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 20px rgba(37, 99, 235, 0.35)",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "⏳" : "🔍"} جستجو
            </button>
          </form>

          {/* ─── نتایج جستجو ─── */}
          {showResults && (
            <div
              style={{
                marginTop: "24px",
                textAlign: "right",
                animation: "fadeInUp 0.4s ease",
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
                  <span style={{ color: "var(--primary)" }}>{searchedQuery}</span>
                  {results.length > 0 && (
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginRight: "8px",
                        fontWeight: 400,
                      }}
                    >
                      ({results.length} نتیجه)
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  ✕ بستن
                </button>
              </div>

              {results.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                    fontSize: "15px",
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  نتیجه‌ای پیدا نشد 🔍
                  <br />
                  <span
                    style={{
                      fontSize: "13px",
                      marginTop: "8px",
                      display: "inline-block",
                    }}
                  >
                    یه کلمه دیگه امتحان کن یا هجی رو چک کن
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      style={{
                        display: "block",
                        background: "#fff",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid #e5e5e5",
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            background: "#f0f7ff",
                            color: "#0066cc",
                            padding: "3px 10px",
                            borderRadius: "100px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {item.badge}
                        </span>
                        <span style={{ fontSize: "11px", color: "#999" }}>
                          {item.category}
                        </span>
                      </div>
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1a1a1a",
                          marginBottom: "6px",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          margin: 0,
                          lineHeight: 1.7,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── انیمیشن‌ها ─── */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}