import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
      return { title: "صفحه یافت نشد" };
    }

    const url = `https://www.bargdanesh.ir/subject/${category.slug}`;
    const title = `${category.title} — دانلود جزوه و منابع`;
    const description =
      category.description ||
      `دانلود رایگان جزوه و منابع ${category.title} از برگ دانش`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        locale: "fa_IR",
        siteName: "برگ دانش",
        images: [
          {
            url: "/android-chrome-512x512.png",
            width: 512,
            height: 512,
            alt: category.title,
          },
        ],
      },
      keywords: [
        category.title,
        `جزوه ${category.title}`,
        `دانلود ${category.title}`,
        `منابع ${category.title}`,
        "برگ دانش",
      ],
    };
  } catch {
    return { title: "صفحه یافت نشد" };
  }
}

function getCategoryGradient(slug: string): string {
  const gradients: Record<string, string> = {
    physics: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    chemistry: "linear-gradient(135deg, #10b981, #059669)",
    computer: "linear-gradient(135deg, #2563eb, #1e40af)",
    psychology: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    education: "linear-gradient(135deg, #059669, #047857)",
    sociology: "linear-gradient(135deg, #e11d48, #be123c)",
    islamic: "linear-gradient(135deg, #f59e0b, #d97706)",
    english: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    math: "linear-gradient(135deg, #2563eb, #1e40af)",
    science: "linear-gradient(135deg, #10b981, #059669)",
    literature: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    arabic: "linear-gradient(135deg, #e11d48, #9f1239)",
    religious: "linear-gradient(135deg, #f59e0b, #b45309)",
    social: "linear-gradient(135deg, #eab308, #ca8a04)",
    book: "linear-gradient(135deg, #2563eb, #1e40af)",
    novel: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    story: "linear-gradient(135deg, #10b981, #059669)",
    play: "linear-gradient(135deg, #e11d48, #be123c)",
    poem: "linear-gradient(135deg, #eab308, #ca8a04)",
  };
  return gradients[slug] || "linear-gradient(135deg, #2563eb, #7c3aed)";
}

// ─── انیمیشن حرف به حرف ───
function AnimatedWord({
  text,
  baseDelay = 0,
}: {
  text: string;
  baseDelay?: number;
}) {
  return (
    <span style={{ display: "inline-block", direction: "ltr" }}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translateY(-20px)",
            animation: `letterDrop 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
              baseDelay + index * 0.08
            }s forwards`,
            color: "#fff",
            textShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontWeight: 900,
            fontSize: "52px",
            letterSpacing: "4px",
            fontFamily: "Vazirmatn, sans-serif",
            marginRight: "4px",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params;

  let category;
  try {
    category = await prisma.category.findUnique({ where: { slug } });
  } catch {
    notFound();
  }

  if (!category || !category.isActive) {
    notFound();
  }

  const allFiles = await getAllFiles();
  const files = allFiles.filter((f) => f.category === category!.title);

  const fileTypes = [...new Set(files.map((f) => f.type))];
  const fileTypeCounts = fileTypes.map((type) => ({
    type,
    count: files.filter((f) => f.type === type).length,
  }));

  let related: { slug: string; title: string; icon: string }[] = [];
  try {
    related = await prisma.category.findMany({
      where: {
        group: category.group,
        isActive: true,
        slug: { not: slug },
      },
      orderBy: { order: "asc" },
      take: 6,
      select: { slug: true, title: true, icon: true },
    });
  } catch {
    related = [];
  }

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    {
      label:
        category.group === "university"
          ? "دانشگاهی"
          : category.group === "school"
          ? "مدرسه‌ای"
          : category.group === "book"
          ? "منابع غیر درسی"
          : "دسته‌بندی‌ها",
      href:
        category.group === "university"
          ? "/university"
          : category.group === "school"
          ? "/school"
          : category.group === "book"
          ? "/books"
          : "/",
    },
    { label: category.title },
  ];

  const gradient = getCategoryGradient(category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description || `منابع ${category.title}`,
    inLanguage: "fa-IR",
    url: `https://www.bargdanesh.ir/subject/${category.slug}`,
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

      {/* ─── Hero اختصاصی با انیمیشن ─── */}
      <section
        style={{
          position: "relative",
          padding: "80px 0 60px",
          background: gradient,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* ─── ذرات شناور ─── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {[
            { top: "10%", right: "8%", delay: "0s", size: "28px" },
            { top: "30%", right: "15%", delay: "-1.5s", size: "24px" },
            { top: "65%", right: "10%", delay: "-3s", size: "26px" },
            { top: "15%", left: "8%", delay: "-0.5s", size: "30px" },
            { top: "45%", left: "12%", delay: "-2s", size: "22px" },
            { top: "75%", left: "18%", delay: "-3.5s", size: "24px" },
          ].map((pos, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: pos.top,
                right: (pos as { right?: string }).right,
                left: (pos as { left?: string }).left,
                fontSize: pos.size,
                opacity: 0.5,
                animation: `floatEmoji 6s ease-in-out infinite ${pos.delay}`,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
              }}
            >
              {i % 2 === 0 ? category!.icon : "✨"}
            </span>
          ))}
        </div>

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          {/* ─── آیکون ─── */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "96px",
              height: "96px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "28px",
              fontSize: "52px",
              marginBottom: "24px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              animation:
                "iconPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              opacity: 0,
            }}
          >
            {category.icon}
          </div>

          {/* ─── عنوان انگلیسی با انیمیشن حرف به حرف ─── */}
          <div
            style={{
              marginBottom: "16px",
              minHeight: "64px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AnimatedWord
              text={category.slug.toUpperCase().replace(/-/g, " ")}
              baseDelay={0.3}
            />
          </div>

          {/* ─── عنوان فارسی ─── */}
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 900,
              margin: "0 0 16px",
              lineHeight: 1.3,
              textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              opacity: 0,
              animation: "fadeInUp 0.8s ease 0.8s forwards",
            }}
          >
            {category.title}
          </h1>

          <p
            style={{
              fontSize: "16px",
              opacity: 0,
              margin: "0 0 28px",
              lineHeight: 1.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              animation: "fadeInUp 0.8s ease 1s forwards",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {category.description ||
              `تمامی منابع و جزوه‌های مربوط به ${category.title}`}
          </p>

          {/* ─── آمار ─── */}
          <div
            style={{
              display: "inline-flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "14px 22px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              opacity: 0,
              animation: "fadeInUp 0.8s ease 1.2s forwards",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📁 {files.length} فایل
            </span>
            {fileTypeCounts.map((ft) => (
              <span
                key={ft.type}
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingRight: "12px",
                  borderRight: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {ft.type === "جزوه"
                  ? "📄"
                  : ft.type === "کتاب"
                  ? "📖"
                  : "📝"}{" "}
                {ft.count} {ft.type}
              </span>
            ))}
          </div>
        </div>

        {/* ─── انیمیشن‌ها ─── */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes letterDrop {
                from {
                  opacity: 0;
                  transform: translateY(-30px) rotate(-10deg);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) rotate(0deg);
                }
              }
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes iconPop {
                0% {
                  opacity: 0;
                  transform: scale(0.3) rotate(-20deg);
                }
                60% {
                  transform: scale(1.1) rotate(5deg);
                }
                100% {
                  opacity: 1;
                  transform: scale(1) rotate(0);
                }
              }
              @keyframes floatEmoji {
                0%, 100% {
                  transform: translateY(0) rotate(-5deg) scale(1);
                }
                50% {
                  transform: translateY(-18px) rotate(8deg) scale(1.15);
                }
              }
            `,
          }}
        />
      </section>

      <main className="section">
        <div className="container">
          <div className="layout-with-sidebar">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      margin: 0,
                      marginBottom: "4px",
                      color: "var(--text)",
                    }}
                  >
                    📚 فایل‌های {category.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-soft)",
                      margin: 0,
                    }}
                  >
                    {files.length} فایل موجود
                  </p>
                </div>
              </div>

              <div className="cards-grid">
                {files.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "#f8fafc",
                      borderRadius: "16px",
                      border: "1px dashed #cbd5e1",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                      📭
                    </div>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#64748b",
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      هنوز فایلی در این دسته اضافه نشده است
                    </p>
                  </div>
                ) : (
                  files.map((file, i) => <FileCard key={i} file={file} />)
                )}
              </div>
            </div>

            <aside className="sidebar">
              {related.length > 0 && (
                <>
                  <h3 className="sidebar__title">🔗 موضوعات مرتبط</h3>
                  <ul className="sidebar__list">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/subject/${r.slug}`}
                          className="sidebar__link"
                        >
                          {r.icon} {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3
                className="sidebar__title"
                style={{ marginTop: related.length > 0 ? "24px" : 0 }}
              >
                📂 دسترسی سریع
              </h3>
              <ul className="sidebar__list">
                <li>
                  <Link href="/university" className="sidebar__link">
                    🎓 همه‌ی موضوعات دانشگاهی
                  </Link>
                </li>
                <li>
                  <Link href="/school" className="sidebar__link">
                    🏫 همه‌ی موضوعات مدرسه‌ای
                  </Link>
                </li>
                <li>
                  <Link href="/books" className="sidebar__link">
                    📖 منابع غیر درسی
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}