"use client";

import { useEffect, useState } from "react";

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

// ─── تبدیل view به preview برای گوگل درایو ───
function toPreviewUrl(url: string): string {
  if (!url) return url;
  // اگه لینک گوگل درایو هست، از /preview استفاده کن
  if (url.includes("drive.google.com")) {
    return url.replace("/view", "/preview").replace(/\/edit.*$/, "/preview");
  }
  return url;
}

// ─── تبدیل لینک به حالت embed ───
function toEmbedUrl(url: string): string {
  if (!url) return url;

  // گوگل درایو
  if (url.includes("drive.google.com")) {
    const previewUrl = toPreviewUrl(url);
    // اگه /preview نداره، اضافه کن
    if (!previewUrl.includes("/preview") && !previewUrl.includes("/embed")) {
      const fileId = url.match(/\/d\/([^/]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return previewUrl;
  }

  return url;
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const embedUrl = toEmbedUrl(url);

  // ─── بستن با دکمه Escape ───
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    // ─── قفل کردن اسکرول body ───
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          height: "90vh",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          direction: "rtl",
        }}
      >
        {/* ─── هدر ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "14px 20px",
            background: "linear-gradient(135deg, #0066cc, #7c3aed)",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
              flex: 1,
            }}
          >
            <span style={{ fontSize: "20px", flexShrink: 0 }}>📄</span>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
              title="باز کردن در تب جدید"
            >
              🔗 باز کردن جدا
            </a>

            <button
              onClick={onClose}
              aria-label="بستن"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                fontSize: "18px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ─── بدنه: PDF ─── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "#f1f5f9",
            overflow: "hidden",
          }}
        >
          {isLoading && !hasError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid #e2e8f0",
                  borderTopColor: "#0066cc",
                  borderRadius: "50%",
                  animation: "pdfSpin 1s linear infinite",
                }}
              />
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                در حال بارگذاری فایل...
              </p>
            </div>
          )}

          {hasError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "48px" }}>😔</span>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "15px",
                  margin: 0,
                  lineHeight: 1.9,
                }}
              >
                متأسفانه فایل داخل سایت بارگذاری نشد.
                <br />
                لطفاً از دکمه‌ی «باز کردن جدا» استفاده کن.
              </p>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={title}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            allow="autoplay"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pdfSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}