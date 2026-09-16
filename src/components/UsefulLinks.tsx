export default function UsefulLinks() {
  return (
    <>
      <h3 className="sidebar__title">🔗 لینک‌های مفید</h3>
      <ul className="sidebar__list">
        <li className="sidebar__section">🏫 آموزش و پرورش</li>
        <li>
          <a
            href="https://my.medu.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            📌 مای مدیو
          </a>
        </li>
        <li>
          <a
            href="https://www.medu.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            🏛️ وزارت آموزش و پرورش
          </a>
        </li>
        <li>
          <a
            href="https://www.msrt.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            🏛️ وزارت علوم
          </a>
        </li>

        <li className="sidebar__section">🎓 سامانه‌ها</li>
        <li>
          <a
            href="https://www.sanjesh.org"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            📝 سازمان سنجش
          </a>
        </li>
        <li>
          <a
            href="https://Education.cfu.ac.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            🎓 گلستان فرهنگیان
          </a>
        </li>
        <li>
          <a
            href="https://reg.pnu.ac.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__link"
          >
            🎓 گلستان پیام نور
          </a>
        </li>
      </ul>
    </>
  );
}