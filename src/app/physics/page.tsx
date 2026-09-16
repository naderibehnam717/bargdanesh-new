import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";
import Link from "next/link";

export default function PhysicsPage() {
  const files = allFiles.filter((f) => f.category === "فیزیک");

  return (
    <>
      <section className="subject-hero" data-subject="physics">
        <div className="container">
          <h1 className="subject-hero__title" data-text="PHYSICS">
            PHYSICS
          </h1>
          <p className="subject-hero__subtitle">فیزیک</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="subject-intro">
            <h2 className="subject-intro__title">📖 درباره‌ی فیزیک</h2>
            <p className="subject-intro__text">
              فیزیک علم مطالعه‌ی ماده، انرژی، حرکت و نیرو است. این علم پایه‌ی بسیاری از
              علوم دیگر مانند مهندسی، شیمی و نجوم محسوب می‌شود و به ما کمک می‌کند قوانین
              حاکم بر جهان را بهتر بفهمیم.
            </p>
            <p className="subject-intro__text">
              در این بخش، جزوه‌های اختصاصی برگ دانش در زمینه‌های مختلف فیزیک در اختیار
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
                <h2 className="section__title">📚 جزوه‌های فیزیک</h2>
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
                  <Link href="/computer" className="sidebar__link">
                    💻 کامپیوتر
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