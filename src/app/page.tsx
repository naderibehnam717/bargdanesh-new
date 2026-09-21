import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import StudentConcerns from "@/components/StudentConcerns";
import FileCard from "@/components/FileCard";
import StatsBanner from "@/components/StatsBanner";
import Countdown from "@/components/Countdown";
import QuotesSlider from "@/components/QuotesSlider";
import UsefulLinks from "@/components/UsefulLinks";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";
import HomeGuides from "@/components/HomeGuides";
import { getAllFiles } from "@/lib/files";
import Link from "next/link";

// ✅ کوییز با Lazy Load (برای سرعت)
const DailyQuiz = dynamic(() => import("@/components/DailyQuiz"), {
  loading: () => (
    <div
      style={{
        background: "linear-gradient(135deg, #0066cc 0%, #7c3aed 100%)",
        borderRadius: "20px",
        padding: "40px 24px",
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0, 102, 204, 0.25)",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ opacity: 0.8, fontSize: "14px" }}>⏳ در حال بارگذاری کوییز...</p>
    </div>
  ),
});

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
    "روش مطالعه",
    "تقویت حافظه",
    "آمادگی کنکور",
    "کوییز روزانه",
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
    description: "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله",
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
  { title: "دانشگاهی", desc: "جزوه‌های تمام رشته‌ها", icon: "🎓", href: "/university" },
  { title: "مدرسه‌ای", desc: "منابع تمام مقاطع", icon: "🏫", href: "/school" },
  { title: "نمونه سوال", desc: "آرشیو سوالات امتحانی", icon: "📝", href: "/exams" },
  { title: "آرشیو کنکور", desc: "دفترچه سوالات و کلید پاسخ", icon: "📚", href: "/konkur" },
  { title: "منابع غیر درسی", desc: "کتاب، رمان و داستان", icon: "📖", href: "/books" },
  { title: "منابع استخدامی", desc: "آمادگی آزمون‌های استخدامی", icon: "💼", href: "/employment" },
  { title: "مقالات", desc: "مقالات علمی و پژوهشی", icon: "📄", href: "/articles" },
];

export default async function Home() {
  const allFiles = await getAllFiles();
  const latestFiles = [...allFiles].reverse().slice(0, 4);

  return (
    <>
      {/* 1. Hero */}
      <Hero files={allFiles} />

      {/* 2. دسته‌بندی‌ها */}
      <section className="section">
        <div className="container">
          <div className="section__header" style={{ textAlign: "center" }}>
            <h2 className="section__title">📁 دسته‌بندی‌های برگ دانش</h2>
            <p className="section__subtitle">منبع مورد نظرت رو سریع پیدا کن</p>
          </div>

          <div className="home-categories">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="home-category-card">
                <div className="home-category-card__icon">{cat.icon}</div>
                <h3 className="home-category-card__title">{cat.title}</h3>
                <p className="home-category-card__desc">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. چرا برگ دانش + Countdown */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="home-two-col">
            <div className="home-two-col__main">
              <div className="section__header">
                <h2 className="section__title">چرا برگ دانش؟</h2>
                <p className="section__subtitle">چیزی که ما را متفاوت می‌کند</p>
              </div>

              <StudentConcerns />

              <div className="features">
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
            </div>

            <aside className="home-two-col__aside">
              <Countdown />
              <StatsBanner />
            </aside>
          </div>
        </div>
      </section>

      {/* 4. آخرین فایل‌ها + کوییز */}
      <section className="section">
        <div className="container">
          <div className="home-two-col">
            <div className="home-two-col__main">
              <div
                className="section__header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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

              <div className="cards-grid">
                {latestFiles.map((file, i) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>
            </div>

            <aside className="home-two-col__aside">
              <DailyQuiz />
            </aside>
          </div>
        </div>
      </section>

      {/* 4.5 نقل قول‌ها — تمام عرض، وسط صفحه */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <QuotesSlider />
        </div>
      </section>

      {/* 5. چطور کار می‌کنه + UsefulLinks */}
      <section className="section">
        <div className="container">
          <div className="home-two-col">
            <div className="home-two-col__main">
              <div className="section__header">
                <h2 className="section__title">
                  🎯 چطور از برگ دانش استفاده کنم؟
                </h2>
                <p className="section__subtitle">
                  فقط ۳ مرحله ساده — سریع و رایگان
                </p>
              </div>

              <div className="home-how">
                <div className="home-how__card">
                  <div className="home-how__num">۱</div>
                  <h3 className="home-how__title">ثبت‌نام کن</h3>
                  <p className="home-how__desc">
                    با ایمیل خود در چند ثانیه ثبت‌نام کن. کاملاً رایگانه.
                  </p>
                </div>
                <div className="home-how__card">
                  <div className="home-how__num">۲</div>
                  <h3 className="home-how__title">فایل رو پیدا کن</h3>
                  <p className="home-how__desc">
                    از بین هزاران جزوه، کتاب و نمونه سوال، فایل مورد نظرت رو
                    انتخاب کن.
                  </p>
                </div>
                <div className="home-how__card">
                  <div className="home-how__num">۳</div>
                  <h3 className="home-how__title">رایگان دانلود کن</h3>
                  <p className="home-how__desc">
                    روی دکمه‌ی دانلود کلیک کن و فایل PDF رو رایگان دریافت کن.
                  </p>
                </div>
              </div>
            </div>

            <aside className="home-two-col__aside">
              <div className="sidebar">
                <UsefulLinks />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 6. راهنمای مطالعه */}
      <HomeGuides />

      {/* 7. محتوای سئو + FAQ */}
      <section className="section">
        <div className="container">
          <div className="home-two-col">
            <div className="home-two-col__main">
              <div className="home-seo-content">
                <h2 className="home-seo-content__title">
                  برگ دانش — مرجع دانلود رایگان جزوه، کتاب و نمونه سوال
                </h2>

                <p>
                  <strong>برگ دانش</strong> یک پلتفرم آموزشی رایگان است که با
                  هدف کمک به دانشجویان و دانش‌آموزان ایرانی راه‌اندازی شده است.
                  در این سایت می‌توانید به هزاران <strong>جزوه دانشگاهی</strong>
                  ، <strong>کتاب رایگان</strong>،{" "}
                  <strong>نمونه سوال امتحانی</strong> و{" "}
                  <strong>مقاله علمی</strong> دسترسی داشته باشید.
                </p>

                <p>
                  ما معتقدیم که <strong>دانش باید در دسترس همه باشد</strong>. به
                  همین دلیل، تمامی منابع آموزشی موجود در برگ دانش به صورت کاملاً
                  رایگان در اختیار کاربران قرار می‌گیرد. کافی است در سایت ثبت‌نام
                  کنید و فایل‌های مورد نظر خود را دانلود کنید.
                </p>

                <h3>چه منابعی در برگ دانش موجود است؟</h3>

                <ul>
                  <li>
                    <strong>جزوه‌های دانشگاهی</strong> — روانشناسی، علوم تربیتی،
                    کامپیوتر، فیزیک، شیمی، جامعه‌شناسی و زبان انگلیسی
                  </li>
                  <li>
                    <strong>منابع مدرسه‌ای</strong> — تمام مقاطع از ابتدایی تا
                    متوسطه
                  </li>
                  <li>
                    <strong>نمونه سوالات امتحانی</strong> — پایان‌ترم، میان‌ترم
                    و نهایی
                  </li>
                  <li>
                    <strong>کتاب‌های غیر درسی</strong> — رمان، داستان و
                    کتاب‌های عمومی
                  </li>
                  <li>
                    <strong>منابع استخدامی</strong> — آمادگی برای آزمون‌های
                    استخدامی
                  </li>
                </ul>

                <h3>چرا برگ دانش را انتخاب کنیم؟</h3>

                <ul>
                  <li>✨ تمامی منابع <strong>کاملاً رایگان</strong> هستند</li>
                  <li>📚 بیش از <strong>۵۰+ فایل آموزشی</strong> در دسترس</li>
                  <li>
                    📄 فرمت <strong>PDF</strong> — قابل مطالعه در همه دستگاه‌ها
                  </li>
                  <li>🎯 محتوای <strong>با کیفیت و به‌روز</strong></li>
                  <li>⚡ <strong>دانلود سریع</strong> و آسان</li>
                </ul>

                <p>
                  برای شروع، کافیست به یکی از دسته‌بندی‌های{" "}
                  <Link href="/university">دانشگاهی</Link>،{" "}
                  <Link href="/school">مدرسه‌ای</Link>،{" "}
                  <Link href="/exams">نمونه سوال</Link> یا{" "}
                  <Link href="/books">کتاب‌ها</Link> مراجعه کنید.
                </p>
              </div>
            </div>

            <aside className="home-two-col__aside">
              <FAQ faqs={faqs} title="سوالات متداول" />
            </aside>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <CTA />
      <FAQSchema faqs={faqs} />
    </>
  );
}