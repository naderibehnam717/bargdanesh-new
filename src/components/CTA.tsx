export default function CTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <div className="cta__content">
            <h2 className="cta__title">از جدیدترین فایل‌ها باخبر شو</h2>
            <p className="cta__desc">
              ایمیلت را وارد کن تا هر هفته جدیدترین مطالب را برایت بفرستیم.
            </p>
          </div>
          <form className="cta__form" action="#" method="post">
            <input
              type="email"
              className="cta__input"
              placeholder="ایمیل خود را وارد کنید"
              required
            />
            <button type="submit" className="btn btn--primary">
              عضویت
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}