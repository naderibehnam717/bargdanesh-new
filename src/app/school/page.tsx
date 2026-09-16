import { allFiles } from "@/lib/files";
import Link from "next/link";

export default function SchoolPage() {
  const schoolFiles = allFiles.filter((f) => f.level === "مدرسه ای");
  const categories = [...new Set(schoolFiles.map((f) => f.category))];

  const icons: Record<string, string> = {
    "ریاضی": "📐", "علوم": "🔬", "فارسی": "📖", "ادبیات": "📖",
    "عربی": "🕌", "دینی": "📿", "زبان": "🌍", "اجتماعی": "🏛️",
    "قرآن": "📿", "علوم تجربی": "🧪"
  };

  const typeLabels: Record<string, string> = {
    "جزوه": "جزوه", "کتاب": "کتاب", "نمونه سوال": "نمونه سوال"
  };

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">🏫 مدرسه ای</h1>
          <p className="page-header__subtitle">منابع و نمونه سوالات مقاطع مختلف مدرسه</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">دسته‌بندی‌ها</h2>
            <p className="section__subtitle">منابع مورد نظرت را انتخاب کن</p>
          </div>

          <div className="cards-grid">
            {categories.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#999", gridColumn: "1 / -1" }}>
                هنوز فایلی اضافه نشده است.
              </p>
            ) : (
              categories.map((cat) => {
                const filesInCat = schoolFiles.filter((f) => f.category === cat);
                const types = [...new Set(filesInCat.map((f) => f.type))];
                const typesText = types.map((t) => typeLabels[t] || t).join("، ");

                let href = "/exams";
                if (types.length === 1) {
                  if (types[0] === "جزوه") href = "/notes";
                  else if (types[0] === "کتاب") href = "/books";
                }

                const icon = icons[cat] || "📁";

                return (
                  <Link key={cat} href={href} className="content-card" style={{ textDecoration: "none" }}>
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