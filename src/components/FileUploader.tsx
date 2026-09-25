"use client";

import { useRef, useState } from "react";

interface FileUploaderProps {
  onUploadSuccess: (url: string, filename: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
  currentUrl?: string | null;
}

export default function FileUploader({
  onUploadSuccess,
  accept = "image/*,application/pdf",
  label = "آپلود فایل",
  hint = "عکس (JPEG, PNG, WebP) یا PDF - حداکثر ۲۰ مگابایت",
  currentUrl,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setError("");
    setSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.details || "خطا در آپلود");
        return;
      }

      setSuccess(true);
      onUploadSuccess(data.url, file.name);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطای ناشناخته";
      setError(`خطا: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  const isImage = currentUrl?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);

  return (
    <div>
      {currentUrl && (
        <div
          style={{
            marginBottom: "12px",
            padding: "12px",
            background: "#f0f7ff",
            borderRadius: "10px",
            border: "1px solid #dbeafe",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt="preview"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#dbeafe",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                flexShrink: 0,
              }}
            >
              📄
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                color: "#0066cc",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              ✅ فایل فعلی
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "#666",
                wordBreak: "break-all",
                textDecoration: "underline",
                direction: "ltr",
                display: "block",
              }}
            >
              {currentUrl}
            </a>
          </div>
        </div>
      )}

      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? "2px dashed #0066cc" : "2px dashed #cbd5e1",
          background: dragActive ? "#f0f7ff" : "#f8fafc",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          transition: "all 0.2s ease",
          opacity: uploading ? 0.7 : 1,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={uploading}
        />

        {uploading ? (
          <div>
            <div
              style={{
                fontSize: "32px",
                marginBottom: "8px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              ⏳
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0066cc",
              }}
            >
              در حال آپلود... (منتظر بمانید)
            </div>
          </div>
        ) : success ? (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#10b981",
              }}
            >
              فایل با موفقیت آپلود شد!
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>
              {dragActive ? "📥" : "☁️"}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "4px",
              }}
            >
              {dragActive ? "فایل رو رها کن" : label}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{hint}</div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              یا کلیک کن
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: "8px",
            padding: "10px 14px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            fontSize: "12px",
            border: "1px solid #fca5a5",
            direction: "rtl",
            textAlign: "right",
            lineHeight: 1.8,
            wordBreak: "break-word",
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
}