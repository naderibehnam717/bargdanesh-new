"use client";

import { useState } from "react";
import { allFiles } from "@/lib/files";
import FileCard from "@/components/FileCard";

const filters = ["همه", "کتاب", "رمان", "داستان", "شعر", "نمایشنامه"];

export default function BooksPage() {
  const [activeFilter, setActiveFilter] = useState("همه");

  const books = allFiles.filter((f) => f.type === "منابع غیر درسی");
  const filtered =
    activeFilter === "همه" ? books : books.filter((f) => f.category === activeFilter);

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📖 منابع غیر درسی</h1>
          <p className="page-header__subtitle">
            کتاب، رمان، شعر و... — برای علاقه‌مندان به مطالعه
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="filter-bar">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-bar__item ${
                  activeFilter === filter ? "filter-bar__item--active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="cards-grid">
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", padding: "60px 20px", color: "#999", gridColumn: "1 / -1" }}>
                📚 هنوز منبعی اضافه نشده است.
              </p>
            ) : (
              filtered.map((file, i) => <FileCard key={i} file={file} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}