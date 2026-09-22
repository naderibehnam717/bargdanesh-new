import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProtectedKonkurButtons from "@/components/ProtectedKonkurButtons";
import CommentSection from "@/components/CommentSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── متادیتا ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const konkur = await prisma.konkur.findUnique({ where: { slug } });

  if (!konkur) {
    return { title: "صفحه یافت نشد" };
  }

  const url = `https://www.bargdanesh.ir/konkur/${konkur.slug}`;
  const title = konkur.subtitle
    ? `${konkur.title} — ${konkur.subtitle}`
    : `${konkur.title} — دفترچه سوالات و کلید پاسخ`;
  const description = `دانلود رایگان ${konkur.subtitle || "دفترچه سوالات و کلید پاسخ"} ${konkur.title} از برگ دانش`;

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
          alt: konkur.title,
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
      konkur.title,
      konkur.subtitle || "",
      `کنکور ${konkur.year}`,
      `کنکور ${konkur.field}`,
      `دفترچه سوالات کنکور ${konkur.year}`,
      `کلید پاسخ کنکور ${konkur.year}`,
      `دانلود کنکور ${konkur.field}`,
    ].filter(Boolean),
  };
}

// ─── صفحه ───
export default async function KonkurDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const konkur = await prisma.konkur.findUnique({ where: { slug } });

  if (!konkur) {
    notFound();
  }

  const url = `https://www.bargdanesh.ir/konkur/${konkur.slug}`;

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "آرشیو کنکور", href: "/konkur" },
    { label: konkur.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: konkur.subtitle
      ? `${konkur.title} - ${konkur.subtitle}`
      : konkur.title,
    description:
      konkur.description ||
      `دفترچه سوالات و کلید پاسخ ${konkur.title}`,
    inLanguage: "fa-IR",
    learningResourceType: "آزمون کنکور",
    educationalLevel: "کنکور سراسری",
    ...(konkur.field && { about: konkur.field }),
    url,
    publisher: {
      "@type": "Organization",
      name: "برگ دانش",
      url: "https://www.bargdanesh.ir",
    },
  };

  const toFa = (n: number) =>
    String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

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
            کنکور {toFa(konkur.year)} — {konkur.field}
          </span>

          <h1 className="page-header__title" style={{ marginTop: "12px" }}>
            {konkur.title}
          </h1>

          {/* ✅ subtitle */}
          {konkur.subtitle && (
            <div
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "8px 20px",
                background: "#f0f7ff",
                color: "#0066cc",
                borderRadius: "100px",
                fontSize: "15px",
                fontWeight: 700,
                border: "2px solid #0066cc",
              }}
            >
              📌 {konkur.subtitle}
            </div>
          )}

          <p className="page-header__subtitle" style={{ marginTop: "12px" }}>
            دفترچه سوالات و کلید پاسخ — دانلود رایگان
          </p>
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
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "12px 24px",
                marginBottom: "32px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <dt style={{ fontWeight: 700 }}>📅 سال:</dt>
              <dd>{toFa(konkur.year)}</dd>

              <dt style={{ fontWeight: 700 }}>🎓 رشته:</dt>
              <dd>{konkur.field}</dd>

              {konkur.subtitle && (
                <>
                  <dt style={{ fontWeight: 700 }}>📌 عنوان:</dt>
                  <dd>{konkur.subtitle}</dd>
                </>
              )}

              <dt style={{ fontWeight: 700 }}>📚 نوع:</dt>
              <dd>کنکور سراسری</dd>
            </dl>

            {konkur.description ? (
              <div
                style={{
                  marginBottom: "32px",
                  lineHeight: 2,
                  color: "#444",
                  textAlign: "justify",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "12px",
                    color: "#1a1a1a",
                  }}
                >
                  درباره این آزمون
                </h2>
                <p style={{ margin: 0 }}>{konkur.description}</p>
              </div>
            ) : (
              <div
                style={{
                  marginBottom: "32px",
                  lineHeight: 2,
                  color: "#444",
                  textAlign: "justify",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "12px",
                    color: "#1a1a1a",
                  }}
                >
                  درباره این آزمون
                </h2>
                <p style={{ margin: 0 }}>
                  این بخش شامل دفترچه سوالات و کلید پاسخ{" "}
                  <strong>
                    {konkur.subtitle
                      ? `${konkur.title} (${konkur.subtitle})`
                      : konkur.title}
                  </strong>{" "}
                  است. با دانلود و مطالعه این فایل‌ها، می‌توانید با ساختار
                  سوالات کنکور سراسری در رشته‌ی{" "}
                  <strong>{konkur.field}</strong> و سطح دشواری آن‌ها آشنا شوید.
                </p>
              </div>
            )}

            <ProtectedKonkurButtons
              questionUrl={konkur.questionUrl}
              answerUrl={konkur.answerUrl}
              title={konkur.title}
            />
          </div>

          <div
            style={{
              maxWidth: "800px",
              margin: "32px auto 0",
              padding: "24px",
              background: "#f8f9fa",
              borderRadius: "16px",
              lineHeight: 2,
              textAlign: "justify",
              color: "#444",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              چرا حل سوالات کنکور سال‌های گذشته؟
            </h2>
            <ul style={{ paddingRight: "20px", margin: "0 0 16px" }}>
              <li>
                <strong>آشنایی با ساختار آزمون:</strong> با نوع سوالات و
                چیدمان آن‌ها آشنا می‌شوید
              </li>
              <li>
                <strong>مدیریت زمان:</strong> تمرین می‌کنید که در زمان محدود
                چطور سوالات را پاسخ دهید
              </li>
              <li>
                <strong>شناسایی نقاط ضعف:</strong> می‌فهمید کدام مباحث را
                باید بیشتر مطالعه کنید
              </li>
              <li>
                <strong>افزایش اعتماد به نفس:</strong> با تمرین کافی، در جلسه
                آزمون آرام‌تر خواهید بود
              </li>
            </ul>

            <p style={{ margin: 0 }}>
              در برگ دانش، <strong>دفترچه سوالات و کلید پاسخ</strong> کنکور
              سراسری سال‌های ۱۴۰۰ تا ۱۴۰۴ در تمامی رشته‌ها به صورت{" "}
              <strong>رایگان</strong> در دسترس شماست. برای مشاهده سایر آزمون‌ها
              به صفحه‌ی{" "}
              <Link
                href="/konkur"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                آرشیو کنکور
              </Link>{" "}
              مراجعه کنید.
            </p>
          </div>

          {/* ✅ کامنت‌ها */}
          <CommentSection fileSlug={`konkur-${konkur.slug}`} />
        </div>
      </main>
    </>
  );
}