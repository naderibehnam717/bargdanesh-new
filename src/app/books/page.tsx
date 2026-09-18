import type { Metadata } from "next";
import Link from "next/link";
import { allFiles } from "@/lib/files";
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

// ─── FAQ ───
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

export default function BooksPage() {
  const books = allFiles.filter((f) => f.type === "منابع غیر درسی");

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📖 منابع غیر درسی</h1>
          <p className="page-header__subtitle">
            کتاب، رمان، شعر و... — برای علاقه‌مندان به مطالعه
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

            <p style={{ marginBottom: "16px", color: "#444" }}>
              همه‌ی <strong>کتاب‌ها و رمان‌های این بخش</strong> با فرمت PDF و
              به صورت <strong>رایگان</strong> قابل دانلود هستند. برای دانلود،
              کافی است روی هر کتاب کلیک کنید و سپس دکمه‌ی دانلود را بزنید. برای
              مطالعه‌ی آنلاین، از دکمه‌ی «مشاهده آنلاین» استفاده کنید.
            </p>

            <h3
              style={{
                fontSize: "18px",
                marginTop: "24px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              دسته‌بندی منابع غیر درسی:
            </h3>

            <ul
              style={{
                paddingRight: "20px",
                color: "#444",
                marginBottom: "16px",
              }}
            >
              <li>
                <strong>کتاب‌های عمومی</strong> — آثاری در زمینه‌ی روانشناسی،
                ارتباطات و خودشناسی
              </li>
              <li>
                <strong>رمان‌ها</strong> — رمان‌های کلاسیک و مدرن ایرانی و
                خارجی
              </li>
              <li>
                <strong>داستان‌های کوتاه</strong> — مجموعه داستان‌های برجسته
              </li>
              <li>
                <strong>نمایشنامه‌ها</strong> — آثار نمایشی نویسندگان بزرگ
              </li>
              <li>
                <strong>شعر و ادبیات</strong> — مجموعه اشعار کلاسیک و معاصر
              </li>
            </ul>

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