import { getAllFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import Link from "next/link";

export default async function IslamicPage() {
  const allFiles = await getAllFiles();
  const files = allFiles.filter((f) => f.category === "معارف");

  return (
    <>
      <section className="subject-hero" data-subject="islamic">
        <div className="container">
          <AnimatedTitle
            text="ISLAMIC"
            emojis={["📿", "🕌", "📖", "🕋", "☪️", "🌟", "🤲", "📜"]}
          />
          <p className="subject-hero__subtitle">معارف اسلامی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">📖 درباره‌ی معارف اسلامی</h2>
            <p className="subject-intro__text">
              معارف اسلامی مجموعه‌ای از دانش‌های دینی است که به مباحثی مانند اندیشه
              اسلامی، اخلاق، تاریخ اسلام، تفسیر قرآن و سیره معصومان می‌پردازد. این
              دروس بخشی از برنامه‌ی آموزشی دانشگاه‌ها و مراکز علمی هستند.
            </p>
            <p className="subject-intro__text">
              در این بخش، کتاب‌ها و منابع اختصاصی برگ دانش در زمینه‌های مختلف معارف
              اسلامی در اختیار شما قرار دارد. همه‌ی این منابع به‌صورت رایگان و با کیفیت
              بالا آماده شده‌اند.
            </p>
          </div>

          <div className="layout-with-sidebar">
            <div>
              <div
                className="section__header"
                style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
              >
                <h2 className="section__title">📚 منابع معارف اسلامی</h2>
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
                  <Link href="/university" className="sidebar__link">
                    🎓 همه‌ی موضوعات دانشگاهی
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