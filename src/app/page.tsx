import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StudentConcerns from "@/components/StudentConcerns";
import FileCard from "@/components/FileCard";
import StatsBox from "@/components/StatsBox";
import Countdown from "@/components/Countdown";
import QuotesSlider from "@/components/QuotesSlider";
import UsefulLinks from "@/components/UsefulLinks";
import CTA from "@/components/CTA";
import { allFiles } from "@/lib/files";
import Link from "next/link";

export const metadata: Metadata = {
  title: "برگ دانش | دانش، یک برگ فاصله دارد",
  description:
    "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله دانشگاهی. دسترسی آسان به منابع آموزشی با کیفیت برای دانشجویان و دانش‌آموزان.",
  keywords: [
    "جزوه",
    "کتاب",
    "نمونه سوال",
    "مقاله",
    "دانلود رایگان",
    "منابع دانشگاهی",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://bargdanesh.ir",
  },
};

export default function Home() {
  const latestFiles = [...allFiles].reverse().slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <div className="layout-with-sidebar">
            <div>
              <div className="section__header">
                <h2 className="section__title">چرا برگ دانش؟</h2>
                <p className="section__subtitle">چیزی که ما را متفاوت می‌کند</p>
              </div>

              <StudentConcerns />

              <div className="features" style={{ marginBottom: "48px" }}>
                <div className="feature">
                  <div className="feature__icon">⚡</div>
                  <h3 className="feature__title">دسترسی سریع</h3>
                  <p className="feature__desc">
                    در کمترین زمان فایل مورد نظرت را پیدا کن.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🎯</div>
                  <h3 className="feature__title">محتوای باکیفیت</h3>
                  <p className="feature__desc">
                    همه فایل‌ها با دقت انتخاب شده‌اند.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🆓</div>
                  <h3 className="feature__title">کاملاً رایگان</h3>
                  <p className="feature__desc">
                    دانلود تمام فایل‌ها بدون هزینه.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature__icon">🔄</div>
                  <h3 className="feature__title">به‌روزرسانی مداوم</h3>
                  <p className="feature__desc">
                    هر هفته فایل‌های جدید اضافه می‌شود.
                  </p>
                </div>
              </div>

              <div
                className="section__header"
                style={{
                  textAlign: "right",
                  marginLeft: 0,
                  maxWidth: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2 className="section__title">🆕 آخرین فایل‌های اضافه‌شده</h2>
                  <p className="section__subtitle">تازه‌ترین منابع برگ دانش</p>
                </div>
                <Link href="/notes" className="btn btn--outline btn--sm">
                  مشاهده همه →
                </Link>
              </div>

              <div className="cards-grid" style={{ marginBottom: "48px" }}>
                {latestFiles.map((file, i) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>

              <StatsBox />
            </div>

            <aside className="sidebar">
              <Countdown />
              <QuotesSlider />
              <UsefulLinks />
            </aside>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}