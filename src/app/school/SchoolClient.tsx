"use client";

import { useState } from "react";
import Link from "next/link";
import FileCard from "@/components/FileCard";
import type { FileItem } from "@/lib/files";

interface SchoolClientProps {
  files: FileItem[];
}

const GRADES = ["دهم", "یازدهم", "دوازدهم"];

const GRADE_META: Record<string, { icon: string; color: string; gradient: string }> = {
  "دهم": {
    icon: "🌱",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  "یازدهم": {
    icon: "🌿",
    color: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb, #1e40af)",
  },
  "دوازدهم": {
    icon: "🎯",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
  },
};

const FIELDS = ["ریاضی", "تجربی", "انسانی", "فنی و حرفه‌ای", "کار و دانش"];

export default function SchoolClient({ files }: SchoolClientProps) {
  const [selectedField, setSelectedField] = useState("همه");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  // ─── دسته‌بندی‌های موجود ───
  const categories = [
    "همه",
    ...Array.from(new Set(files.map((f) => f.category))),
  ];

  // ─── فیلتر ───
  const filtered = files.filter((f) => {
    if (selectedField !== "همه" && f.field !== selectedField) return false;
    if (selectedCategory !== "همه" && f.category !== selectedCategory)
      return false;
    return true;
  });

  // ─── گروه‌بندی بر اساس پایه ───
  const groupedByGrade = GRADES.map((grade) => ({
    grade,
    files: filtered.filter((f) => f.grade === grade),
    meta: GRADE_META[grade],
  })).filter((g) => g.files.length > 0 || selectedField === "همه");

  // ─── فایل‌های بدون پایه ───
  const noGradeFiles = filtered.filter((f) => !f.grade);

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

        {GRADES.map((grade) => {
          const count = files.filter((f) => f.grade === grade).length;
          const meta = GRADE_META[grade];
          return (
            <div
              key={grade}
              style={{
                padding: "16px",
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                {meta.icon}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: meta.color,
                }}
              >
                {count}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                پایه {grade}
              </div>
            </div>
          );
        })}
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
        {/* ─── فیلتر رشته ─── */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#666",
              marginBottom: "10px",
            }}
          >
            🎓 رشته:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedField("همه")}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                border:
                  selectedField === "همه"
                    ? "2px solid #7c3aed"
                    : "1px solid #e5e5e5",
                background: selectedField === "همه" ? "#7c3aed" : "#fff",
                color: selectedField === "همه" ? "#fff" : "#475569",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              همه ({files.length})
            </button>
            {FIELDS.map((f) => {
              const count = files.filter((file) => file.field === f).length;
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
                  }}
                >
                  {f} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── فیلتر درس ─── */}
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#666",
              marginBottom: "10px",
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
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ─── دکمه ریست ─── */}
        {(selectedField !== "همه" || selectedCategory !== "همه") && (
          <button
            onClick={() => {
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
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {filtered.length === files.length
          ? `📚 همه‌ی ${files.length} فایل`
          : `🔍 ${filtered.length} فایل از ${files.length} فایل`}
      </div>

      {/* ─── گروه‌بندی بر اساس پایه ─── */}
      {groupedByGrade.length === 0 && noGradeFiles.length === 0 ? (
        <div
          style={{
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
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {groupedByGrade.map((group) => (
            <div key={group.grade}>
              {/* ─── هدر پایه ─── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                  paddingBottom: "14px",
                  borderBottom: `3px solid ${group.meta.color}`,
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: group.meta.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    boxShadow: `0 4px 12px ${group.meta.color}40`,
                  }}
                >
                  {group.meta.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      margin: 0,
                      color: "#1a1a1a",
                    }}
                  >
                    پایه {group.grade}
                  </h2>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {group.files.length} فایل
                  </div>
                </div>
              </div>

              {/* ─── فایل‌ها ─── */}
              <div className="cards-grid">
                {group.files.map((file, i) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>
            </div>
          ))}

          {/* ─── فایل‌های بدون پایه ─── */}
          {noGradeFiles.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                  paddingBottom: "14px",
                  borderBottom: "3px solid #94a3b8",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #64748b, #475569)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  📁
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      margin: 0,
                      color: "#1a1a1a",
                    }}
                  >
                    سایر منابع
                  </h2>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {noGradeFiles.length} فایل
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                {noGradeFiles.map((file, i) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}