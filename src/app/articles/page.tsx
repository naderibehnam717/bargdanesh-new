export default function ArticlesPage() {
  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📄 مقالات</h1>
          <p className="page-header__subtitle">مقالات علمی و پژوهشی در رشته‌های مختلف</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="cards-grid">
            <p
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
                gridColumn: "1 / -1",
                fontSize: "15px",
              }}
            >
              📝 هنوز مقاله‌ای اضافه نشده است. به‌زودی...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}