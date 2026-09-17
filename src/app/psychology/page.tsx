import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import Link from "next/link";

export default function PsychologyPage() {
  const files = allFiles.filter((f) => f.category === "روانشناسی");

  return (
    <>
      <section className="subject-hero" data-subject="psychology">
        <div className="container">
          <AnimatedTitle
            text="PSYCHOLOGY"
            emojis={["🧠", "💭", "💡", "🎭", "❤️", "🔍", "📊", "🧩"]}
          />
          <p className="subject-hero__subtitle">روانشناسی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">📖 درباره‌ی روانشناسی</h2>
            <p className="subject-intro__text">
              روانشناسی علم مطالعه‌ی رفتار و فرایندهای ذهنی انسان است. این علم به بررسی
              موضوعاتی مانند یادگیری، حافظه، تفکر، هیجان، انگیزش، شخصیت، رشد و روابط
              اجتماعی می‌پردازد و تلاش می‌کند رفتار انسان را به شکل علمی توصیف، تبیین،
              پیش‌بینی و در صورت امکان تغییر دهد.
            </p>
            <p className="subject-intro__text">
              در این بخش، جزوه‌های اختصاصی برگ دانش در زمینه‌های مختلف روانشناسی در اختیار
              شما قرار دارد. همه‌ی این جزوه‌ها به‌صورت رایگان و با کیفیت بالا آماده
              شده‌اند.
            </p>
          </div>

          <div className="layout-with-sidebar">
            <div>
              <div
                className="section__header"
                style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
              >
                <h2 className="section__title">📚 جزوه‌های روانشناسی</h2>
                <p className="section__subtitle">جزوات اختصاصی برگ دانش</p>
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
                    فایلی موجود نیست
                  </p>
                ) : (
                  files.map((file, i) => <FileCard key={i} file={file} />)
                )}
              </div>
            </div>

            <aside className="sidebar">
              <h3 className="sidebar__title">🔗 موضوعات مرتبط</h3>
              <ul className="sidebar__list">
                <li>
                  <Link href="/islamic" className="sidebar__link">
                    📿 معارف اسلامی
                  </Link>
                </li>
                <li>
                  <Link href="/university" className="sidebar__link">
                    🎓 همه‌ی موضوعات دانشگاهی
                  </Link>
                </li>
              </ul>

              <h3 className="sidebar__title" style={{ marginTop: "24px" }}>
                📂 موضوعات دیگر
              </h3>
              <ul className="sidebar__list">
                <li>
                  <Link href="/computer" className="sidebar__link">
                    💻 کامپیوتر
                  </Link>
                </li>
                <li>
                  <Link href="/physics" className="sidebar__link">
                    ⚛️ فیزیک
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}