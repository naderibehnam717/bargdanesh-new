import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "نمونه سوال امتحانی — دانلود رایگان دانشگاهی و مدرسه‌ای",
  description:
    "دانلود رایگان نمونه سوالات امتحانی دانشگاهی و مدرسه‌ای. سوالات استاندارد پایان‌ترم، میان‌ترم و امتحانات هماهنگ کشوری — برگ دانش",
  keywords: [
    "نمونه سوال امتحانی",
    "نمونه سوال دانشگاهی",
    "نمونه سوال مدرسه",
    "دانلود نمونه سوال رایگان",
    "سوالات امتحان پایان ترم",
    "سوالات میان ترم",
    "نمونه سوال کنکور",
    "سوالات امتحانات نهایی",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/exams",
  },
  openGraph: {
    title: "نمونه سوال امتحانی | برگ دانش",
    description:
      "دانلود رایگان نمونه سوالات امتحانی دانشگاهی و مدرسه‌ای",
    url: "https://www.bargdanesh.ir/exams",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "نمونه سوال برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نمونه سوال امتحانی | برگ دانش",
    description:
      "دانلود رایگان نمونه سوالات امتحانی دانشگاهی و مدرسه‌ای",
    images: ["/android-chrome-512x512.png"],
  },
};

const faqs = [
  {
    question: "نمونه سوالات برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی نمونه سوالات دانشگاهی و مدرسه‌ای برگ دانش به صورت کاملاً رایگان قابل دانلود هستند. برای دانلود، کافی است روی دکمه‌ی دانلود هر سوال کلیک کنید.",
  },
  {
    question: "نمونه سوالات شامل پاسخ‌نامه هم می‌شوند؟",
    answer:
      "بله، اکثر نمونه سوالات برگ دانش همراه با پاسخ‌نامه تشریحی یا کلید سوالات ارائه می‌شوند. این موضوع در صفحه‌ی جزئیات هر نمونه سوال مشخص شده است.",
  },
  {
    question: "نمونه سوالات برای چه مقاطعی هستند؟",
    answer:
      "برگ دانش نمونه سوالات هر دو مقطع دانشگاهی و مدرسه‌ای (از ابتدایی تا متوسطه‌ی دوم) را ارائه می‌دهد. این سوالات شامل امتحانات میان‌ترم، پایان‌ترم و نهایی هستند.",
  },
  {
    question: "آیا نمونه سوالات مطابق با سرفصل‌های درسی هستند؟",
    answer:
      "بله، تمامی نمونه سوالات برگ دانش مطابق با سرفصل‌های مصوب کتاب‌های درسی تهیه شده‌اند و برای آمادگی در امتحانات بسیار مناسب هستند.",
  },
  {
    question: "چرا باید نمونه سوال حل کنم؟",
    answer:
      "حل نمونه سوال باعث می‌شود با ساختار سوالات امتحانی آشنا شوید، نقاط ضعف خود را شناسایی کنید، مدیریت زمان را تمرین کنید و نمره‌ی بهتری در امتحانات بگیرید.",
  },
  {
    question: "چطور می‌توانم نمونه سوال دانلود کنم؟",
    answer:
      "برای دانلود، روی کارت نمونه سوال مورد نظر کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید. در صورت نیاز به ورود، با ایمیل خود ثبت‌نام کنید.",
  },
];

export default async function ExamsPage() {
  const allFiles = await getAllFiles();
  const uniExams = allFiles.filter(
    (f) => f.type === "نمونه سوال" && f.level === "دانشگاهی"
  );
  const schoolExams = allFiles.filter(
    (f) => f.type === "نمونه سوال" && f.level === "مدرسه ای"
  );

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📝 نمونه سوال</h1>
          <p className="page-header__subtitle">
            آرشیو نمونه سوالات دانشگاهی و مدرسه ای
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
              دانلود رایگان نمونه سوالات امتحانی از برگ دانش
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>نمونه سوال برگ دانش</strong> مرجعی کامل از{" "}
              <strong>سوالات امتحانی استاندارد</strong> برای دانش‌آموزان و
              دانشجویان است. در این بخش می‌توانید به نمونه سوالات{" "}
              <strong>امتحانات پایان‌ترم، میان‌ترم و امتحانات نهایی</strong> در
              مقاطع مختلف تحصیلی دسترسی رایگان داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              تمامی <strong>نمونه سوالات امتحانی</strong> این بخش، همراه با
              پاسخ‌نامه یا کلید سوالات ارائه می‌شوند و به شما کمک می‌کنند تا با
              ساختار سوالات امتحانی آشنا شوید، نقاط ضعف خود را شناسایی کنید و
              برای امتحانات پیش‌رو آماده شوید. این سوالات برای{" "}
              <strong>آمادگی در امتحانات مدارس، دانشگاه‌ها و کنکور سراسری</strong>{" "}
              بسیار کاربردی هستند.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              نمونه سوالات موجود در این بخش:
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>نمونه سوال دانشگاهی</strong> — سوالات پایان‌ترم رشته‌های
                مختلف دانشگاهی
              </li>
              <li>
                <strong>نمونه سوال مدرسه‌ای</strong> — سوالات امتحانات پایه‌های
                مختلف مدرسه
              </li>
              <li>
                <strong>سوالات استاندارد</strong> — مطابق با سرفصل‌های درسی
                مصوب
              </li>
              <li>
                <strong>پاسخ‌نامه</strong> — همراه با پاسخ‌های تشریحی
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
              چرا نمونه سوال حل کنیم؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>📈 <strong>افزایش نمره</strong> با تمرین سوالات استاندارد</li>
              <li>🎯 <strong>شناسایی نقاط ضعف</strong> و تقویت آن‌ها</li>
              <li>⏰ <strong>مدیریت زمان</strong> در جلسه‌ی امتحان</li>
              <li>💡 <strong>آشنایی با ساختار سوالات</strong> اساتید مختلف</li>
            </ul>

            <p style={{ marginBottom: "0", color: "#444" }}>
              اگر به دنبال <strong>جزوه‌های درسی</strong> یا{" "}
              <strong>کتاب‌های دانشگاهی</strong> هستید، می‌توانید به بخش‌های{" "}
              <Link
                href="/university"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                دانشگاهی
              </Link>{" "}
              و{" "}
              <Link
                href="/school"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                مدرسه‌ای
              </Link>{" "}
              مراجعه کنید.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── لیست نمونه سوال‌ها ─────── */}
      <main className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">🎓 نمونه سوال دانشگاهی</h2>
          </div>

          <div className="cards-grid" style={{ marginBottom: "48px" }}>
            {uniExams.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  gridColumn: "1 / -1",
                }}
              >
                فایلی موجود نیست
              </p>
            ) : (
              uniExams.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>

          <div className="section__header">
            <h2 className="section__title">🏫 نمونه سوال مدرسه ای</h2>
          </div>

          <div className="cards-grid">
            {schoolExams.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  gridColumn: "1 / -1",
                }}
              >
                فایلی موجود نیست
              </p>
            ) : (
              schoolExams.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره نمونه سوالات امتحانی" />
      <FAQSchema faqs={faqs} />
    </>
  );
}