import type { Metadata } from "next";
import { allFiles } from "@/lib/files";
import Link from "next/link";

export const metadata: Metadata = {
  title: "منابع دانشگاهی — دانلود رایگان جزوه، کتاب و نمونه سوال",
  description:
    "دانلود رایگان جزوه، کتاب و نمونه سوال تمامی رشته‌های دانشگاهی — روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی، جامعه‌شناسی، معارف و سایر رشته‌ها در برگ دانش",
  keywords: [
    "جزوه دانشگاهی",
    "دانلود جزوه دانشگاه",
    "جزوه روانشناسی",
    "جزوه علوم تربیتی",
    "جزوه کامپیوتر",
    "جزوه فیزیک",
    "جزوه شیمی",
    "جزوه جامعه‌شناسی",
    "جزوه معارف",
    "کتاب دانشگاهی رایگان",
    "نمونه سوال دانشگاهی",
    "منابع دانشگاهی",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/university",
  },
  openGraph: {
    title: "منابع دانشگاهی | برگ دانش",
    description:
      "دانلود رایگان جزوه، کتاب و نمونه سوال تمامی رشته‌های دانشگاهی",
    url: "https://www.bargdanesh.ir/university",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "منابع دانشگاهی برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منابع دانشگاهی | برگ دانش",
    description:
      "دانلود رایگان جزوه، کتاب و نمونه سوال تمامی رشته‌های دانشگاهی",
    images: ["/android-chrome-512x512.png"],
  },
};

export default function UniversityPage() {
  const uniFiles = allFiles.filter((f) => f.level === "دانشگاهی");
  const categories = [...new Set(uniFiles.map((f) => f.category))];

  const icons: Record<string, string> = {
    ریاضی: "📐",
    آمار: "📊",
    فیزیک: "⚛️",
    شیمی: "🧪",
    زیست: "🧬",
    "زیست‌شناسی": "🧬",
    مهندسی: "⚙️",
    کامپیوتر: "💻",
    معارف: "📿",
    روانشناسی: "🧠",
    "علوم تربیتی": "🎓",
    زبان: "🌍",
    "زبان انگلیسی": "🌍",
    ادبیات: "📖",
    تاریخ: "🏛️",
    اقتصاد: "💰",
    حقوق: "⚖️",
    پزشکی: "🩺",
    مدیریت: "📋",
    "جامعه‌شناسی": "👥",
  };

  const typeLabels: Record<string, string> = {
    جزوه: "جزوه",
    کتاب: "کتاب",
    "نمونه سوال": "نمونه سوال",
  };

  const categoryPages: Record<string, string> = {
    روانشناسی: "/psychology",
    "علوم تربیتی": "/education",
    کامپیوتر: "/computer",
    فیزیک: "/physics",
    معارف: "/islamic",
    "جامعه‌شناسی": "/sociology",
    "زبان انگلیسی": "/english",
    شیمی: "/chemistry",
  };

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">🎓 دانشگاهی</h1>
          <p className="page-header__subtitle">
            جزوات و منابع در تمامی رشته‌های دانشگاهی
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
              دانلود رایگان جزوه‌های دانشگاهی از برگ دانش
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>منابع دانشگاهی برگ دانش</strong> مرجعی کامل برای
              دانشجویان تمامی مقاطع و رشته‌های تحصیلی است. در این بخش می‌توانید
              به <strong>جزوه‌های درسی، کتاب‌های مرجع و نمونه سوالات امتحانی</strong>{" "}
              رشته‌های مختلف به صورت رایگان دسترسی داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              تمامی <strong>جزوه‌های دانشگاهی</strong> این بخش توسط اساتید
              مجرب و دانشجویان ممتاز تهیه شده‌اند و شامل مباحث کلیدی، خلاصه‌های
              درسی و نکات مهم امتحانی هستند. این منابع برای آمادگی در{" "}
              <strong>امتحانات پایان‌ترم، کنکور ارشد و دکتری</strong> بسیار
              مناسب می‌باشند.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              رشته‌های موجود در این بخش:
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>روانشناسی</strong> — جزوه روانشناسی عمومی، رشد، شخصیت و
                اجتماعی
              </li>
              <li>
                <strong>علوم تربیتی</strong> — روش‌های تدریس، ارزشیابی،
                یادگیری و انگیزش
              </li>
              <li>
                <strong>کامپیوتر</strong> — مبانی کامپیوتر، برنامه‌نویسی و
                الگوریتم
              </li>
              <li>
                <strong>فیزیک</strong> — فیزیک پایه، مکانیک و الکترومغناطیس
              </li>
              <li>
                <strong>شیمی</strong> — شیمی آلی، معدنی و تجزیه
              </li>
              <li>
                <strong>جامعه‌شناسی</strong> — مفاهیم اساسی و فرهنگ و جامعه
              </li>
              <li>
                <strong>معارف</strong> — اندیشه اسلامی و معارف اسلامی
              </li>
              <li>
                <strong>زبان انگلیسی</strong> — گرامر، ضمایر و ساختار جملات
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
              چرا از برگ دانش دانلود کنیم؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>✨ کاملاً <strong>رایگان</strong> و بدون نیاز به پرداخت</li>
              <li>📄 فرمت <strong>PDF</strong> قابل مطالعه در همه دستگاه‌ها</li>
              <li>🎯 محتوای <strong>خلاصه و نکته‌محور</strong> برای امتحانات</li>
              <li>✅ تهیه شده توسط <strong>اساتید و دانشجویان ممتاز</strong></li>
            </ul>

            <p style={{ marginBottom: "0", color: "#444" }}>
              اگر به دنبال <strong>کتاب‌های غیر درسی</strong> یا{" "}
              <strong>نمونه سوالات امتحانی</strong> هستید، می‌توانید به بخش‌های{" "}
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

      {/* ─────── دسته‌بندی ─────── */}
      <main className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">دسته‌بندی رشته‌ها</h2>
            <p className="section__subtitle">رشته مورد نظرت را انتخاب کن</p>
          </div>

          <div className="cards-grid">
            {categories.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  gridColumn: "1 / -1",
                }}
              >
                هنوز فایلی اضافه نشده است.
              </p>
            ) : (
              categories.map((cat) => {
                const filesInCat = uniFiles.filter((f) => f.category === cat);
                const types = [...new Set(filesInCat.map((f) => f.type))];
                const typesText = types
                  .map((t) => typeLabels[t] || t)
                  .join("، ");
                const href = categoryPages[cat] || "/notes";
                const icon = icons[cat] || "📁";

                return (
                  <Link
                    key={cat}
                    href={href}
                    className="content-card"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="category-card__icon">{icon}</div>
                    <h3 className="content-card__title">{cat}</h3>
                    <p className="content-card__desc">
                      {filesInCat.length} فایل — {typesText}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}