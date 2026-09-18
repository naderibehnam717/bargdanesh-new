"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { FileItem } from "@/lib/files";
import { getFilePath } from "@/lib/filePath";

interface FileCardProps {
  file: FileItem;
}

export default function FileCard({ file }: FileCardProps) {
  const { data: session } = useSession();
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

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

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

  const detailPath = getFilePath(file);

  return (
    <article className="content-card">
      <Link href={detailPath} className="content-card__link" aria-label={`مشاهده ${file.title}`}>
        <span className={`content-card__badge content-card__badge--${file.color}`}>
          {file.category}
        </span>
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 className="content-card__title" style={{ flex: 1 }}>
          <Link href={detailPath} style={{ color: "inherit", textDecoration: "none" }}>
            {file.title}
          </Link>
        </h3>
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
        <Link href={detailPath} className="btn btn--primary btn--sm">
          مشاهده جزئیات
        </Link>

        {file.downloadUrl ? (
          <a
            href={file.downloadUrl}
            download={file.downloadName}
            onClick={async (e) => {
              if (!session?.user) {
                e.preventDefault();
                router.push("/login");
                return;
              }
              try {
                await fetch("/api/user/downloads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileTitle: file.title }),
                });
              } catch {
                // ignore
              }
            }}
            className="btn btn--outline btn--sm"
          >
            {session?.user ? "دانلود" : "🔒 دانلود"}
          </a>
        ) : null}
      </div>
    </article>
  );
}