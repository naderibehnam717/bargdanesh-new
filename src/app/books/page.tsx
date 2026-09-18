import type { Metadata } from "next";
import { allFiles } from "@/lib/files";
import BooksClient from "./BooksClient";

export const metadata: Metadata = {
  title: "منابع غیر درسی — کتاب، رمان، شعر",
  description:
    "دانلود رایگان کتاب، رمان، داستان، شعر و نمایشنامه — مجموعه‌ای متنوع برای علاقه‌مندان به مطالعه",
  alternates: {
    canonical: "https://www.bargdanesh.ir/books",
  },
  openGraph: {
    title: "منابع غیر درسی | برگ دانش",
    description:
      "دانلود رایگان کتاب، رمان، داستان، شعر و نمایشنامه",
    url: "https://www.bargdanesh.ir/books",
    type: "website",
  },
};

export default function BooksPage() {
  const books = allFiles.filter((f) => f.type === "منابع غیر درسی");

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
          <BooksClient books={books} />
        </div>
      </main>
    </>
  );
}