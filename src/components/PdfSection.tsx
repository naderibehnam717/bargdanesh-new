"use client";

import { useState } from "react";

interface PdfSectionProps {
  questionUrl?: string;
  answerUrl?: string;
  fileTitle: string;
}

// ─── تبدیل view به preview ───
function toPreviewUrl(url: string): string {
  if (!url) return url;
  if (url.includes("drive.google.com")) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }
  return url;
}

export default function PdfSection({
  questionUrl,
  answerUrl,
  fileTitle,
}: PdfSectionProps) {
  const [activeTab, setActiveTab] = useState<"question" | "answer">("question");
  const [isMobile, setIsMobile] = useState(false);

  // ─── تشخیص موبایل ───
  useState(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 900);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  });

  // ─── اگه فقط سوال داریم ───
  if (!answerUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e5e5",
          background: "#f8fafc",
        }}
      >
        <iframe
          src={toPreviewUrl(questionUrl || "")}
          title={fileTitle}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    );
  }

  // ─── موبایل: تب‌بندی ───
  if (isMobile) {
    return (
      <div>
        {/* ─── تب‌ها ─── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            padding: "6px",
            background: "#f1f5f9",
            borderRadius: "12px",
          }}
        >
          <button
            onClick={() => setActiveTab("question")}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background:
                activeTab === "question"
                  ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                  : "transparent",
              color: activeTab === "question" ? "#fff" : "#475569",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            📄 سوال
          </button>
          <button
            onClick={() => setActiveTab("answer")}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background:
                activeTab === "answer"
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "transparent",
              color: activeTab === "answer" ? "#fff" : "#475569",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            ✅ پاسخ
          </button>
        </div>

        {/* ─── PDF ─── */}
        <div
          style={{
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            background: "#f8fafc",
          }}
        >
          {activeTab === "question" ? (
            <iframe
              src={toPreviewUrl(questionUrl || "")}
              title={`${fileTitle} - سوال`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          ) : (
            <iframe
              src={toPreviewUrl(answerUrl)}
              title={`${fileTitle} - پاسخ`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // ─── دسکتاپ: دو تا PDF کنار هم ───
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >
      {/* ─── سوال ─── */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#fff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          📄 سوال
        </div>
        <div
          style={{
            width: "100%",
            height: "600px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            borderTop: "none",
            background: "#f8fafc",
          }}
        >
          <iframe
            src={toPreviewUrl(questionUrl || "")}
            title={`${fileTitle} - سوال`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ─── پاسخ ─── */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          ✅ پاسخ
        </div>
        <div
          style={{
            width: "100%",
            height: "600px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            borderTop: "none",
            background: "#f8fafc",
          }}
        >
          <iframe
            src={toPreviewUrl(answerUrl)}
            title={`${fileTitle} - پاسخ`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}