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
    description: "دانلود رایگان نمونه سوالات امتحانی دانشگاهی و مدرسه‌ای",
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
};

const faqs = [
  {
    question: "نمونه سوالات برگ دانش رایگان هستند؟",
    answer:
      "بله، تمامی نمونه سوالات دانشگاهی و مدرسه‌ای برگ دانش به صورت کاملاً رایگان قابل دانلود هستند.",
  },
  {
    question: "نمونه سوالات شامل پاسخ‌نامه هم می‌شوند؟",
    answer:
      "بله، اکثر نمونه سوالات برگ دانش همراه با پاسخ‌نامه تشریحی یا کلید سوالات ارائه می‌شوند.",
  },
  {
    question: "نمونه سوالات برای چه مقاطعی هستند؟",
    answer:
      "برگ دانش نمونه سوالات هر دو مقطع دانشگاهی و مدرسه‌ای (دهم، یازدهم و دوازدهم) را ارائه می‌دهد.",
  },
  {
    question: "چرا باید نمونه سوال حل کنم؟",
    answer:
      "حل نمونه سوال باعث می‌شود با ساختار سوالات امتحانی آشنا شوید، نقاط ضعف خود را شناسایی کنید و نمره‌ی بهتری بگیرید.",
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
      {/* ─── Hero ─── */}
      <section
        style={{
          position: "relative",
          padding: "60px 0 40px",
          background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
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
            📝
          </div>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 900,
              margin: "0 0 12px",
              textShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            نمونه سوال امتحانی
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
            نمونه سوالات دانشگاهی و مدرسه‌ای — همراه با پاسخ‌نامه
          </p>

          {/* ─── آمار ─── */}
          <div
            style={{
              display: "inline-flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              marginTop: "20px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700 }}>
              🎓 {uniExams.length} دانشگاهی
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                paddingRight: "12px",
                borderRight: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              🏫 {schoolExams.length} مدرسه‌ای
            </span>
          </div>
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
            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "#1a1a1a" }}>
              دانلود رایگان نمونه سوالات امتحانی
            </h2>

            <p style={{ marginBottom: "16px", color: "#444" }}>
              بخش <strong>نمونه سوال برگ دانش</strong> مرجعی کامل از{" "}
              <strong>سوالات امتحانی استاندارد</strong> برای دانش‌آموزان و
              دانشجویان است. در این بخش می‌توانید به نمونه سوالات{" "}
              <strong>امتحانات پایان‌ترم، میان‌ترم و نهایی</strong> در مقاطع مختلف
              دسترسی رایگان داشته باشید.
            </p>

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

      {/* ─── دو بخش کنار هم ─── */}
      <main className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            {/* ─── دانشگاهی ─── */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(37, 99, 235, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "2px solid #f0f7ff",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  🎓
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      margin: 0,
                      color: "#1a1a1a",
                    }}
                  >
                    نمونه سوال دانشگاهی
                  </h2>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {uniExams.length} فایل
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                {uniExams.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#999",
                      gridColumn: "1 / -1",
                      fontSize: "14px",
                    }}
                  >
                    📭 هنوز نمونه سوال دانشگاهی اضافه نشده است
                  </p>
                ) : (
                  uniExams.map((file, i) => <FileCard key={i} file={file} />)
                )}
              </div>
            </div>

            {/* ─── مدرسه‌ای ─── */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "2px solid #f0fdf4",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  🏫
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      margin: 0,
                      color: "#1a1a1a",
                    }}
                  >
                    نمونه سوال مدرسه‌ای
                  </h2>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {schoolExams.length} فایل
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                {schoolExams.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#999",
                      gridColumn: "1 / -1",
                      fontSize: "14px",
                    }}
                  >
                    📭 هنوز نمونه سوال مدرسه‌ای اضافه نشده است
                  </p>
                ) : (
                  schoolExams.map((file, i) => (
                    <FileCard key={i} file={file} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FAQ ─── */}
      <FAQ faqs={faqs} title="سوالات متداول درباره نمونه سوالات" />
      <FAQSchema faqs={faqs} />
    </>
  );
}