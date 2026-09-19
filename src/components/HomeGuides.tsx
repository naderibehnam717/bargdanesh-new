import Link from "next/link";

const guides = [
  {
    icon: "📖",
    title: "چطور جزوه‌ی درست انتخاب کنیم؟",
    desc: "راهنمای کامل انتخاب جزوه‌ی مناسب برای امتحانات — از تشخیص کیفیت تا مطابقت با سرفصل",
    href: "/university",
    color: "blue",
  },
  {
    icon: "🎯",
    title: "روش مطالعه‌ی مؤثر برای کنکور",
    desc: "تکنیک‌های علمی مطالعه، مدیریت زمان و مرور — بر اساس جدیدترین پژوهش‌های روانشناسی یادگیری",
    href: "/exams",
    color: "green",
  },
  {
    icon: "🧠",
    title: "چطور حافظه‌ی خود را تقویت کنیم؟",
    desc: "روش‌های علمی تقویت حافظه، تمرین‌های ذهنی و تکنیک‌های یادگیری سریع برای دانشجویان",
    href: "/psychology",
    color: "purple",
  },
  {
    icon: "📝",
    title: "راهنمای حل نمونه سوال",
    desc: "چطور از نمونه سوالات امتحانی بهترین استفاده را ببریم؟ روش‌های تمرین و تحلیل سوالات",
    href: "/exams",
    color: "orange",
  },
  {
    icon: "💼",
    title: "آمادگی برای آزمون‌های استخدامی",
    desc: "گام‌به‌گام تا موفقیت در آزمون‌های استخدامی — منابع، برنامه‌ریزی و نکات کلیدی",
    href: "/employment",
    color: "rose",
  },
  {
    icon: "🌱",
    title: "عادت‌های مطالعه‌ی موفق",
    desc: "ساخت عادت‌های مطالعه‌ی پایدار، روتین روزانه و روش‌های افزایش تمرکز برای دانشجویان",
    href: "/books",
    color: "yellow",
  },
];

export default function HomeGuides() {
  return (
    <section className="section" style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #fff 100%)" }}>
      <div className="container">
        <div className="section__header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              background: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            📚 مقالات و راهنماها
          </span>
          <h2 className="section__title">راهنمای مطالعه و یادگیری مؤثر</h2>
          <p className="section__subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
            جدیدترین مقالات و راهنماهای علمی برای موفقیت تحصیلی — از انتخاب منبع تا
            تکنیک‌های مطالعه
          </p>
        </div>

        <div className="home-guides-grid">
          {guides.map((guide, i) => (
            <Link
              key={i}
              href={guide.href}
              className={`home-guide-card home-guide-card--${guide.color}`}
            >
              <div className="home-guide-card__icon">{guide.icon}</div>
              <h3 className="home-guide-card__title">{guide.title}</h3>
              <p className="home-guide-card__desc">{guide.desc}</p>
              <span className="home-guide-card__link">
                مطالعه بیشتر →
              </span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link
            href="/articles"
            className="btn btn--primary"
            style={{ padding: "12px 32px", fontSize: "15px" }}
          >
            📖 مشاهده همه مقالات
          </Link>
        </div>
      </div>
    </section>
  );
}