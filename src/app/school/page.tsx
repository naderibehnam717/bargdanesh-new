import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import SchoolClient from "./SchoolClient";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "منابع مدرسه‌ای — دانلود رایگان جزوه و نمونه سوال",
  description:
    "دانلود رایگان جزوه، کتاب و نمونه سوال مقاطع مختلف مدرسه — دهم، یازدهم و دوازدهم. رشته‌های ریاضی، تجربی و انسانی در برگ دانش",
  keywords: [
    "جزوه مدرسه",
    "نمونه سوال مدرسه",
    "دانلود جزوه مدرسه رایگان",
    "نمونه سوال دهم",
    "نمونه سوال یازدهم",
    "نمونه سوال دوازدهم",
    "جزوه ریاضی دهم",
    "جزوه تجربی یازدهم",
    "جزوه انسانی دوازدهم",
    "منابع مدرسه‌ای",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/school",
  },
  openGraph: {
    title: "منابع مدرسه‌ای | برگ دانش",
    description:
      "دانلود رایگان جزوه، کتاب و نمونه سوال مقاطع مختلف مدرسه",
    url: "https://www.bargdanesh.ir/school",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "منابع مدرسه‌ای برگ دانش",
      },
    ],
  },
};

const faqs = [
  {
    question: "منابع مدرسه‌ای برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی جزوه‌ها، نمونه سوالات و منابع مدرسه‌ای برگ دانش به صورت کاملاً رایگان قابل دانلود هستند.",
  },
  {
    question: "منابع برای چه پایه‌هایی هستند؟",
    answer:
      "منابع مدرسه‌ای برگ دانش برای پایه‌های دهم، یازدهم و دوازدهم در تمامی رشته‌ها (ریاضی، تجربی، انسانی، فنی و حرفه‌ای و کار و دانش) تهیه شده‌اند.",
  },
  {
    question: "آیا می‌توانم فایل‌ها را بر اساس پایه و رشته فیلتر کنم؟",
    answer:
      "بله، در صفحه‌ی منابع مدرسه‌ای می‌توانید بر اساس پایه، رشته و درس، فایل‌های مورد نظر خود را فیلتر کنید.",
  },
  {
    question: "چه دروسی در برگ دانش موجود است؟",
    answer:
      "برگ دانش منابع دروس ریاضی، علوم تجربی (فیزیک، شیمی، زیست)، فارسی و ادبیات، عربی، دین و زندگی، قرآن، زبان انگلیسی و علوم اجتماعی را پوشش می‌دهد.",
  },
  {
    question: "چطور می‌توانم فایل‌ها را دانلود کنم؟",
    answer:
      "برای دانلود، روی کارت فایل مورد نظر کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید.",
  },
];

export default async function SchoolPage() {
  const allFiles = await getAllFiles();
  const schoolFiles = allFiles.filter((f) => f.level === "مدرسه ای");

  return (
    <>
      {/* ─── Hero ─── */}
      <section
        style={{
          position: "relative",
          padding: "60px 0 40px",
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "56px",
              marginBottom: "16px",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.2))",
            }}
          >
            🏫
          </div>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 900,
              margin: "0 0 12px",
              textShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            منابع مدرسه‌ای
          </h1>

          <p
            style={{
              fontSize: "15px",
              opacity: 0.95,
              margin: 0,
              lineHeight: 1.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            جزوه، کتاب و نمونه سوال برای دهم، یازدهم و دوازدهم — همه‌ی رشته‌ها
          </p>
        </div>
      </section>

      {/* ─── محتوای متنی (سئو) ─── */}
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
              دانلود رایگان منابع مدرسه‌ای
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>منابع مدرسه‌ای برگ دانش</strong> مرجعی کامل برای
              دانش‌آموزان پایه‌های <strong>دهم، یازدهم و دوازدهم</strong> در
              تمامی رشته‌ها است. در این بخش می‌توانید به{" "}
              <strong>جزوه‌های درسی، نمونه سوالات امتحانی و کتاب‌های کمک‌آموزشی</strong>{" "}
              دسترسی رایگان داشته باشید.
            </p>

            <p style={{ marginBottom: "0", color: "#444" }}>
              با استفاده از فیلترهای <strong>پایه</strong>، <strong>رشته</strong> و{" "}
              <strong>درس</strong>، می‌توانید سریع‌تر فایل مورد نظر خود را پیدا
              کنید. اگه به دنبال <strong>منابع دانشگاهی</strong> یا{" "}
              <strong>کتاب‌های غیر درسی</strong> هستید، به بخش‌های{" "}
              <Link
                href="/university"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                دانشگاهی
              </Link>{" "}
              و{" "}
              <Link
                href="/books"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                منابع غیر درسی
              </Link>{" "}
              مراجعه کنید.
            </p>
          </div>
        </div>
      </section>

      {/* ─── لیست فایل‌ها با فیلتر ─── */}
      <main className="section">
        <div className="container">
          <SchoolClient files={schoolFiles} />
        </div>
      </main>

      {/* ─── FAQ ─── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره منابع مدرسه‌ای" />
      <FAQSchema faqs={faqs} />
    </>
  );
}