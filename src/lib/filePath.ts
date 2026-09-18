import type { FileItem } from "./files";

export function getFilePath(file: FileItem): string {
  // منابع استخدامی
  if (file.type === "منابع استخدامی") {
    return `/employment/${file.slug}`;
  }

  // نمونه سوال
  if (file.type === "نمونه سوال") {
    return `/exams/${file.slug}`;
  }

  // منابع غیر درسی → همه زیر /books
  if (file.type === "منابع غیر درسی") {
    return `/books/${file.slug}`;
  }

  // جزوه / کتاب درسی
  if (file.level === "دانشگاهی") {
    return `/university/${file.slug}`;
  }

  if (file.level === "مدرسه ای") {
    return `/school/${file.slug}`;
  }

  // پیش‌فرض
  return `/files/${file.slug}`;
}