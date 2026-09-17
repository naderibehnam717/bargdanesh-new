"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Settings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  telegram: string;
  instagram: string;
  twitter: string;
  youtube: string;
  footerText: string;
}

const defaultSettings: Settings = {
  siteName: "برگ دانش",
  siteEmail: "info@bargdanesh.ir",
  sitePhone: "۰۹۱۲۳۴۵۶۷۸۹",
  telegram: "",
  instagram: "",
  twitter: "",
  youtube: "",
  footerText: "© ۱۴۰۵ - برگ دانش ، تمامی حقوق محفوظ است",
};

export default function Footer() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      } catch {
        // از مقادیر پیش‌فرض استفاده می‌کنیم
      }
    }
    load();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="logo logo--light">
              <span className="logo__icon">📚</span>
              <span>{settings.siteName}</span>
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
              <li>📧 {settings.siteEmail}</li>
              <li>📱 {settings.sitePhone}</li>
              <li><Link href="/about">درباره ما</Link></li>
              <li><Link href="/contact">تماس با ما</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
}