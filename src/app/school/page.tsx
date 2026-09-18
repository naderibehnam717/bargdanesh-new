import type { Metadata } from "next";
import Link from "next/link";
import { getAllFiles } from "@/lib/files";
import FAQ from "@/components/FAQ";
import FAQSchema from "@/components/FAQSchema";

export const metadata: Metadata = {
  title: "منابع مدرسه‌ای — دانلود رایگان جزوه و نمونه سوال",
  description:
    "دانلود رایگان جزوه، کتاب و نمونه سوال مقاطع مختلف مدرسه — ابتدایی، متوسطه اول و دوم. دروس ریاضی، علوم، فارسی، عربی، دینی و زبان انگلیسی در برگ دانش",
  keywords: [
    "جزوه مدرسه",
    "نمونه سوال مدرسه",
    "دانلود جزوه مدرسه رایگان",
    "نمونه سوال امتحانی",
    "جزوه ریاضی مدرسه",
    "جزوه علوم تجربی",
    "جزوه فارسی",
    "جزوه عربی",
    "جزوه دینی",
    "نمونه سوال متوسطه",
    "کنکور",
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
  twitter: {
    card: "summary_large_image",
    title: "منابع مدرسه‌ای | برگ دانش",
    description:
      "دانلود رایگان جزوه، کتاب و نمونه سوال مقاطع مختلف مدرسه",
    images: ["/android-chrome-512x512.png"],
  },
};

const faqs = [
  {
    question: "منابع مدرسه‌ای برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی جزوه‌ها، نمونه سوالات و منابع مدرسه‌ای برگ دانش به صورت کاملاً رایگان قابل دانلود هستند. برای دانلود، کافی است روی دکمه‌ی دانلود هر فایل کلیک کنید.",
  },
  {
    question: "نمونه سوالات برای چه مقاطعی هستند؟",
    answer:
      "نمونه سوالات برگ دانش برای تمامی مقاطع تحصیلی از ابتدایی تا متوسطه‌ی دوم (دبیرستان) تهیه شده‌اند. این سوالات شامل امتحانات میان‌ترم، پایان‌ترم و امتحانات نهایی هستند.",
  },
  {
    question: "آیا سوالات با پاسخ‌نامه ارائه می‌شوند؟",
    answer:
      "بله، اکثر نمونه سوالات برگ دانش همراه با پاسخ‌نامه یا کلید سوالات ارائه می‌شوند. این موضوع در صفحه‌ی جزئیات هر فایل مشخص شده است.",
  },
  {
    question: "چه دروسی در برگ دانش موجود است؟",
    answer:
      "برگ دانش منابع دروس ریاضی، علوم تجربی (فیزیک، شیمی، زیست)، فارسی و ادبیات، عربی، دین و زندگی، قرآن، زبان انگلیسی و علوم اجتماعی را پوشش می‌دهد.",
  },
  {
    question: "آیا این منابع برای کنکور مفید هستند؟",
    answer:
      "بله، نمونه سوالات و جزوه‌های برگ دانش برای آمادگی در امتحانات مدرسه و همچنین کنکور سراسری بسیار مفید هستند. این منابع مطابق با سرفصل‌های کتاب‌های درسی تهیه شده‌اند.",
  },
  {
    question: "چطور می‌توانم فایل‌ها را دانلود کنم؟",
    answer:
      "برای دانلود، روی کارت فایل مورد نظر کلیک کنید تا وارد صفحه‌ی جزئیات شوید. سپس روی دکمه‌ی «دانلود» کلیک کنید. در صورت نیاز به ورود، با ایمیل خود ثبت‌نام کنید.",
  },
];

export default async function SchoolPage() {
  const allFiles = await getAllFiles();
  const schoolFiles = allFiles.filter((f) => f.level === "مدرسه ای");
  const categories = [...new Set(schoolFiles.map((f) => f.category))];

  const icons: Record<string, string> = {
    ریاضی: "📐",
    علوم: "🔬",
    فارسی: "📖",
    ادبیات: "📖",
    عربی: "🕌",
    دینی: "📿",
    زبان: "🌍",
    اجتماعی: "🏛️",
    قرآن: "📿",
    "علوم تجربی": "🧪",
  };

  const typeLabels: Record<string, string> = {
    جزوه: "جزوه",
    کتاب: "کتاب",
    "نمونه سوال": "نمونه سوال",
  };

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">🏫 مدرسه ای</h1>
          <p className="page-header__subtitle">
            منابع و نمونه سوالات مقاطع مختلف مدرسه
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
              دانلود رایگان جزوه و نمونه سوال مدرسه از برگ دانش
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>منابع مدرسه‌ای برگ دانش</strong> مرجعی کامل برای
              دانش‌آموزان تمامی مقاطع تحصیلی — از <strong>ابتدایی</strong> تا{" "}
              <strong>متوسطه‌ی دوم</strong> — است. در این بخش می‌توانید به{" "}
              <strong>جزوه‌های درسی، نمونه سوالات امتحانی و کتاب‌های کمک‌آموزشی</strong>{" "}
              دروس مختلف به صورت رایگان دسترسی داشته باشید.
            </p>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              تمامی <strong>نمونه سوالات مدرسه</strong> این بخش، سوالات استاندارد
              امتحانات پایان‌ترم و هماهنگ کشوری هستند که برای آمادگی در
              امتحانات مدرسه و <strong>کنکور سراسری</strong> بسیار مفید
              می‌باشند. همچنین <strong>جزوه‌های آموزشی</strong> این بخش شامل
              خلاصه‌های درس، نکات کلیدی و مثال‌های کاربردی هستند.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              دروس موجود در این بخش:
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>ریاضی</strong> — ریاضی تمامی پایه‌ها از ابتدایی تا
                متوسطه
              </li>
              <li>
                <strong>علوم تجربی</strong> — فیزیک، شیمی و زیست مدرسه
              </li>
              <li>
                <strong>فارسی و ادبیات</strong> — قرائت، دستور زبان و آرایه‌ها
              </li>
              <li>
                <strong>عربی</strong> — قواعد، ترجمه و متن
              </li>
              <li>
                <strong>دینی و قرآن</strong> — پیام‌های آسمانی و دین و زندگی
              </li>
              <li>
                <strong>زبان انگلیسی</strong> — گرامر، واژگان و مکالمه
              </li>
              <li>
                <strong>علوم اجتماعی</strong> — تاریخ، جغرافیا و مدنی
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
              چرا از برگ دانش استفاده کنیم؟
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>✨ <strong>کاملاً رایگان</strong> برای همه‌ی دانش‌آموزان</li>
              <li>📝 <strong>نمونه سوالات استاندارد</strong> امتحانات</li>
              <li>📚 <strong>جزوه‌های خلاصه و نکته‌محور</strong></li>
              <li>📱 قابل مطالعه در <strong>موبایل و کامپیوتر</strong></li>
            </ul>

            <p style={{ marginBottom: "0", color: "#444" }}>
              اگر به دنبال <strong>منابع دانشگاهی</strong> یا{" "}
              <strong>کتاب‌های غیر درسی</strong> هستید، می‌توانید به بخش‌های{" "}
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

      {/* ─────── دسته‌بندی ─────── */}
      <main className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">دسته‌بندی‌ها</h2>
            <p className="section__subtitle">منابع مورد نظرت را انتخاب کن</p>
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
                const filesInCat = schoolFiles.filter(
                  (f) => f.category === cat
                );
                const types = [...new Set(filesInCat.map((f) => f.type))];
                const typesText = types
                  .map((t) => typeLabels[t] || t)
                  .join("، ");

                let href = "/exams";
                if (types.length === 1) {
                  if (types[0] === "جزوه") href = "/notes";
                  else if (types[0] === "کتاب") href = "/books";
                }

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

      {/* ─────── FAQ ─────── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره منابع مدرسه‌ای" />
      <FAQSchema faqs={faqs} />
    </>
  );
}