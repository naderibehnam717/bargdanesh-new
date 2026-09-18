import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFileBySlug, getFilesByType, allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── SSG ───
export function generateStaticParams() {
  return allFiles
    .filter((f) => f.type === "نمونه سوال")
    .map((f) => ({ slug: f.slug }));
}

// ─── متادیتا ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const file = getFileBySlug(slug);

  if (!file) {
    return { title: "صفحه یافت نشد" };
  }

  const url = `https://www.bargdanesh.ir/exams/${file.slug}`;
  const title = `${file.title} — دانلود رایگان`;
  const description = `${file.desc} | دانلود رایگان ${file.type} از برگ دانش`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "fa_IR",
      siteName: "برگ دانش",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: file.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/android-chrome-512x512.png"],
    },
    keywords: [
      file.title,
      file.category,
      file.type,
      `دانلود ${file.type}`,
      `نمونه سوال ${file.category}`,
      `آزمون ${file.category}`,
      ...(file.author ? [file.author] : []),
    ],
    authors: file.author ? [{ name: file.author }] : [{ name: "برگ دانش" }],
  };
}

// ─── صفحه ───
export default async function ExamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const file = getFileBySlug(slug);

  if (!file || file.type !== "نمونه سوال") {
    notFound();
  }

  const related = getFilesByType("نمونه سوال")
    .filter((f) => f.category === file.category && f.slug !== file.slug)
    .slice(0, 3);

  const url = `https://www.bargdanesh.ir/exams/${file.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: file.title,
    description: file.desc,
    inLanguage: "fa-IR",
    learningResourceType: "نمونه سوال",
    ...(file.author && { author: { "@type": "Person", name: file.author } }),
    ...(file.category && { about: file.category }),
    ...(file.level && { educationalLevel: file.level }),
    url,
    publisher: {
      "@type": "Organization",
      name: "برگ دانش",
      url: "https://www.bargdanesh.ir",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://www.bargdanesh.ir",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "نمونه سوال",
        item: "https://www.bargdanesh.ir/exams",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: file.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav
        aria-label="breadcrumb"
        className="container"
        style={{ padding: "16px 20px", fontSize: "14px", color: "#666" }}
      >
        <Link href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
          خانه
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/exams" style={{ color: "#0066cc", textDecoration: "none" }}>
          نمونه سوال
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span>{file.title}</span>
      </nav>

      <section className="page-header">
        <div className="container page-header__inner">
          <span className={`content-card__badge content-card__badge--${file.color}`}>
            {file.category}
          </span>
          <h1 className="page-header__title" style={{ marginTop: "12px" }}>
            {file.title}
          </h1>
          <p className="page-header__subtitle">{file.desc}</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              background: "#fff",
              padding: "32px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "12px 24px",
                marginBottom: "32px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <dt style={{ fontWeight: 600 }}>نوع:</dt>
              <dd>{file.type}</dd>

              <dt style={{ fontWeight: 600 }}>دسته‌بندی:</dt>
              <dd>{file.category}</dd>

              <dt style={{ fontWeight: 600 }}>مقطع:</dt>
              <dd>{file.level}</dd>

              {file.author && (
                <>
                  <dt style={{ fontWeight: 600 }}>منبع / طراح:</dt>
                  <dd>{file.author}</dd>
                </>
              )}
            </dl>

            <div style={{ marginBottom: "32px", lineHeight: 1.9 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
                درباره این {file.type}
              </h2>
              <p>{file.desc}</p>
              <p style={{ marginTop: "12px", color: "#555" }}>
                این {file.type} به صورت رایگان از سایت برگ دانش قابل دانلود است.
                برای دانلود، روی دکمه‌ی دانلود کلیک کنید.
              </p>
            </div>

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
              {file.downloadUrl && (
                <a
                  href={file.downloadUrl}
                  download={file.downloadName}
                  className="btn btn--primary"
                >
                  ⬇️ دانلود {file.type}
                </a>
              )}

              {file.viewUrl && (
                <a
                  href={file.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                >
                  👁️ مشاهده آنلاین
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      {related.length > 0 && (
        <section className="section" style={{ background: "#f8f9fa" }}>
          <div className="container">
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {file.type}های مرتبط
            </h2>
            <div className="cards-grid">
              {related.map((f) => (
                <FileCard key={f.slug} file={f} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}