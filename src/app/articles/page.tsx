import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "مقالات علمی و پژوهشی — برگ دانش",
  description:
    "مقالات علمی، پژوهشی و آموزشی در رشته‌های مختلف دانشگاهی و مدرسه‌ای. مقالات تحلیلی، ترجمه و خلاصه مقالات برتر — برگ دانش",
  keywords: [
    "مقالات علمی",
    "مقالات پژوهشی",
    "مقالات دانشگاهی",
    "مقاله رایگان",
    "دانلود مقاله",
    "مقالات آموزشی",
    "مقالات رشته‌های مختلف",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/articles",
  },
  openGraph: {
    title: "مقالات علمی و پژوهشی | برگ دانش",
    description: "مقالات علمی، پژوهشی و آموزشی در رشته‌های مختلف دانشگاهی",
    url: "https://www.bargdanesh.ir/articles",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "مقالات برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مقالات علمی و پژوهشی | برگ دانش",
    description: "مقالات علمی، پژوهشی و آموزشی در رشته‌های مختلف دانشگاهی",
    images: ["/android-chrome-512x512.png"],
  },
};

const faqs = [
  {
    question: "مقالات برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی مقالات موجود در برگ دانش به صورت کاملاً رایگان قابل مطالعه و دانلود هستند. برای مطالعه، کافی است روی هر مقاله کلیک کنید.",
  },
  {
    question: "مقالات در چه زمینه‌هایی هستند؟",
    answer:
      "مقالات برگ دانش در زمینه‌های مختلف علمی و پژوهشی از جمله روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی، جامعه‌شناسی و سایر رشته‌های دانشگاهی تهیه می‌شوند.",
  },
  {
    question: "آیا مقالات ترجمه‌شده هم وجود دارند؟",
    answer:
      "بله، بخشی از مقالات برگ دانش، ترجمه‌ی فارسی مقالات معتبر بین‌المللی هستند که برای استفاده‌ی دانشجویان ایرانی ترجمه شده‌اند.",
  },
  {
    question: "مقالات برای چه کسانی مناسب هستند؟",
    answer:
      "مقالات برگ دانش برای دانشجویان، پژوهشگران، اساتید و علاقه‌مندان به علم و پژوهش در رشته‌های مختلف مناسب هستند. این مقالات برای نوشتن پایان‌نامه، پروپوزال و مقالات علمی مفید هستند.",
  },
  {
    question: "چطور مقالات جدید اضافه می‌شوند؟",
    answer:
      "مقالات جدید به صورت مستمر به برگ دانش اضافه می‌شوند. برای اطلاع از مقالات جدید، می‌توانید از طریق ایمیل یا شبکه‌های اجتماعی برگ دانش را دنبال کنید.",
  },
  {
    question: "آیا مقالات دارای منابع معتبر هستند؟",
    answer:
      "بله، تمامی مقالات برگ دانش دارای منابع معتبر و ارجاعات علمی هستند. این مقالات از مجلات علمی معتبر و پایگاه‌های داده‌ی بین‌المللی گردآوری می‌شوند.",
  },
];

export default async function ArticlesPage() {
  // ─── دریافت مقالات از دیتابیس ───
  let articles: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    tags: string | null;
    author: string | null;
    viewCount: number;
    createdAt: Date;
  }[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        author: true,
        viewCount: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Articles fetch error:", error);
  }

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📄 مقالات</h1>
          <p className="page-header__subtitle">
            مقالات علمی و پژوهشی در رشته‌های مختلف
          </p>
        </div>
      </section>

      {/* ─────── محتوای متنی (سئو) ─────── */}
      <section className="section" style={{ paddingBottom: "0" }}>
        <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "#f8f9fa",
              padding: "32px",
              borderRadius: "12px",
              lineHeight: 2,
              textAlign: "justify",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "16px",
                color: "#1a1a1a",
              }}
            >
              مقالات علمی و پژوهشی برگ دانش
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>مقالات برگ دانش</strong> مرجعی کامل از{" "}
              <strong>مقالات علمی، پژوهشی و آموزشی</strong> در رشته‌های مختلف
              دانشگاهی و مدرسه‌ای است. در این بخش می‌توانید به مقالات تحلیلی،
              ترجمه‌ی مقالات برتر و خلاصه‌ی پژوهش‌های علمی دسترسی داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              مقالات این بخش برای <strong>دانشجویان، پژوهشگران و علاقه‌مندان به
              علم</strong> تهیه می‌شوند و شامل موضوعات متنوعی از جمله
              روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی، جامعه‌شناسی و
              سایر رشته‌ها می‌باشند. هدف ما ایجاد بستری برای{" "}
              <strong>ترویج دانش و پژوهش</strong> در بین دانشجویان ایرانی است.
            </p>

            <p style={{ marginBottom: "0", color: "#444" }}>
              در این فاصله، می‌توانید به بخش‌های{" "}
              <Link
                href="/university"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                منابع دانشگاهی
              </Link>
              ،{" "}
              <Link
                href="/books"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                منابع غیر درسی
              </Link>{" "}
              و{" "}
              <Link
                href="/exams"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                نمونه سوال
              </Link>{" "}
              مراجعه کنید.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── لیست مقالات ─────── */}
      <main className="section">
        <div className="container">
          {articles.length === 0 ? (
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
                padding: "60px 20px",
                background: "#f8f9fa",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.9 }}>
                به‌زودی مقالات علمی و پژوهشی به این بخش اضافه خواهد شد.
              </p>
            </div>
          ) : (
            <>
              <div className="section__header">
                <h2 className="section__title">
                  📚 همه‌ی مقالات ({articles.length})
                </h2>
                <p className="section__subtitle">
                  جدیدترین مقالات برگ دانش
                </p>
              </div>

              <div className="cards-grid">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #e5e5e5",
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {article.coverImage ? (
                      <div
                        style={{
                          width: "100%",
                          height: "160px",
                          background: `url(${article.coverImage}) center/cover`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "120px",
                          background:
                            "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "42px",
                        }}
                      >
                        📄
                      </div>
                    )}

                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        flex: 1,
                      }}
                    >
                      {article.category && (
                        <span
                          style={{
                            alignSelf: "flex-start",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            padding: "3px 10px",
                            borderRadius: "100px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {article.category}
                        </span>
                      )}

                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1a1a1a",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            margin: 0,
                            lineHeight: 1.8,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1,
                          }}
                        >
                          {article.excerpt}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "11px",
                          color: "#999",
                          paddingTop: "10px",
                          borderTop: "1px solid #f0f0f0",
                          marginTop: "auto",
                        }}
                      >
                        {article.author && <span>✍️ {article.author}</span>}
                        <span>👁️ {article.viewCount}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <FAQ faqs={faqs} title="سوالات متداول درباره مقالات" />
      <FAQSchema faqs={faqs} />
    </>
  );
}