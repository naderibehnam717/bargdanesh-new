"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PdfViewer from "./PdfViewer";

interface Props {
  questionUrl?: string | null;
  answerUrl?: string | null;
  title: string;
}

// ─── تبدیل view به preview ───
function toPreviewUrl(url: string): string {
  if (!url) return url;
  return url.replace("/view", "/preview");
}

// ─── تبدیل view به لینک دانلود ───
function toDownloadUrl(url: string): string {
  if (!url) return url;

  // اگه گوگل درایو هست، از لینک دانلود مستقیم استفاده کن
  if (url.includes("drive.google.com")) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  return url;
}

export default function ProtectedKonkurButtons({
  questionUrl,
  answerUrl,
  title,
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ─── state برای نمایش PDF ───
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>("");

  const requireLogin = (e: React.MouseEvent) => {
    if (status === "loading") {
      e.preventDefault();
      return;
    }
    if (!session?.user) {
      e.preventDefault();
      router.push("/login");
    }
  };

  const openViewer = (
    e: React.MouseEvent,
    url: string,
    label: string
  ) => {
    requireLogin(e);
    if (!session?.user) return;

    e.preventDefault();
    setViewerUrl(toPreviewUrl(url));
    setViewerTitle(`${title} — ${label}`);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          paddingTop: "20px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {/* ─── دفترچه سوالات ─── */}
        {questionUrl && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <a
              href={session?.user ? toPreviewUrl(questionUrl) : "/login"}
              onClick={(e) => openViewer(e, questionUrl, "دفترچه سوالات")}
              target={session?.user ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ padding: "14px 28px", fontSize: "15px" }}
            >
              {session?.user ? "📄 مشاهده دفترچه سوالات" : "🔒 مشاهده دفترچه"}
            </a>

            <a
              href={session?.user ? toDownloadUrl(questionUrl) : "/login"}
              download
              onClick={requireLogin}
              className="btn btn--outline"
              style={{ padding: "14px 28px", fontSize: "15px" }}
            >
              {session?.user ? "⬇️ دانلود دفترچه" : "🔒 دانلود دفترچه"}
            </a>
          </div>
        )}

        {/* ─── کلید پاسخ ─── */}
        {answerUrl && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <a
              href={session?.user ? toPreviewUrl(answerUrl) : "/login"}
              onClick={(e) => openViewer(e, answerUrl, "کلید پاسخ")}
              target={session?.user ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{
                padding: "14px 28px",
                fontSize: "15px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
              }}
            >
              {session?.user ? "✅ مشاهده کلید پاسخ" : "🔒 مشاهده کلید"}
            </a>

            <a
              href={session?.user ? toDownloadUrl(answerUrl) : "/login"}
              download
              onClick={requireLogin}
              className="btn btn--outline"
              style={{ padding: "14px 28px", fontSize: "15px" }}
            >
              {session?.user ? "⬇️ دانلود کلید" : "🔒 دانلود کلید"}
            </a>
          </div>
        )}

        {status === "loading" && (
          <p style={{ color: "#999", fontSize: "14px", textAlign: "center" }}>
            در حال بارگذاری...
          </p>
        )}
      </div>

      {/* ─── PDF Viewer Modal ─── */}
      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={viewerTitle}
          onClose={() => {
            setViewerUrl(null);
            setViewerTitle("");
          }}
        />
      )}
    </>
  );
}