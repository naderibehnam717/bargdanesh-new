import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFileBySlug, getFilesByType, getAllFiles } from "@/lib/files";
import { categoryContent, fileContent } from "@/lib/employmentContent";
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
    .filter((f) => f.type === "منابع استخدامی")
    .map((f) => ({ slug: f.slug }));
}

// ─── متادیتا ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  if (!file) {
    return { title: "صفحه یافت نشد" };
  }

  const url = `https://www.bargdanesh.ir/employment/${file.slug}`;
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
      `منابع استخدامی ${file.category}`,
      `آزمون استخدامی ${file.category}`,
      ...(file.author ? [file.author] : []),
    ],
    authors: file.author ? [{ name: file.author }] : [{ name: "برگ دانش" }],
  };
}

// ─── صفحه ───
export default async function EmploymentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  if (!file || file.type !== "منابع استخدامی") {
    notFound();
  }

  const allEmployment = await getFilesByType("منابع استخدامی");
  const related = allEmployment
    .filter((f) => f.category === file.category && f.slug !== file.slug)
    .slice(0, 3);

  const url = `https://www.bargdanesh.ir/employment/${file.slug}`;

  // ─── محتوا: اول مخصوص منبع، بعد مخصوص دسته ───
  const content =
    fileContent[file.slug] ||
    categoryContent[file.category] || {
      intro:
        "این منبع استخدامی با هدف کمک به داوطلبان آزمون‌های استخدامی تهیه شده. محتواش ساده، خلاصه و نکته‌محوره.",
      why: "استفاده از منابع خلاصه و نکته‌محور، یکی از مؤثرترین روش‌های آمادگی برای آزمون‌های استخدامیه.",
      concerns: [],
    };

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "منابع استخدامی", href: "/employment" },
    { label: file.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: file.title,
    description: file.desc,
    inLanguage: "fa-IR",
    learningResourceType: "منابع استخدامی",
    ...(file.author && { author: { "@type": "Person", name: file.author } }),
    ...(file.category && { about: file.category }),
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

              {file.author && (
                <>
                  <dt style={{ fontWeight: 600 }}>منبع / نویسنده:</dt>
                  <dd>{file.author}</dd>
                </>
              )}
            </dl>

            {/* ─── معرفی ─── */}
            <div style={{ marginBottom: "32px", lineHeight: 2 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>
                📋 درباره‌ی این منبع {file.category}
              </h2>
              <p style={{ color: "#444" }}>{content.intro}</p>
              <p style={{ color: "#444", marginTop: "12px" }}>{file.desc}</p>
            </div>

            {/* ─── چرا این منبع ─── */}
            <div style={{ marginBottom: "32px", lineHeight: 2 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>
                ✨ چرا این منبع را مطالعه کنیم؟
              </h2>
              <p style={{ color: "#444" }}>{content.why}</p>
            </div>

            {/* ─── دغدغه‌ها ─── */}
            {content.concerns.length > 0 && (
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
                    marginBottom: "16px",
                    color: "#1a1a1a",
                  }}
                >
                  💭 شاید این حس‌ها برات آشنا باشه
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {content.concerns.map((concern, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 16px",
                        background: "#fff",
                        borderRadius: "10px",
                        borderRight: "3px solid #7c3aed",
                        color: "#444",
                        fontSize: "14.5px",
                        lineHeight: 1.9,
                      }}
                    >
                      {concern}
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    marginTop: "16px",
                    marginBottom: 0,
                    color: "#0066cc",
                    fontWeight: 600,
                    fontSize: "14.5px",
                  }}
                >
                  🌱 اگه هر کدوم از اینا برات آشناست، بدون تنها نیستی. با آمادگی درست، قبولی کاملاً ممکنه.
                </p>
              </div>
            )}

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