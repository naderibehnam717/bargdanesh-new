import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import BooksClient from "./BooksClient";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "منابع غیر درسی — دانلود رایگان کتاب، رمان و داستان",
  description:
    "دانلود رایگان کتاب، رمان، داستان، شعر و نمایشنامه از نویسندگان ایرانی و خارجی. آثار جلال آل‌احمد، ارنست همینگوی، جان اشتاین‌بک، زیگموند فروید و نویسندگان برجسته جهان — برگ دانش",
  keywords: [
    "دانلود کتاب رایگان",
    "دانلود رمان",
    "کتاب رایگان pdf",
    "رمان ایرانی",
    "رمان خارجی",
    "دانلود داستان",
    "شعر رایگان",
    "نمایشنامه",
    "منابع غیر درسی",
    "کتاب‌های کلاسیک",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/books",
  },
  openGraph: {
    title: "منابع غیر درسی | برگ دانش",
    description:
      "دانلود رایگان کتاب، رمان، داستان و شعر از نویسندگان برجسته ایران و جهان",
    url: "https://www.bargdanesh.ir/books",
    type: "website",
  },
};

const faqs = [
  {
    question: "کتاب‌های برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی کتاب‌ها، رمان‌ها و داستان‌های موجود در برگ دانش به صورت کاملاً رایگان قابل دانلود هستند. برای دانلود، کافی است روی دکمه‌ی دانلود هر کتاب کلیک کنید.",
  },
  {
    question: "چطور می‌توانم کتاب دانلود کنم؟",
    answer:
      "برای دانلود کتاب، ابتدا روی کارت کتاب کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید. در صورت نیاز به ورود، با ایمیل خود ثبت‌نام کنید.",
  },
  {
    question: "کتاب‌ها با چه فرمتی ارائه می‌شوند؟",
    answer:
      "تمامی کتاب‌ها، رمان‌ها و داستان‌های برگ دانش با فرمت PDF ارائه می‌شوند که در تمامی دستگاه‌ها (موبایل، تبلت و کامپیوتر) قابل مطالعه هستند.",
  },
  {
    question: "آیا کتاب‌ها ترجمه‌ی فارسی دارند؟",
    answer:
      "بله، تمامی کتاب‌های خارجی موجود در برگ دانش، ترجمه‌ی فارسی معتبر دارند. نام مترجم هر کتاب در صفحه‌ی جزئیات آن ذکر شده است.",
  },
  {
    question: "چه نویسندگانی در برگ دانش موجود هستند؟",
    answer:
      "برگ دانش آثاری از نویسندگان بزرگ ایرانی مانند جلال آل‌احمد و نویسندگان جهانی مثل ارنست همینگوی، جان اشتاین‌بک، زیگموند فروید، کلاریس لیسپکتور، کورت ونه‌گوت و اریک امانوئل اشمیت را ارائه می‌دهد.",
  },
  {
    question: "آیا می‌توانم کتاب‌ها را در گوشی موبایل مطالعه کنم؟",
    answer:
      "بله، تمامی کتاب‌ها با فرمت PDF هستند و در تمامی دستگاه‌های دارای PDF Reader از جمله گوشی‌های اندروید و آیفون قابل مطالعه هستند.",
  },
];

// ─── رنگ گرادیانت ───
const BOOKS_GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #8b5cf6 100%)";

export default async function BooksPage() {
  const allFiles = await getAllFiles();
  const books = allFiles.filter((f) => f.type === "منابع غیر درسی");

  const categories = [...new Set(books.map((f) => f.category))];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: books.filter((b) => b.category === cat).length,
  }));

  return (
    <>
      {/* ─── Hero گرادیانتی ─── */}
      <section
        style={{
          position: "relative",
          padding: "80px 0 60px",
          background: BOOKS_GRADIENT,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* ─── ذرات شناور ─── */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {[
            { top: "12%", right: "10%", delay: "0s", emoji: "📚" },
            { top: "35%", right: "18%", delay: "-1.5s", emoji: "📖" },
            { top: "65%", right: "12%", delay: "-3s", emoji: "✨" },
            { top: "18%", left: "10%", delay: "-0.5s", emoji: "📕" },
            { top: "50%", left: "15%", delay: "-2s", emoji: "🌿" },
            { top: "78%", left: "20%", delay: "-3.5s", emoji: "📗" },
          ].map((pos, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: pos.top,
                right: (pos as { right?: string }).right,
                left: (pos as { left?: string }).left,
                fontSize: "32px",
                opacity: 0.5,
                animation: `floatEmoji 6s ease-in-out infinite ${pos.delay}`,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            >
              {pos.emoji}
            </span>
          ))}
        </div>

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
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
            📚
          </div>

          {/* ─── عنوان ─── */}
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 900,
              margin: "0 0 16px",
              lineHeight: 1.3,
              textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              opacity: 0,
              animation: "fadeInUp 0.8s ease 0.3s forwards",
            }}
          >
            منابع غیر درسی
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
              animation: "fadeInUp 0.8s ease 0.5s forwards",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            کتاب، رمان، داستان، شعر و نمایشنامه — برای علاقه‌مندان به مطالعه
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
              animation: "fadeInUp 0.8s ease 0.7s forwards",
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
              📚 {books.length} فایل
            </span>
            {categoryCounts.map((cc) => (
  <span
    key={cc.name}
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
    {cc.name === "کتاب"
      ? "📖"
      : cc.name === "رمان"
      ? "🎭"
      : cc.name === "داستان"
      ? "✏️"
      : cc.name === "نمایشنامه"
      ? "🎬"
      : cc.name === "شعر"
      ? "🌿"
      : "📚"}{" "}
    {cc.count} {cc.name}
  </span>
))}
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes iconPop {
                0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
                60% { transform: scale(1.1) rotate(5deg); }
                100% { opacity: 1; transform: scale(1) rotate(0); }
              }
              @keyframes floatEmoji {
                0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
                50% { transform: translateY(-18px) rotate(8deg) scale(1.15); }
              }
            `,
          }}
        />
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
              دانلود رایگان کتاب، رمان و داستان از برگ دانش
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              مجموعه‌ی <strong>منابع غیر درسی برگ دانش</strong> شامل گلچینی از
              بهترین <strong>کتاب‌ها، رمان‌ها، داستان‌ها، شعرها و نمایشنامه‌های</strong>{" "}
              ایرانی و خارجی است. این آثار برای علاقه‌مندان به مطالعه‌ی آزاد،
              گسترش دانش عمومی و آشنایی با ادبیات کلاسیک و مدرن جهان گردآوری
              شده‌اند.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              در این بخش می‌توانید آثاری از نویسندگان بزرگ ایرانی مانند{" "}
              <strong>جلال آل‌احمد</strong> و نویسندگان برجسته‌ی جهانی مثل{" "}
              <strong>ارنست همینگوی</strong>، <strong>جان اشتاین‌بک</strong>،{" "}
              <strong>زیگموند فروید</strong>، <strong>کلاریس لیسپکتور</strong>،{" "}
              <strong>کورت ونه‌گوت</strong>، <strong>اریک امانوئل اشمیت</strong>{" "}
              و <strong>کاترین کرسمن تیلور</strong> را به صورت رایگان دانلود
              کنید.
            </p>

            <p style={{ marginBottom: "0", color: "#444" }}>
              اگر به دنبال <strong>جزوه‌های دانشگاهی</strong> یا{" "}
              <strong>نمونه سوال‌های امتحانی</strong> هستید، می‌توانید به بخش‌های{" "}
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
        </div>
      </section>

      {/* ─────── لیست کتاب‌ها ─────── */}
      <section className="section">
        <div className="container">
          <BooksClient books={books} />
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره کتاب‌های برگ دانش" />
      <FAQSchema faqs={faqs} />
    </>
  );
}