"use client";

import { useEffect, useState } from "react";

interface QuizData {
  id: string;
  question: string;
  options: string[];
  category: string;
  level: string;
  totalAttempts: number;
  correctAttempts: number;
}

interface AnswerResult {
  isCorrect: boolean;
  correctIdx: number;
  explanation: string | null;
  totalAttempts: number;
  correctAttempts: number;
}

// ─── آدم فکرکننده SVG ───
function ThinkingPerson() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "80px",
        height: "80px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
      }}
    >
      {/* حباب فکر */}
      <circle cx="95" cy="25" r="4" fill="#fff" opacity="0.9" />
      <circle cx="105" cy="15" r="6" fill="#fff" opacity="0.9" />
      <ellipse cx="112" cy="5" rx="10" ry="7" fill="#fff" opacity="0.9" />

      {/* علامت سوال توی حباب */}
      <text
        x="112"
        y="9"
        textAnchor="middle"
        fontSize="10"
        fontWeight="900"
        fill="#7c3aed"
      >
        ?
      </text>

      {/* سر */}
      <circle cx="55" cy="45" r="22" fill="#fbbf24" />
      <circle cx="55" cy="45" r="22" fill="url(#headShadow)" opacity="0.4" />

      {/* چشم‌ها */}
      <circle cx="48" cy="42" r="2.5" fill="#1f2937" />
      <circle cx="62" cy="42" r="2.5" fill="#1f2937" />

      {/* ابروها (فکرکننده) */}
      <path
        d="M44 36 Q 48 33, 52 36"
        stroke="#1f2937"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M58 34 Q 62 32, 66 35"
        stroke="#1f2937"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* دهان (متفکر) */}
      <path
        d="M50 55 Q 55 53, 60 55"
        stroke="#1f2937"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* بدن */}
      <path
        d="M35 90 Q 35 70, 55 70 Q 75 70, 75 90 Z"
        fill="#fbbf24"
      />
      <path
        d="M35 90 Q 35 70, 55 70 Q 75 70, 75 90 Z"
        fill="url(#bodyShadow)"
        opacity="0.3"
      />

      {/* دست زیر چانه (فکرکننده) */}
      <path
        d="M55 70 Q 55 75, 50 78 Q 45 80, 45 72"
        stroke="#f59e0b"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* گرادیانت‌ها */}
      <defs>
        <radialGradient id="headShadow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="bodyShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DailyQuiz() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isNext, setIsNext] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/quiz/today", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setQuiz(data);
      } catch {
        // خطا
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function loadNext() {
    setIsNext(true);
    setSelected(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/quiz/random", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuiz(data);
    } catch {
      // خطا
    } finally {
      setLoading(false);
      setIsNext(false);
    }
  }

  async function handleAnswer(idx: number) {
    if (result || !quiz || submitting) return;

    setSelected(idx);
    setSubmitting(true);

    try {
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.id, selectedIdx: idx }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch {
      // خطا
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !quiz) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
          borderRadius: "20px",
          padding: "40px 24px",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 102, 204, 0.25)",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <ThinkingPerson />
        </div>
        <p style={{ opacity: 0.9, fontSize: "14px", margin: 0 }}>
          ⏳ در حال آماده‌سازی سوال...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.85; }
          }
        `}</style>
      </div>
    );
  }

  const totalAttempts = result?.totalAttempts ?? quiz.totalAttempts;
  const correctAttempts = result?.correctAttempts ?? quiz.correctAttempts;
  const successRate =
    totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0066cc 0%, #7c3aed 60%, #a855f7 100%)",
        borderRadius: "20px",
        padding: "24px",
        color: "#fff",
        boxShadow: "0 10px 40px rgba(0, 102, 204, 0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* حباب‌های تزئینی */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "-20px",
          width: "80px",
          height: "80px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* هدر */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          gap: "8px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ width: "22px", height: "22px" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22h6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, lineHeight: 1.2 }}>
              {isNext ? "🎲 کوییز" : "🎯 کوییز روزانه"}
            </div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.85,
                marginTop: "2px",
              }}
            >
              {isNext ? "سوال تصادفی" : "هر روز یه سوال"}
            </div>
          </div>
        </div>
        <span
          style={{
            background: "rgba(255,255,255,0.22)",
            padding: "5px 12px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 700,
            backdropFilter: "blur(10px)",
          }}
        >
          {quiz.category}
        </span>
      </div>

      {/* سوال */}
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "16px",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.9,
            margin: 0,
            fontWeight: 600,
            textAlign: "right",
          }}
        >
          {quiz.question}
        </p>
      </div>

      {/* گزینه‌ها */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {quiz.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectAnswer = result && result.correctIdx === idx;
          const isWrongAnswer = result && isSelected && !result.isCorrect;

          let bg = "rgba(255,255,255,0.15)";
          let border = "1.5px solid rgba(255,255,255,0.25)";

          if (isCorrectAnswer) {
            bg = "rgba(16, 185, 129, 0.9)";
            border = "2px solid #fff";
          } else if (isWrongAnswer) {
            bg = "rgba(239, 68, 68, 0.9)";
            border = "2px solid #fff";
          } else if (isSelected) {
            bg = "rgba(255,255,255,0.35)";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={!!result || submitting}
              style={{
                background: bg,
                border: border,
                color: "#fff",
                padding: "13px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                textAlign: "right",
                cursor: result ? "default" : "pointer",
                transition: "all 0.25s ease",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                if (!result && !submitting) {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.28)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!result && !submitting) {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {["الف", "ب", "ج", "د"][idx]}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {isCorrectAnswer && <span style={{ fontSize: "18px" }}>✅</span>}
              {isWrongAnswer && <span style={{ fontSize: "18px" }}>❌</span>}
            </button>
          );
        })}
      </div>

      {/* نتیجه */}
      {result && (
        <>
          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              fontSize: "14px",
              lineHeight: 1.9,
              backdropFilter: "blur(10px)",
              position: "relative",
              zIndex: 1,
              animation: "fadeIn 0.4s ease",
            }}
          >
            <div
              style={{
                marginBottom: result.explanation ? "12px" : 0,
                fontWeight: 800,
                fontSize: "15px",
              }}
            >
              {result.isCorrect
                ? "🎉 آفرین! پاسخ درست بود"
                : "😔 ایش! پاسخ نادرست بود"}
            </div>
            {result.explanation && (
              <div
                style={{
                  opacity: 0.95,
                  fontSize: "13px",
                  paddingRight: "8px",
                  borderRight: "3px solid rgba(255,255,255,0.4)",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                }}
              >
                💡 {result.explanation}
              </div>
            )}
          </div>

          {/* آمار */}
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              fontSize: "13px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <div style={{ fontSize: "22px", fontWeight: 900 }}>
                {totalAttempts}
              </div>
              <div style={{ opacity: 0.85, fontSize: "12px" }}>
                👥 پاسخ داده
              </div>
            </div>
            <div
              style={{
                width: "1px",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <div>
              <div style={{ fontSize: "22px", fontWeight: 900 }}>
                {successRate}%
              </div>
              <div style={{ opacity: 0.85, fontSize: "12px" }}>
                ✅ درست
              </div>
            </div>
          </div>

          {/* دکمه‌ی سوال بعدی */}
          <button
            onClick={loadNext}
            disabled={isNext}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "13px",
              background: "#fff",
              color: "#0066cc",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 800,
              cursor: isNext ? "wait" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
              opacity: isNext ? 0.7 : 1,
              position: "relative",
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {isNext ? "⏳ در حال بارگذاری..." : "🔄 سوال بعدی"}
          </button>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}