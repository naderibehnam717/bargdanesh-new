import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CommentSection from "@/components/CommentSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── SSG ───
export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

// ─── متادیتا ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article) {
    return { title: "مقاله یافت نشد" };
  }

  const url = `https://www.bargdanesh.ir/articles/${article.slug}`;
  const description = article.excerpt || article.content.slice(0, 160);

  return {
    title: `${article.title} | برگ دانش`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      type: "article",
      locale: "fa_IR",
      siteName: "برگ دانش",
      images: article.coverImage
        ? [{ url: article.coverImage }]
        : [
            {
              url: "/android-chrome-512x512.png",
              width: 512,
              height: 512,
              alt: article.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.coverImage
        ? [article.coverImage]
        : ["/android-chrome-512x512.png"],
    },
    keywords: [
      article.title,
      article.category || "",
      ...(article.tags ? article.tags.split(",").map((t) => t.trim()) : []),
    ].filter(Boolean),
    authors: article.author ? [{ name: article.author }] : [{ name: "برگ دانش" }],
  };
}

// ─── صفحه ───
export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article || !article.isPublished) {
    notFound();
  }

  // ─── افزایش بازدید ───
  try {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // ignore
  }

  // ─── مقالات مرتبط ───
  let related: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
  }[] = [];

  try {
    related = await prisma.article.findMany({
      where: {
        isPublished: true,
        id: { not: article.id },
        ...(article.category ? { category: article.category } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
      },
    });

    // اگه کمتر از ۳ تا بود، از بقیه پر کن
    if (related.length < 3) {
      const more = await prisma.article.findMany({
        where: {
          isPublished: true,
          id: { notIn: [article.id, ...related.map((r) => r.id)] },
        },
        orderBy: { createdAt: "desc" },
        take: 3 - related.length,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
        },
      });
      related = [...related, ...more];
    }
  } catch {
    related = [];
  }

  const url = `https://www.bargdanesh.ir/articles/${article.slug}`;

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "مقالات", href: "/articles" },
    { label: article.title },
  ];

  const toFaDate = (date: Date) =>
    new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.content.slice(0, 160),
    inLanguage: "fa-IR",
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    ...(article.author && { author: { "@type": "Person", name: article.author } }),
    ...(article.coverImage && { image: article.coverImage }),
    ...(article.category && { articleSection: article.category }),
    url,
    publisher: {
      "@type": "Organization",
      name: "برگ دانش",
      url: "https://www.bargdanesh.ir",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bargdanesh.ir/android-chrome-512x512.png",
      },
    },
  };

  const tags = article.tags
    ? article.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

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
          {article.category && (
            <span
              style={{
                background: "linear-gradient(135deg, #0066cc, #7c3aed)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              {article.category}
            </span>
          )}
          <h1 className="page-header__title" style={{ marginTop: "12px" }}>
            {article.title}
          </h1>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "16px",
              fontSize: "13px",
              color: "#666",
            }}
          >
            {article.author && <span>✍️ {article.author}</span>}
            <span>📅 {toFaDate(article.createdAt)}</span>
            <span>👁️ {article.viewCount} بازدید</span>
          </div>
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
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #e5e5e5",
            }}
          >
            {/* ─── عکس کاور ─── */}
            {article.coverImage && (
              <div
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "32px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            )}

            {/* ─── خلاصه ─── */}
            {article.excerpt && (
              <div
                style={{
                  padding: "16px 20px",
                  background: "#f0f7ff",
                  borderRadius: "10px",
                  borderRight: "4px solid #0066cc",
                  marginBottom: "32px",
                  fontSize: "15px",
                  lineHeight: 1.9,
                  color: "#444",
                }}
              >
                💡 {article.excerpt}
              </div>
            )}

            {/* ─── محتوا ─── */}
            <div
              style={{
                fontSize: "16px",
                lineHeight: 2.1,
                color: "#333",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {article.content}
            </div>

            {/* ─── برچسب‌ها ─── */}
            {tags.length > 0 && (
              <div
                style={{
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}
                >
                  🏷️ برچسب‌ها:
                </span>
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#f8f9fa",
                      color: "#444",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ─── دکمه‌های اشتراک‌گذاری ─── */}
            <div
              style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}
              >
                📤 اشتراک‌گذاری:
              </span>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 16px",
                  background: "#229ED9",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                تلگرام
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 16px",
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                واتساپ
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 16px",
                  background: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                توییتر
              </a>
            </div>
          </div>

          {/* ─── کامنت ─── */}
          <CommentSection fileSlug={`article-${article.slug}`} />
        </div>
      </main>

      {/* ─── مقالات مرتبط ─── */}
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
              📚 مقالات مرتبط
            </h2>
            <div className="cards-grid">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/articles/${r.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    overflow: "hidden",
                    textDecoration: "none",
                  }}
                >
                  {r.coverImage ? (
                    <div
                      style={{
                        width: "100%",
                        height: "120px",
                        background: `url(${r.coverImage}) center/cover`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "80px",
                        background:
                          "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                      }}
                    >
                      📄
                    </div>
                  )}
                  <div style={{ padding: "14px" }}>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}