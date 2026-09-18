import type { Metadata } from "next";
import { allFiles } from "@/lib/files";
import Link from "next/link";

export const metadata: Metadata = {
  title: "منابع دانشگاهی",
  description:
    "دانلود رایگان جزوه، کتاب و نمونه سوال رشته‌های دانشگاهی — روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی و سایر رشته‌ها در برگ دانش",
  keywords: [
    "جزوه دانشگاهی",
    "منابع دانشگاهی",
    "دانلود جزوه دانشگاه",
    "جزوه روانشناسی",
    "جزوه علوم تربیتی",
    "جزوه کامپیوتر",
    "جزوه فیزیک",
    "برگ دانش",
  ],
  openGraph: {
    title: "منابع دانشگاهی | برگ دانش",
    description:
      "دانلود رایگان جزوه، کتاب و نمونه سوال رشته‌های دانشگاهی در برگ دانش",
    url: "https://www.bargdanesh.ir/university",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bargdanesh.ir/university",
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