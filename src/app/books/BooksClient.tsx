"use client";

import { useState } from "react";
import FileCard from "@/components/FileCard";
import type { FileItem } from "@/lib/files"; // تایپ رو از فایل خودت import کن

const filters = ["همه", "کتاب", "رمان", "داستان", "شعر", "نمایشنامه"];

export default function BooksClient({ books }: { books: FileItem[] }) {
  const [activeFilter, setActiveFilter] = useState("همه");

  const filtered =
    activeFilter === "همه"
      ? books
      : books.filter((f) => f.category === activeFilter);

  return (
    <>
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
    </>
  );
}