import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import { prisma } from "@/lib/prisma";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

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

const faqs = [
  {
    question: "جزوه‌های دانشگاهی برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی جزوه‌های دانشگاهی موجود در برگ دانش به صورت کاملاً رایگان قابل دانلود هستند. برای دانلود، کافی است روی دکمه‌ی دانلود هر جزوه کلیک کنید.",
  },
  {
    question: "چطور می‌توانم جزوه دانشگاهی دانلود کنم؟",
    answer:
      "برای دانلود جزوه، ابتدا روی کارت جزوه کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید. در صورت نیاز به ورود، با ایمیل خود ثبت‌نام کنید.",
  },
  {
    question: "جزوه‌ها با چه فرمتی ارائه می‌شوند؟",
    answer:
      "تمامی جزوه‌ها و کتاب‌های دانشگاهی برگ دانش با فرمت PDF ارائه می‌شوند که در تمامی دستگاه‌ها (موبایل، تبلت و کامپیوتر) قابل مطالعه هستند.",
  },
  {
    question: "آیا جزوه‌ها مطابق با سرفصل‌های درسی هستند؟",
    answer:
      "بله، تمامی جزوه‌های برگ دانش مطابق با سرفصل‌های مصوب وزارت علوم و دانشگاه‌های معتبر تهیه شده‌اند و برای امتحانات پایان‌ترم و کنکور ارشد مناسب هستند.",
  },
  {
    question: "چه رشته‌هایی در برگ دانش پوشش داده شده‌اند؟",
    answer:
      "برگ دانش جزوه‌های رشته‌های روانشناسی، علوم تربیتی، کامپیوتر، فیزیک، شیمی، جامعه‌شناسی، معارف و زبان انگلیسی را پوشش می‌دهد. به‌زودی رشته‌های بیشتری اضافه خواهد شد.",
  },
  {
    question: "آیا می‌توانم جزوه‌ها را در گوشی موبایل مطالعه کنم؟",
    answer:
      "بله، تمامی جزوه‌ها با فرمت PDF هستند و در تمامی دستگاه‌های دارای PDF Reader از جمله گوشی‌های اندروید و آیفون قابل مطالعه هستند.",
  },
];

export default async function UniversityPage() {
  const allFiles = await getAllFiles();
  const uniFiles = allFiles.filter((f) => f.level === "دانشگاهی");

  // ─── دریافت دسته‌ها از دیتابیس (فقط دانشگاهی) ───
  let dbCategories: {
    id: string;
    slug: string;
    title: string;
    icon: string;
    color: string;
  }[] = [];

  try {
    dbCategories = await prisma.category.findMany({
      where: { group: "university", isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        icon: true,
        color: true,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // ─── آمار برای هر دسته (تعداد فایل) ───
  const categoriesWithStats = dbCategories.map((cat) => {
    const filesInCat = uniFiles.filter((f) => f.category === cat.title);
    const types = [...new Set(filesInCat.map((f) => f.type))];
    const typeLabels: Record<string, string> = {
      جزوه: "جزوه",
      کتاب: "کتاب",
      "نمونه سوال": "نمونه سوال",
    };
    const typesText = types.map((t) => typeLabels[t] || t).join("، ");

    return {
      ...cat,
      fileCount: filesInCat.length,
      typesText: typesText || "بدون فایل",
    };
  });

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
            {categoriesWithStats.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  gridColumn: "1 / -1",
                }}
              >
                هنوز رشته‌ای اضافه نشده است.
              </p>
            ) : (
              categoriesWithStats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/subject/${cat.slug}`}
                  className="content-card"
                  style={{ textDecoration: "none" }}
                >
                  <div className="category-card__icon">{cat.icon}</div>
                  <h3 className="content-card__title">{cat.title}</h3>
                  <p className="content-card__desc">
                    {cat.fileCount} فایل — {cat.typesText}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره جزوه‌های دانشگاهی" />
      <FAQSchema faqs={faqs} />
    </>
  );
}