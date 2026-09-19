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

export default function DailyQuiz() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
          borderRadius: "16px",
          padding: "32px 24px",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0, 102, 204, 0.25)",
        }}
      >
        <p style={{ opacity: 0.8 }}>⏳ در حال بارگذاری...</p>
      </div>
    );
  }

  if (!quiz) {
    return null;
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
        background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
        borderRadius: "16px",
        padding: "24px",
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0, 102, 204, 0.25)",
      }}
    >
      {/* هدر */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "24px" }}>🎯</span>
          <strong style={{ fontSize: "16px" }}>کوییز روزانه</strong>
        </div>
        <span
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "4px 10px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {quiz.category}
        </span>
      </div>

      {/* سوال */}
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.9,
          marginBottom: "20px",
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {quiz.question}
      </p>

      {/* گزینه‌ها */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {quiz.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectAnswer = result && result.correctIdx === idx;
          const isWrongAnswer =
            result && isSelected && !result.isCorrect;

          let bg = "rgba(255,255,255,0.15)";
          let border = "1px solid rgba(255,255,255,0.25)";

          if (isCorrectAnswer) {
            bg = "rgba(16, 185, 129, 0.9)";
            border = "2px solid #fff";
          } else if (isWrongAnswer) {
            bg = "rgba(239, 68, 68, 0.9)";
            border = "2px solid #fff";
          } else if (isSelected) {
            bg = "rgba(255,255,255,0.3)";
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
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                textAlign: "right",
                cursor: result ? "default" : "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {["الف", "ب", "ج", "د"][idx]}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {isCorrectAnswer && <span>✅</span>}
              {isWrongAnswer && <span>❌</span>}
            </button>
          );
        })}
      </div>

      {/* نتیجه */}
      {result && (
        <>
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "10px",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                marginBottom: result.explanation ? "12px" : 0,
                fontWeight: 700,
              }}
            >
              {result.isCorrect ? "🎉 آفرین! پاسخ درست بود" : "😔 پاسخ نادرست بود"}
            </div>
            {result.explanation && (
              <div style={{ opacity: 0.95, fontSize: "13px" }}>
                💡 {result.explanation}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>
                {totalAttempts}
              </div>
              <div style={{ opacity: 0.8 }}>👥 پاسخ داده</div>
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>
                {successRate}%
              </div>
              <div style={{ opacity: 0.8 }}>✅ درست</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}