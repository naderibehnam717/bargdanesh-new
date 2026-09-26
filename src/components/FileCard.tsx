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

// ─── آیکون بر اساس نوع فایل ───
function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    "جزوه": "📄",
    "کتاب": "📖",
    "نمونه سوال": "📝",
    "منابع غیر درسی": "📚",
    "منابع استخدامی": "💼",
  };
  return icons[type] || "📁";
}

// ─── رنگ بر اساس type ───
function getTypeGradient(type: string): string {
  const gradients: Record<string, string> = {
    "جزوه": "linear-gradient(135deg, #2563eb, #7c3aed)",
    "کتاب": "linear-gradient(135deg, #10b981, #059669)",
    "نمونه سوال": "linear-gradient(135deg, #f59e0b, #d97706)",
    "منابع غیر درسی": "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    "منابع استخدامی": "linear-gradient(135deg, #e11d48, #be123c)",
  };
  return gradients[type] || "linear-gradient(135deg, #64748b, #475569)";
}

export default function FileCard({ file }: FileCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const typeIcon = getTypeIcon(file.type);
  const typeGradient = getTypeGradient(file.type);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        background: "var(--card)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(37, 99, 235, 0.15), 0 8px 16px rgba(0, 0, 0, 0.06)"
          : "0 1px 3px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* ─── نوار رنگی بالای کارت ─── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: typeGradient,
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ─── درخشش پشت کارت توی hover ─── */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ─── محتوا ─── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {/* ─── Badge + آیکون ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: typeGradient,
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "100px",
              boxShadow: isHovered
                ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                : "0 2px 6px rgba(37, 99, 235, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ fontSize: "13px" }}>{typeIcon}</span>
            {file.category}
          </span>

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
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        {/* ─── عنوان ─── */}
        <Link
          href={detailPath}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1.6,
              color: isHovered ? "var(--primary)" : "var(--text)",
              margin: 0,
              transition: "color 0.3s ease",
            }}
          >
            {file.title}
          </h3>
        </Link>

        {/* ─── توضیح ─── */}
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-soft)",
            lineHeight: 1.7,
            margin: 0,
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {file.desc}
        </p>

        {/* ─── متا ─── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "11px",
            color: "var(--text-muted)",
            paddingTop: "8px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--bg-alt)",
              padding: "3px 8px",
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            {typeIcon} {file.type}
          </span>
          {file.author && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "var(--bg-alt)",
                padding: "3px 8px",
                borderRadius: "6px",
                fontWeight: 600,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ✍️ {file.author}
            </span>
          )}
        </div>

        {/* ─── دکمه‌ها ─── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            paddingTop: "4px",
          }}
        >
          <Link
            href={detailPath}
            className="btn btn--primary btn--sm"
            style={{
              flex: 1,
              fontSize: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            مشاهده
          </Link>

          {file.downloadUrl && (
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
              style={{ fontSize: "12px" }}
            >
              {session?.user ? "⬇️ دانلود" : "🔒 دانلود"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}