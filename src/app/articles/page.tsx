import type { Metadata } from "next";
import Link from "next/link";
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
    description:
      "مقالات علمی، پژوهشی و آموزشی در رشته‌های مختلف دانشگاهی",
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
    description:
      "مقالات علمی، پژوهشی و آموزشی در رشته‌های مختلف دانشگاهی",
    images: ["/android-chrome-512x512.png"],
  },
};

// ─── FAQ ───
const faqs = [
  {
    question: "مقالات برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی مقالات موجود در برگ دانش به صورت کاملاً رایگان قابل مطالعه و دانلود هستند. برای دانلود، کافی است روی دکمه‌ی دانلود هر مقاله کلیک کنید.",
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
    question: "کی مقالات جدید اضافه می‌شود؟",
    answer:
      "مقالات جدید به صورت مستمر به برگ دانش اضافه می‌شوند. برای اطلاع از مقالات جدید، می‌توانید از طریق ایمیل یا شبکه‌های اجتماعی برگ دانش را دنبال کنید.",
  },
  {
    question: "آیا مقالات دارای منابع معتبر هستند؟",
    answer:
      "بله، تمامی مقالات برگ دانش دارای منابع معتبر و ارجاعات علمی هستند. این مقالات از مجلات علمی معتبر و پایگاه‌های داده‌ی بین‌المللی گردآوری می‌شوند.",
  },
];

export default function ArticlesPage() {
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
      <section className="section">
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
              بخش <strong>مقالات برگ دانش</strong> به زودی مرجعی کامل از{" "}
              <strong>مقالات علمی، پژوهشی و آموزشی</strong> در رشته‌های مختلف
              دانشگاهی و مدرسه‌ای خواهد بود. در این بخش می‌توانید به مقالات
              تحلیلی، ترجمه‌ی مقالات برتر و خلاصه‌ی پژوهش‌های علمی دسترسی
              داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              مقالات این بخش برای <strong>دانشجویان، پژوهشگران و علاقه‌مندان به
              علم</strong> تهیه می‌شوند و شامل موضوعات متنوعی از جمله
              روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی، جامعه‌شناسی و
              سایر رشته‌ها می‌باشند. هدف ما ایجاد بستری برای{" "}
              <strong>ترویج دانش و پژوهش</strong> در بین دانشجویان ایرانی است.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              موضوعات مقالات (به‌زودی):
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>مقالات روانشناسی</strong> — نظریه‌ها، پژوهش‌ها و
                کاربردها
              </li>
              <li>
                <strong>مقالات علوم تربیتی</strong> — روش‌های نوین آموزش و
                یادگیری
              </li>
              <li>
                <strong>مقالات کامپیوتر و فناوری</strong> — برنامه‌نویسی، هوش
                مصنوعی و شبکه
              </li>
              <li>
                <strong>مقالات علمی-پژوهشی</strong> — ترجمه و خلاصه مقالات
                برتر
              </li>
              <li>
                <strong>مقالات آموزشی</strong> — نکات و راهکارهای یادگیری
                مؤثر
              </li>
            </ul>

            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  marginBottom: "0",
                  color: "#856404",
                  fontSize: "15px",
                }}
              >
                📝 <strong>به‌زودی مقالات علمی و پژوهشی به این بخش اضافه
                خواهد شد.</strong>
              </p>
            </div>

            <p style={{ marginTop: "20px", marginBottom: "0", color: "#444" }}>
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

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره مقالات" />
      <FAQSchema faqs={faqs} />
    </>
  );
}