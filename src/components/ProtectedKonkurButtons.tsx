"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function ProtectedKonkurButtons({
  questionUrl,
  answerUrl,
  title,
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
        borderTop: "1px solid #f0f0f0",
      }}
    >
      {questionUrl && (
        <a
          href={session?.user ? toPreviewUrl(questionUrl) : "/login"}
          target={session?.user ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={requireLogin}
          className="btn btn--primary"
          style={{ padding: "14px 28px", fontSize: "15px" }}
        >
          {session?.user ? "📄 مشاهده دفترچه سوالات" : "🔒 مشاهده دفترچه"}
        </a>
      )}

      {answerUrl && (
        <a
          href={session?.user ? toPreviewUrl(answerUrl) : "/login"}
          target={session?.user ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={requireLogin}
          className="btn btn--outline"
          style={{ padding: "14px 28px", fontSize: "15px" }}
        >
          {session?.user ? "✅ مشاهده کلید پاسخ" : "🔒 مشاهده کلید"}
        </a>
      )}

      {status === "loading" && (
        <p style={{ color: "#999", fontSize: "14px" }}>در حال بارگذاری...</p>
      )}
    </div>
  );
}