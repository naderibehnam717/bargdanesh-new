"use client";

import { useState } from "react";
import Link from "next/link";
import FileCard from "@/components/FileCard";
import type { FileItem } from "@/lib/files";

interface SchoolClientProps {
  files: FileItem[];
}

const GRADES = ["همه", "دهم", "یازدهم", "دوازدهم"];
const FIELDS = ["همه", "ریاضی", "تجربی", "انسانی", "فنی و حرفه‌ای", "کار و دانش"];

export default function SchoolClient({ files }: SchoolClientProps) {
  const [selectedGrade, setSelectedGrade] = useState("همه");
  const [selectedField, setSelectedField] = useState("همه");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  // ─── دسته‌بندی‌های موجود ───
  const categories = [
    "همه",
    ...Array.from(new Set(files.map((f) => f.category))),
  ];

  // ─── فیلتر ───
  const filtered = files.filter((f) => {
    if (selectedGrade !== "همه" && f.grade !== selectedGrade) return false;
    if (selectedField !== "همه" && f.field !== selectedField) return false;
    if (selectedCategory !== "همه" && f.category !== selectedCategory)
      return false;
    return true;
  });

  // ─── آمار ───
  const gradeCounts = GRADES.slice(1).map((g) => ({
    grade: g,
    count: files.filter((f) => f.grade === g).length,
  }));

  const fieldCounts = FIELDS.slice(1).map((f) => ({
    field: f,
    count: files.filter((file) => file.field === f).length,
  }));

  return (
    <>
      {/* ─── آمار ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "16px",
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            borderRadius: "12px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>
            {files.length}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>
            📚 کل فایل‌ها
          </div>
        </div>

        {gradeCounts
          .filter((gc) => gc.count > 0)
          .map((gc) => (
            <div
              key={gc.grade}
              style={{
                padding: "16px",
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "#7c3aed",
                }}
              >
                {gc.count}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                پایه {gc.grade}
              </div>
            </div>
          ))}
      </div>

      {/* ─── فیلترها ─── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        {/* ─── فیلتر پایه ─── */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#666",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📚 پایه:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {GRADES.map((g) => {
              const count =
                g === "همه"
                  ? files.length
                  : files.filter((f) => f.grade === g).length;

              return (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    border:
                      selectedGrade === g
                        ? "2px solid #2563eb"
                        : "1px solid #e5e5e5",
                    background: selectedGrade === g ? "#2563eb" : "#fff",
                    color: selectedGrade === g ? "#fff" : "#475569",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  {g} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── فیلتر رشته ─── */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#666",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🎓 رشته:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FIELDS.map((f) => {
              const count =
                f === "همه"
                  ? files.length
                  : files.filter((file) => file.field === f).length;

              return (
                <button
                  key={f}
                  onClick={() => setSelectedField(f)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    border:
                      selectedField === f
                        ? "2px solid #7c3aed"
                        : "1px solid #e5e5e5",
                    background: selectedField === f ? "#7c3aed" : "#fff",
                    color: selectedField === f ? "#fff" : "#475569",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  {f} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── فیلتر دسته‌بندی (درس) ─── */}
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#666",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📖 درس:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border:
                    selectedCategory === c
                      ? "2px solid #10b981"
                      : "1px solid #e5e5e5",
                  background: selectedCategory === c ? "#10b981" : "#fff",
                  color: selectedCategory === c ? "#fff" : "#475569",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ─── دکمه ریست ─── */}
        {(selectedGrade !== "همه" ||
          selectedField !== "همه" ||
          selectedCategory !== "همه") && (
          <button
            onClick={() => {
              setSelectedGrade("همه");
              setSelectedField("همه");
              setSelectedCategory("همه");
            }}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              borderRadius: "100px",
              border: "1px solid #fca5a5",
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕ پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* ─── نتایج ─── */}
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {filtered.length === files.length
          ? `📚 همه‌ی ${files.length} فایل`
          : `🔍 ${filtered.length} فایل از ${files.length} فایل`}
      </div>

      {/* ─── لیست فایل‌ها ─── */}
      <div className="cards-grid">
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
              background: "#f8fafc",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                fontWeight: 600,
              }}
            >
              فایلی با این فیلترها پیدا نشد
            </p>
            <button
              onClick={() => {
                setSelectedGrade("همه");
                setSelectedField("همه");
                setSelectedCategory("همه");
              }}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              نمایش همه‌ی فایل‌ها
            </button>
          </div>
        ) : (
          filtered.map((file, i) => <FileCard key={i} file={file} />)
        )}
      </div>
    </>
  );
}