import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function EmploymentPage() {
  const files = allFiles.filter((f) => f.type === "منابع استخدامی");

  return (
    <>
      <section className="subject-hero" data-subject="employment">
        <div className="container">
          <AnimatedTitle
            text="EMPLOYMENT"
            emojis={["📋", "📝", "💼", "🎯", "🏢", "📊", "🎓", "✨"]}
          />
          <p className="subject-hero__subtitle">منابع آزمون‌های استخدامی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">
              📖 درباره‌ی منابع آزمون‌های استخدامی
            </h2>
            <p className="subject-intro__text">
              آزمون‌های استخدامی یکی از مسیرهای اصلی ورود به بازار کار در ایران هستند.
              این آزمون‌ها برای استخدام در دستگاه‌های اجرایی، بانک‌ها، آموزش و پرورش،
              وزارتخانه‌ها و سایر سازمان‌های دولتی و خصوصی برگزار می‌شوند و منابع
              مطالعاتی مشخصی دارند.
            </p>
            <p className="subject-intro__text">
              در این بخش، منابع اختصاصی برگ دانش برای آمادگی در آزمون‌های استخدامی
              شامل جزوه‌های دروس عمومی، منابع تخصصی، نمونه سوالات و دفترچه‌های راهنما
              در اختیار شما قرار دارد.
            </p>
          </div>

          <div
            className="section__header"
            style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
          >
            <h2 className="section__title">📚 منابع استخدامی</h2>
            <p className="section__subtitle">منابع اختصاصی برگ دانش</p>
          </div>

          <div className="cards-grid">
            {files.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#999",
                  gridColumn: "1 / -1",
                }}
              >
                📚 هنوز منبعی اضافه نشده است. به‌زودی...
              </p>
            ) : (
              files.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}