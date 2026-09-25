"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PdfViewer from "./PdfViewer";

interface Props {
  downloadUrl?: string;
  viewUrl?: string;
  downloadName?: string;
  fileTitle: string;
  fileType: string;
}

// ─── تبدیل view به preview ───
function toPreviewUrl(url: string): string {
  if (!url) return url;
  return url.replace("/view", "/preview");
}

// ─── تبدیل view به لینک دانلود ───
function toDownloadUrl(url: string): string {
  if (!url) return url;

  if (url.includes("drive.google.com")) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  return url;
}

export default function ProtectedDownloadButtons({
  downloadUrl,
  viewUrl,
  downloadName,
  fileTitle,
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ─── state برای نمایش PDF ───
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

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

  const handleDownload = async (e: React.MouseEvent) => {
    requireLogin(e);
    if (!session?.user) return;

    // ثبت دانلود
    try {
      fetch("/api/user/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileTitle }),
      });
    } catch {
      // ignore
    }
  };

  const openViewer = (e: React.MouseEvent, url: string) => {
    requireLogin(e);
    if (!session?.user) return;

    e.preventDefault();
    setViewerUrl(toPreviewUrl(url));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingTop: "20px",
          borderTop: "1px solid #eee",
        }}
      >
        {viewUrl && (
          <a
            href={session?.user ? toPreviewUrl(viewUrl) : "/login"}
            onClick={(e) => openViewer(e, viewUrl)}
            target={session?.user ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn btn--outline"
          >
            {session?.user ? "👁️ مشاهده آنلاین" : "🔒 مشاهده آنلاین"}
          </a>
        )}

        {downloadUrl && (
          <a
            href={session?.user ? toDownloadUrl(downloadUrl) : "/login"}
            download={session?.user ? downloadName : undefined}
            onClick={handleDownload}
            className="btn btn--primary"
          >
            {session?.user ? "⬇️ دانلود" : "🔒 دانلود"}
          </a>
        )}

        {status === "loading" && (
          <p style={{ color: "#999", fontSize: "14px" }}>در حال بارگذاری...</p>
        )}
      </div>

      {/* ─── PDF Viewer Modal ─── */}
      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={fileTitle}
          onClose={() => setViewerUrl(null)}
        />
      )}
    </>
  );
}