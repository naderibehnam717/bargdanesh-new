import type { Metadata } from "next";
import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";

export const metadata: Metadata = {
  title: "جزوات دانشگاهی",
  description:
    "دانلود رایگان جزوات کامل دروس دانشگاهی — فیزیک، شیمی، کامپیوتر، روانشناسی، علوم تربیتی و سایر رشته‌ها در برگ دانش",
  keywords: [
    "جزوه دانشگاهی",
    "دانلود جزوه",
    "جزوه رایگان",
    "جزوه فیزیک",
    "جزوه شیمی",
    "جزوه روانشناسی",
    "جزوه کامپیوتر",
    "برگ دانش",
  ],
  openGraph: {
    title: "جزوات دانشگاهی | برگ دانش",
    description:
      "دانلود رایگان جزوات کامل دروس دانشگاهی — فیزیک، شیمی، کامپیوتر، روانشناسی و سایر رشته‌ها",
    url: "https://www.bargdanesh.ir/notes",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bargdanesh.ir/notes",
  },
};

export default function NotesPage() {
  const notes = allFiles.filter((f) => f.type === "جزوه");

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📚 جزوات دانشگاهی</h1>
          <p className="page-header__subtitle">جزوات کامل دروس دانشگاهی</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div
            className="section__header"
            style={{ textAlign: "right", marginLeft: 0, maxWidth: "100%" }}
          >
            <h2 className="section__title">📚 لیست جزوات</h2>
            <p className="section__subtitle">{notes.length} جزوه موجود است</p>
          </div>

          <div className="cards-grid">
            {notes.length === 0 ? (
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
              notes.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}