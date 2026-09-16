import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";

export default function ExamsPage() {
  const uniExams = allFiles.filter((f) => f.type === "نمونه سوال" && f.level === "دانشگاهی");
  const schoolExams = allFiles.filter((f) => f.type === "نمونه سوال" && f.level === "مدرسه ای");

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📝 نمونه سوال</h1>
          <p className="page-header__subtitle">آرشیو نمونه سوالات دانشگاهی و مدرسه ای</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">🎓 نمونه سوال دانشگاهی</h2>
          </div>

          <div className="cards-grid" style={{ marginBottom: "48px" }}>
            {uniExams.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#999", gridColumn: "1 / -1" }}>
                فایلی موجود نیست
              </p>
            ) : (
              uniExams.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>

          <div className="section__header">
            <h2 className="section__title">🏫 نمونه سوال مدرسه ای</h2>
          </div>

          <div className="cards-grid">
            {schoolExams.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#999", gridColumn: "1 / -1" }}>
                فایلی موجود نیست
              </p>
            ) : (
              schoolExams.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}