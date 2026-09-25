import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── SSG: ساخت صفحه برای همه‌ی دسته‌ها ───
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

// ─── متادیتا ───
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

// ─── صفحه ───
export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params;

  // ─── دسته رو از دیتابیس بگیر ───
  let category;
  try {
    category = await prisma.category.findUnique({ where: { slug } });
  } catch {
    notFound();
  }

  if (!category || !category.isActive) {
    notFound();
  }

  // ─── فایل‌های این دسته ───
  const allFiles = await getAllFiles();
  const files = allFiles.filter((f) => f.category === category!.title);

  // ─── مرتبط: دسته‌های دیگه‌ی همون گروه ───
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

      {/* ─── Hero ─── */}
      <section className="subject-hero">
        <div className="container">
          <AnimatedTitle
            text={category.slug.toUpperCase().replace(/-/g, " ")}
            emojis={[category.icon, "✨", category.icon, "🌟", category.icon, "💫"]}
          />
          <p className="subject-hero__subtitle">
            {category.icon} {category.title}
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {/* ─── معرفی ─── */}
          <div className="subject-intro">
            <h2 className="subject-intro__title">
              📖 درباره‌ی {category.title}
            </h2>
            <p className="subject-intro__text">
              {category.description ||
                `تمامی منابع و جزوه‌های مربوط به ${category.title} در این بخش به‌صورت رایگان در اختیار شما قرار دارد.`}
            </p>
            <p className="subject-intro__text">
              در این بخش، {files.length} فایل آموزشی شامل جزوه، کتاب و نمونه
              سوال موجود است. همه‌ی این فایل‌ها به‌صورت رایگان قابل دانلود
              هستند.
            </p>
          </div>

          <div className="layout-with-sidebar">
            {/* ─── لیست فایل‌ها ─── */}
            <div>
              <div
                className="section__header"
                style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
              >
                <h2 className="section__title">
                  📚 فایل‌های {category.title}
                </h2>
                <p className="section__subtitle">
                  {files.length} فایل موجود
                </p>
              </div>

              <div className="cards-grid">
                {files.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                      gridColumn: "1 / -1",
                    }}
                  >
                    هنوز فایلی در این دسته اضافه نشده است
                  </p>
                ) : (
                  files.map((file, i) => <FileCard key={i} file={file} />)
                )}
              </div>
            </div>

            {/* ─── سایدبار ─── */}
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