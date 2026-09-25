import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFileBySlug, getFilesByType, getAllFiles } from "@/lib/files";
import { categoryContent, authorBios } from "@/lib/bookContent";
import FileCard from "@/components/FileCard";
import ProtectedDownloadButtons from "@/components/ProtectedDownloadButtons";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CommentSection from "@/components/CommentSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── SSG ───
export async function generateStaticParams() {
  const allFiles = await getAllFiles();
  return allFiles
    .filter((f) => f.type === "منابع غیر درسی")
    .map((f) => ({ slug: f.slug }));
}

// ─── متادیتا ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  if (!file) {
    return { title: "صفحه یافت نشد" };
  }

  const url = `https://www.bargdanesh.ir/books/${file.slug}`;
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
      `دانلود ${file.category}`,
      ...(file.author ? [file.author] : []),
    ],
    authors: file.author ? [{ name: file.author }] : [{ name: "برگ دانش" }],
  };
}

// ─── صفحه ───
export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  if (!file || file.type !== "منابع غیر درسی") {
    notFound();
  }

  const allNonCourse = await getFilesByType("منابع غیر درسی");
  const related = allNonCourse
    .filter((f) => f.category === file.category && f.slug !== file.slug)
    .slice(0, 3);

  const url = `https://www.bargdanesh.ir/books/${file.slug}`;

  // ─── محتوای داینامیک ───
  const catContent = categoryContent[file.category] || {
    intro:
      "این کتاب یکی از آثار خواندنی و ارزشمند است که با قلمی روان نوشته شده و برای مطالعه‌ی آزاد مناسب می‌باشد.",
    why: "اگر به دنبال مطالعه‌ی کتابی هستید که هم سرگرم‌کننده باشد و هم نکات ارزشمندی به شما اضافه کند، این کتاب انتخاب مناسبی است.",
  };

  const authorBio = file.author ? authorBios[file.author] : null;

  // ─── Breadcrumb items ───
  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "منابع غیر درسی", href: "/books" },
    { label: file.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: file.title,
    description: file.desc,
    inLanguage: "fa-IR",
    bookFormat: "https://schema.org/EBook",
    ...(file.author && { author: { "@type": "Person", name: file.author } }),
    ...(file.category && { genre: file.category }),
    url,
    publisher: {
      "@type": "Organization",
      name: "برگ دانش",
      url: "https://www.bargdanesh.ir",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={breadcrumbItems} />
      <BreadcrumbSchema items={breadcrumbItems} />

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
                  <dt style={{ fontWeight: 600 }}>نویسنده:</dt>
                  <dd>{file.author}</dd>
                </>
              )}
            </dl>

            {/* ─── معرفی کتاب ─── */}
            <div style={{ marginBottom: "32px", lineHeight: 2 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>
                📖 درباره‌ی این {file.category}
              </h2>
              <p style={{ color: "#444" }}>{catContent.intro}</p>
              <p style={{ color: "#444", marginTop: "12px" }}>{file.desc}</p>
            </div>

            {/* ─── چرا بخونیم ─── */}
            <div style={{ marginBottom: "32px", lineHeight: 2 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>
                ✨ چرا این اثر را بخوانیم؟
              </h2>
              <p style={{ color: "#444" }}>{catContent.why}</p>
            </div>

            {/* ─── معرفی نویسنده ─── */}
            {authorBio && file.author && (
              <div
                style={{
                  marginBottom: "32px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #f0f7ff 0%, #f8f9fa 100%)",
                  borderRadius: "12px",
                  borderRight: "4px solid #0066cc",
                  lineHeight: 2,
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    marginBottom: "12px",
                    color: "#1a1a1a",
                  }}
                >
                  ✍️ درباره‌ی نویسنده: {file.author}
                </h2>
                <p style={{ color: "#444", margin: 0 }}>{authorBio}</p>
              </div>
            )}

            {/* ─── دانلود ─── */}
            <ProtectedDownloadButtons
              downloadUrl={file.downloadUrl}
              viewUrl={file.viewUrl}
              downloadName={file.downloadName}
              fileTitle={file.title}
              fileType={file.type}
            />
          </div>

          <CommentSection fileSlug={file.slug} />
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