import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import Link from "next/link";

export default async function SociologyPage() {
  const allFiles = await getAllFiles();
  const files = allFiles.filter((f) => f.category === "جامعه‌شناسی");

  return (
    <>
      <section className="subject-hero" data-subject="sociology">
        <div className="container">
          <AnimatedTitle
            text="SOCIOLOGY"
            emojis={["👥", "🌍", "🏛️", "🤝", "📊", "💬", "🧑‍🤝‍🧑", "🏙️"]}
          />
          <p className="subject-hero__subtitle">جامعه‌شناسی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">📖 درباره‌ی جامعه‌شناسی</h2>
            <p className="subject-intro__text">
              جامعه‌شناسی علم مطالعه‌ی جامعه و زندگی اجتماعی انسان است. این علم به
              بررسی روابط اجتماعی، گروه‌ها، نهادها، فرهنگ، نابرابری‌های اجتماعی و
              تغییرات جامعه می‌پردازد. جامعه‌شناسی تلاش می‌کند رفتار انسان را در بستر
              اجتماعی و ساختاری آن تحلیل کند.
            </p>
            <p className="subject-intro__text">
              در این بخش، جزوه‌های اختصاصی برگ دانش در زمینه‌های مختلف جامعه‌شناسی در
              اختیار شما قرار دارد. همه‌ی این جزوه‌ها به‌صورت رایگان و با کیفیت بالا
              آماده شده‌اند.
            </p>
          </div>

          <div className="layout-with-sidebar">
            <div>
              <div
                className="section__header"
                style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
              >
                <h2 className="section__title">📚 جزوه‌های جامعه‌شناسی</h2>
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
                  <Link href="/psychology" className="sidebar__link">
                    🧠 روانشناسی
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="sidebar__link">
                    🎓 علوم تربیتی
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
                  <Link href="/english" className="sidebar__link">
                    🌍 زبان انگلیسی
                  </Link>
                </li>
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