import { getAllFiles } from "@/lib/files";

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function StatsBox() {
  const allFiles = await getAllFiles();

  const notesCount = allFiles.filter((f) => f.type === "جزوه").length;
  const booksCount = allFiles.filter((f) => f.type === "کتاب").length;
  const examsCount = allFiles.filter((f) => f.type === "نمونه سوال").length;
  const articlesCount = 0;

  return (
    <div className="stats-box">
      <div className="stat-item">
        <div className="stat-item__number">{toFa(notesCount)}</div>
        <div className="stat-item__label">📚 جزوه</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__number">{toFa(booksCount)}</div>
        <div className="stat-item__label">📖 کتاب</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__number">{toFa(examsCount)}</div>
        <div className="stat-item__label">📝 نمونه سوال</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__number">{toFa(articlesCount)}</div>
        <div className="stat-item__label">📄 مقاله</div>
      </div>
    </div>
  );
}