import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StudentConcerns from "@/components/StudentConcerns";
import FileCard from "@/components/FileCard";
import StatsBox from "@/components/StatsBox";
import Countdown from "@/components/Countdown";
import QuotesSlider from "@/components/QuotesSlider";
import UsefulLinks from "@/components/UsefulLinks";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";
import { getAllFiles } from "@/lib/files";
import Link from "next/link";

export const metadata: Metadata = {
  title: "برگ دانش | دانلود رایگان جزوه، کتاب و نمونه سوال",
  description:
    "مرجع دانلود رایگان جزوه دانشگاهی، کتاب، نمونه سوال و مقاله. دسترسی آسان و سریع به هزاران منبع آموزشی با کیفیت برای دانشجویان و دانش‌آموزان — برگ دانش",
  keywords: [
    "دانلود جزوه",
    "جزوه دانشگاهی",
    "دانلود کتاب رایگان",
    "نمونه سوال",
    "دانلود نمونه سوال",
    "جزوه رایگان",
    "منابع دانشگاهی",
    "کتاب رایگان pdf",
    "جزوه کنکور",
    "مقاله رایگان",
    "برگ دانش",
    "دانلود جزوه روانشناسی",
    "دانلود جزوه کامپیوتر",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir",
  },
  openGraph: {
    title: "برگ دانش | دانلود رایگان جزوه، کتاب و نمونه سوال",
    description:
      "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله برای دانشجویان و دانش‌آموزان",
    url: "https://www.bargdanesh.ir",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "برگ دانش | دانلود رایگان جزوه، کتاب و نمونه سوال",
    description:
      "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله",
    images: ["/android-chrome-512x512.png"],
  },
};

// ─── FAQ ───
const faqs = [
  {
    question: "برگ دانش چیست؟",
    answer:
      "برگ دانش مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله برای دانشجویان و دانش‌آموزان است. تمامی فایل‌ها به صورت رایگان در اختیار کاربران قرار می‌گیرند.",
  },
  {
    question: "آیا دانلود فایل‌ها رایگان است؟",
    answer:
      "بله، تمامی جزوه‌ها، کتاب‌ها، نمونه سوالات و مقالات موجود در برگ دانش به صورت کاملاً رایگان قابل دانلود هستند. تنها کافی است در سایت ثبت‌نام کنید.",
  },
  {
    question: "چطور می‌توانم فایل دانلود کنم؟",
    answer:
      "برای دانلود، ابتدا در سایت ثبت‌نام کنید یا وارد شوید. سپس روی کارت فایل مورد نظر کلیک کنید و در صفحه‌ی جزئیات، دکمه‌ی دانلود را بزنید.",
  },
  {
    question: "چه دسته‌بندی‌هایی در برگ دانش موجود است؟",
    answer:
      "برگ دانش شامل دسته‌بندی‌های دانشگاهی (روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی و...)، مدرسه‌ای، نمونه سوال، منابع غیر درسی و منابع استخدامی است.",
  },
  {
    question: "فایل‌ها با چه فرمتی ارائه می‌شوند؟",
    answer:
      "تمامی فایل‌های برگ دانش با فرمت PDF ارائه می‌شوند که در تمامی دستگاه‌ها (موبایل، تبلت و کامپیوتر) قابل مطالعه هستند.",
  },
  {
    question: "آیا می‌توانم فایل‌ها را در گوشی موبایل مطالعه کنم؟",
    answer:
      "بله، تمامی فایل‌ها با فرمت PDF هستند و در گوشی‌های اندروید، آیفون و تبلت قابل مطالعه هستند.",
  },
];

// ─── دسته‌بندی‌ها ───
const categories = [
  {
    title: "دانشگاهی",
    desc: "جزوه‌های تمام رشته‌ها",
    icon: "🎓",
    href: "/university",
    color: "blue",
  },
  {
    title: "مدرسه‌ای",
    desc: "منابع تمام مقاطع",
    icon: "🏫",
    href: "/school",
    color: "green",
  },
  {
    title: "نمونه سوال",
    desc: "آرشیو سوالات امتحانی",
    icon: "📝",
    href: "/exams",
    color: "purple",
  },
  {
    title: "منابع غیر درسی",
    desc: "کتاب، رمان و داستان",
    icon: "📖",
    href: "/books",
    color: "orange",
  },
  {
    title: "منابع استخدامی",
    desc: "آمادگی آزمون‌های استخدامی",
    icon: "💼",
    href: "/employment",
    color: "rose",
  },
  {
    title: "مقالات",
    desc: "مقالات علمی و پژوهشی",
    icon: "📄",
    href: "/articles",
    color: "yellow",
  },
];

export default async function Home() {
  const allFiles = await getAllFiles();
  const latestFiles = [...allFiles].reverse().slice(0, 4);

  return (
    <>
      {/* ✅ Hero */}
      <Hero files={allFiles} />

      {/* ─────── دسته‌بندی‌ها ─────── */}
      <section className="section">
        <div className="container">
          <div
            className="section__header"
            style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", maxWidth: "700px" }}
          >
            <h2 className="section__title">📁 دسته‌بندی‌های برگ دانش</h2>
            <p className="section__subtitle">
              منبع مورد نظرت رو سریع پیدا کن
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                style={{
                  display: "block",
                  padding: "24px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                  {cat.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: "4px",
                  }}
                >
                  {cat.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── بخش اصلی ─────── */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="layout-with-sidebar">
            <div>
              <div className="section__header">
                <h2 className="section__title">چرا برگ دانش؟</h2>
                <p className="section__subtitle">چیزی که ما را متفاوت می‌کند</p>
              </div>

              <StudentConcerns />

              <div className="features" style={{ marginBottom: "48px" }}>
                <div className="feature">
                  <div className="feature__icon">⚡</div>
                  <h3 className="feature__title">دسترسی سریع</h3>
                  <p className="feature__desc">
                    در کمترین زمان فایل مورد نظرت را پیدا کن.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🎯</div>
                  <h3 className="feature__title">محتوای باکیفیت</h3>
                  <p className="feature__desc">
                    همه فایل‌ها با دقت انتخاب شده‌اند.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🆓</div>
                  <h3 className="feature__title">کاملاً رایگان</h3>
                  <p className="feature__desc">
                    دانلود تمام فایل‌ها بدون هزینه.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🔄</div>
                  <h3 className="feature__title">به‌روزرسانی مداوم</h3>
                  <p className="feature__desc">
                    هر هفته فایل‌های جدید اضافه می‌شود.
                  </p>
                </div>
              </div>

              <div
                className="section__header"
                style={{
                  textAlign: "right",
                  marginLeft: 0,
                  maxWidth: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2 className="section__title">🆕 آخرین فایل‌های اضافه‌شده</h2>
                  <p className="section__subtitle">تازه‌ترین منابع برگ دانش</p>
                </div>
                <Link href="/university" className="btn btn--outline btn--sm">
                  مشاهده همه →
                </Link>
              </div>

              <div className="cards-grid" style={{ marginBottom: "48px" }}>
                {latestFiles.map((file, i) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>

              <StatsBox />
            </div>

            <aside className="sidebar">
              <Countdown />
              <QuotesSlider />
              <UsefulLinks />
            </aside>
          </div>
        </div>
      </section>

      {/* ─────── چطور کار می‌کند؟ ─────── */}
      <section className="section">
        <div className="container">
          <div
            className="section__header"
            style={{
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "700px",
            }}
          >
            <h2 className="section__title">🎯 چطور از برگ دانش استفاده کنم؟</h2>
            <p className="section__subtitle">
              فقط ۳ مرحله ساده — سریع و رایگان
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #0066cc, #7c3aed)",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 700,
                  margin: "0 auto 16px",
                }}
              >
                ۱
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#1a1a1a",
                }}
              >
                ثبت‌نام کن
              </h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.8 }}>
                با ایمیل خود در چند ثانیه ثبت‌نام کن. ثبت‌نام کاملاً رایگانه.
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #0066cc, #7c3aed)",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 700,
                  margin: "0 auto 16px",
                }}
              >
                ۲
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#1a1a1a",
                }}
              >
                فایل مورد نظرت رو پیدا کن
              </h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.8 }}>
                از بین هزاران جزوه، کتاب و نمونه سوال، فایل مورد نظرت رو انتخاب
                کن.
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #0066cc, #7c3aed)",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 700,
                  margin: "0 auto 16px",
                }}
              >
                ۳
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#1a1a1a",
                }}
              >
                رایگان دانلود کن
              </h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.8 }}>
                روی دکمه‌ی دانلود کلیک کن و فایل PDF رو رایگان دریافت کن.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── محتوای متنی (سئو) ─────── */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "12px",
              lineHeight: 2,
              textAlign: "justify",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "16px",
                color: "#1a1a1a",
              }}
            >
              برگ دانش — مرجع دانلود رایگان جزوه، کتاب و نمونه سوال
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              <strong>برگ دانش</strong> یک پلتفرم آموزشی رایگان است که با هدف
              کمک به دانشجویان و دانش‌آموزان ایرانی راه‌اندازی شده است. در این
              سایت می‌توانید به هزاران <strong>جزوه دانشگاهی</strong>،{" "}
              <strong>کتاب رایگان</strong>، <strong>نمونه سوال امتحانی</strong> و{" "}
              <strong>مقاله علمی</strong> دسترسی داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              ما معتقدیم که <strong>دانش باید در دسترس همه باشد</strong>. به
              همین دلیل، تمامی منابع آموزشی موجود در برگ دانش به صورت کاملاً
              رایگان در اختیار کاربران قرار می‌گیرد. کافی است در سایت ثبت‌نام
              کنید و فایل‌های مورد نظر خود را دانلود کنید.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              چه منابعی در برگ دانش موجود است؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>جزوه‌های دانشگاهی</strong> — روانشناسی، علوم تربیتی،
                کامپیوتر، فیزیک، شیمی، جامعه‌شناسی و زبان انگلیسی
              </li>
              <li>
                <strong>منابع مدرسه‌ای</strong> — تمام مقاطع از ابتدایی تا
                متوسطه
              </li>
              <li>
                <strong>نمونه سوالات امتحانی</strong> — پایان‌ترم، میان‌ترم و
                نهایی
              </li>
              <li>
                <strong>کتاب‌های غیر درسی</strong> — رمان، داستان و کتاب‌های
                عمومی
              </li>
              <li>
                <strong>منابع استخدامی</strong> — آمادگی برای آزمون‌های استخدامی
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
              چرا برگ دانش را انتخاب کنیم؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>✨ تمامی منابع <strong>کاملاً رایگان</strong> هستند</li>
              <li>📚 بیش از <strong>۵۰+ فایل آموزشی</strong> در دسترس</li>
              <li>📄 فرمت <strong>PDF</strong> — قابل مطالعه در همه دستگاه‌ها</li>
              <li>🎯 محتوای <strong>با کیفیت و به‌روز</strong></li>
              <li>⚡ <strong>دانلود سریع</strong> و آسان</li>
            </ul>

            <p style={{ marginBottom: "0", color: "#444" }}>
              برای شروع، کافیست به یکی از دسته‌بندی‌های{" "}
              <Link
                href="/university"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                دانشگاهی
              </Link>
              ،{" "}
              <Link
                href="/school"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                مدرسه‌ای
              </Link>
              ،{" "}
              <Link
                href="/exams"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                نمونه سوال
              </Link>{" "}
              یا{" "}
              <Link
                href="/books"
                style={{ color: "#0066cc", textDecoration: "underline" }}
              >
                کتاب‌ها
              </Link>{" "}
              مراجعه کنید.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول" />
      <FAQSchema faqs={faqs} />

      {/* ─────── CTA ─────── */}
      <CTA />
    </>
  );
}