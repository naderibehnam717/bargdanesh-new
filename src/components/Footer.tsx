import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="logo logo--light">
              <span className="logo__icon">📚</span>
              <span>برگ دانش</span>
            </div>
            <p className="footer__desc">
              مرجع دانلود جزوه، کتاب و مقاله.
              <br />
              <strong style={{ color: "#fff" }}>دانش، یک برگ فاصله دارد.</strong>
            </p>
          </div>

          <div>
            <h4 className="footer__title">دسترسی سریع</h4>
            <ul className="footer__list">
              <li><Link href="/">خانه</Link></li>
              <li><Link href="/university">دانشگاهی</Link></li>
              <li><Link href="/school">مدرسه ای</Link></li>
              <li><Link href="/exams">نمونه سوال</Link></li>
              <li><Link href="/articles">مقالات</Link></li>
              <li><Link href="/books">منابع غیر درسی</Link></li>
              <li><Link href="/employment">منابع استخدامی</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">موضوعات</h4>
            <ul className="footer__list">
              <li><Link href="/psychology">روانشناسی</Link></li>
              <li><Link href="/education">علوم تربیتی</Link></li>
              <li><Link href="/sociology">جامعه‌شناسی</Link></li>
              <li><Link href="/english">زبان انگلیسی</Link></li>
              <li><Link href="/computer">کامپیوتر</Link></li>
              <li><Link href="/physics">فیزیک</Link></li>
              <li><Link href="/chemistry">شیمی</Link></li>
              <li><Link href="/islamic">معارف</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">ارتباط با ما</h4>
            <ul className="footer__list">
              <li>📧 info@bargdanesh.ir</li>
              <li>📱 ۰۹۱۲۳۴۵۶۷۸۹</li>
              <li><Link href="/about">درباره ما</Link></li>
              <li><Link href="/contact">تماس با ما</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 1405 - برگ دانش ، تمامی حقوق محفوظ است</p>
        </div>
      </div>
    </footer>
  );
}