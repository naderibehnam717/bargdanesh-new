"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function ProtectedDownloadButtons({
  downloadUrl,
  viewUrl,
  downloadName,
  fileTitle,
  fileType,
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const requireLogin = (e: React.MouseEvent) => {
    if (status === "loading") {
      e.preventDefault();
      return;
    }
    if (!session?.user) {
      e.preventDefault();
      router.push("/login");
      return;
    }

    // اگه لاگین کرد، دانلود رو ثبت کن
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

  return (
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
      {downloadUrl && (
        <a
          href={session?.user ? downloadUrl : "/login"}
          download={session?.user ? downloadName : undefined}
          onClick={requireLogin}
          className="btn btn--primary"
        >
          {session?.user ? `⬇️ دانلود ${fileType}` : `🔒 دانلود ${fileType}`}
        </a>
      )}

      {viewUrl && (
        <a
          href={session?.user ? toPreviewUrl(viewUrl) : "/login"}
          target={session?.user ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={requireLogin}
          className="btn btn--outline"
        >
          {session?.user ? "👁️ مشاهده آنلاین" : "🔒 مشاهده آنلاین"}
        </a>
      )}

      {status === "loading" && (
        <p style={{ color: "#999", fontSize: "14px" }}>در حال بارگذاری...</p>
      )}
    </div>
  );
}