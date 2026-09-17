"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { FileItem } from "@/lib/files";

interface FileCardProps {
  file: FileItem;
}

export default function FileCard({ file }: FileCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <article className="content-card">
      <span className={`content-card__badge content-card__badge--${file.color}`}>
        {file.category}
      </span>

      <h3 className="content-card__title">{file.title}</h3>

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
            onClick={requireLogin}
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