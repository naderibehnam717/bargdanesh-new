import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "منابع آزمون‌های استخدامی — دانلود رایگان جزوه و نمونه سوال",
  description:
    "دانلود رایگان منابع آزمون‌های استخدامی — جزوه دروس عمومی، منابع تخصصی، نمونه سوالات و دفترچه‌های راهنما برای استخدام در بانک‌ها، آموزش و پرورش، وزارتخانه‌ها و سازمان‌های دولتی — برگ دانش",
  keywords: [
    "منابع استخدامی",
    "آزمون استخدامی",
    "دانلود منابع استخدامی",
    "جزوه استخدامی",
    "نمونه سوال استخدامی",
    "منابع آزمون بانک",
    "منابع آزمون آموزش و پرورش",
    "منابع آزمون دولتی",
    "دروس عمومی استخدامی",
    "دفترچه راهنمای استخدامی",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/employment",
  },
  openGraph: {
    title: "منابع آزمون‌های استخدامی | برگ دانش",
    description:
      "دانلود رایگان منابع آزمون‌های استخدامی — جزوه، نمونه سوال و دفترچه راهنما",
    url: "https://www.bargdanesh.ir/employment",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "منابع استخدامی برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منابع آزمون‌های استخدامی | برگ دانش",
    description:
      "دانلود رایگان منابع آزمون‌های استخدامی — جزوه، نمونه سوال و دفترچه راهنما",
    images: ["/android-chrome-512x512.png"],
  },
};

const faqs = [
  {
    question: "منابع استخدامی برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی منابع استخدامی برگ دانش شامل جزوه‌ها، نمونه سوالات و دفترچه‌های راهنما به صورت کاملاً رایگان قابل دانلود هستند.",
  },
  {
    question: "منابع استخدامی شامل چه دروسی می‌شود؟",
    answer:
      "منابع استخدامی برگ دانش شامل دروس عمومی (ادبیات فارسی، معارف، زبان انگلیسی، ریاضی و آمار) و دروس تخصصی بر اساس رشته و سازمان استخدامی است.",
  },
  {
    question: "آیا نمونه سوالات آزمون‌های استخدامی سال‌های گذشته موجود است؟",
    answer:
      "بله، برگ دانش نمونه سوالات آزمون‌های استخدامی سال‌های گذشته را همراه با پاسخ‌نامه ارائه می‌دهد. این سوالات برای آشنایی با ساختار آزمون بسیار مفید هستند.",
  },
  {
    question: "منابع استخدامی برای کدام سازمان‌ها مناسب است؟",
    answer:
      "منابع استخدامی برگ دانش برای آمادگی در آزمون‌های استخدامی بانک‌ها، آموزش و پرورش، وزارتخانه‌ها، سازمان‌های دولتی، شرکت‌های خصوصی و نیروهای مسلح مناسب هستند.",
  },
  {
    question: "چطور می‌توانم منابع استخدامی دانلود کنم؟",
    answer:
      "برای دانلود، روی کارت منبع مورد نظر کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید. در صورت نیاز به ورود، با ایمیل خود ثبت‌نام کنید.",
  },
  {
    question: "آیا جزوه‌های استخدامی به‌روز هستند؟",
    answer:
      "بله، تمامی منابع استخدامی برگ دانش بر اساس آخرین تغییرات و سرفصل‌های آزمون‌های استخدامی به‌روزرسانی می‌شوند.",
  },
];

export default async function EmploymentPage() {
  const allFiles = await getAllFiles();
  const files = allFiles.filter((f) => f.type === "منابع استخدامی");

  return (
    <>
      <section className="subject-hero" data-subject="employment">
        <div className="container">
          <AnimatedTitle
            text="EMPLOYMENT"
            emojis={["📋", "📝", "💼", "🎯", "🏢", "📊", "🎓", "✨"]}
          />
          <p className="subject-hero__subtitle">منابع آزمون‌های استخدامی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">
              📖 درباره‌ی منابع آزمون‌های استخدامی
            </h2>
            <p className="subject-intro__text">
              آزمون‌های استخدامی یکی از مسیرهای اصلی ورود به بازار کار در ایران
              هستند. این آزمون‌ها برای استخدام در دستگاه‌های اجرایی، بانک‌ها،
              آموزش و پرورش، وزارتخانه‌ها و سایر سازمان‌های دولتی و خصوصی برگزار
              می‌شوند و منابع مطالعاتی مشخصی دارند.
            </p>
            <p className="subject-intro__text">
              در این بخش، منابع اختصاصی برگ دانش برای آمادگی در آزمون‌های
              استخدامی شامل جزوه‌های دروس عمومی، منابع تخصصی، نمونه سوالات و
              دفترچه‌های راهنما در اختیار شما قرار دارد.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              منابع استخدامی شامل:
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
                lineHeight: 2,
              }}
            >
              <li>
                <strong>دروس عمومی</strong> — ادبیات فارسی، معارف، زبان
                انگلیسی، ریاضی و آمار
              </li>
              <li>
                <strong>دروس تخصصی</strong> — بر اساس رشته و سازمان استخدامی
              </li>
              <li>
                <strong>نمونه سوالات آزمون‌های سال‌های گذشته</strong>
              </li>
              <li>
                <strong>دفترچه‌های راهنمای آزمون‌های استخدامی</strong>
              </li>
              <li>
                <strong>جزوه‌های نکته‌محور</strong> برای آمادگی سریع
              </li>
            </ul>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              برای کدام سازمان‌ها؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
                lineHeight: 2,
              }}
            >
              <li>🏦 بانک‌ها و مؤسسات مالی</li>
              <li>🎓 آموزش و پرورش</li>
              <li>🏛️ وزارتخانه‌ها و سازمان‌های دولتی</li>
              <li>💼 شرکت‌های خصوصی و دولتی</li>
              <li>🚔 نیروهای مسلح و انتظامی</li>
            </ul>

            <p style={{ marginBottom: "0", color: "#444", lineHeight: 2 }}>
              اگر به دنبال <strong>منابع دانشگاهی</strong> یا{" "}
              <strong>نمونه سوالات امتحانی</strong> هستید، می‌توانید به بخش‌های{" "}
              <Link
                href="/university"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                دانشگاهی
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

          <div
            className="section__header"
            style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
          >
            <h2 className="section__title">📚 منابع استخدامی</h2>
            <p className="section__subtitle">منابع اختصاصی برگ دانش</p>
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
                📚 هنوز منبعی اضافه نشده است. به‌زودی...
              </p>
            ) : (
              files.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره منابع استخدامی" />
      <FAQSchema faqs={faqs} />
    </>
  );
}