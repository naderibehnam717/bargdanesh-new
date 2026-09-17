"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { FileItem } from "@/lib/files";

interface FileCardProps {
  file: FileItem;
}

export default function FileCard({ file }: FileCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkFavorite();
    }
  }, [session]);

  async function checkFavorite() {
    try {
      const res = await fetch("/api/user/favorites");
      if (!res.ok) return;
      const favorites = await res.json();
      const found = favorites.some(
        (f: { fileTitle: string }) => f.fileTitle === file.title
      );
      setIsFavorite(found);
    } catch {
      // ignore
    }
  }

  async function toggleFavorite() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        const res = await fetch("/api/user/favorites");
        const favorites = await res.json();
        const fav = favorites.find(
          (f: { fileTitle: string; id: string }) => f.fileTitle === file.title
        );
        if (fav) {
          await fetch(`/api/user/favorites?id=${fav.id}`, { method: "DELETE" });
          setIsFavorite(false);
        }
      } else {
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileTitle: file.title }),
        });
        if (res.ok) setIsFavorite(true);
      }
    } catch {
      // ignore
    } finally {
      setFavLoading(false);
    }
  }

  function requireLogin(e: React.MouseEvent) {
    if (status === "loading") {
      e.preventDefault();
      return;
    }
    if (!session?.user) {
      e.preventDefault();
      router.push("/login");
    }
  }

  async function handleDownload(e: React.MouseEvent) {
    if (!session?.user) {
      e.preventDefault();
      router.push("/login");
      return;
    }

    // ثبت در تاریخچه دانلود
    try {
      await fetch("/api/user/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileTitle: file.title }),
      });
    } catch {
      // اگه ثبت نشد، ادامه می‌دیم
    }
  }

  return (
    <article className="content-card">
      <span className={`content-card__badge content-card__badge--${file.color}`}>
        {file.category}
      </span>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 className="content-card__title" style={{ flex: 1 }}>{file.title}</h3>
        {session?.user && (
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            aria-label="علاقه‌مندی"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              padding: "4px",
              opacity: favLoading ? 0.5 : 1,
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <p className="content-card__desc">{file.desc}</p>

      <div className="content-card__meta">
        <span>📎 {file.type}</span>
        {file.author && <span>✍️ {file.author}</span>}
      </div>

      <div className="content-card__footer">
        {file.viewUrl ? (
          <a
            href={file.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={requireLogin}
            className="btn btn--primary btn--sm"
          >
            {session?.user ? "مشاهده" : "🔒 مشاهده"}
          </a>
        ) : null}

        {file.downloadUrl ? (
          <a
            href={file.downloadUrl}
            download={file.downloadName}
            onClick={handleDownload}
            className="btn btn--outline btn--sm"
          >
            {session?.user ? "دانلود" : "🔒 دانلود"}
          </a>
        ) : null}

        {!file.viewUrl && !file.downloadUrl ? (
          <span style={{ color: "#999", fontSize: "13px" }}>به‌زودی...</span>
        ) : null}
      </div>
    </article>
  );
}