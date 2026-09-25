import { NextResponse } from "next/server";
import { getAllFiles } from "@/lib/files";
import { prisma } from "@/lib/prisma";
import { getFilePath } from "@/lib/filePath";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // ─── جستجو در فایل‌ها ───
    const allFiles = await getAllFiles();
    const matchedFiles = allFiles
      .filter((file) => {
        const text = [
          file.title,
          file.desc,
          file.category,
          file.type,
          file.level,
          file.author || "",
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      })
      .map((file) => ({
        id: `file-${file.slug}`,
        title: file.title,
        description: file.desc,
        category: file.category,
        type: file.type,
        href: getFilePath(file),
        badge: file.type,
      }));

    // ─── جستجو در کنکورها ───
    const matchedKonkur = await prisma.konkur.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { subtitle: { contains: q, mode: "insensitive" } },
          { field: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      orderBy: [{ year: "desc" }, { order: "asc" }],
    });

    const konkurResults = matchedKonkur.map((k) => ({
      id: `konkur-${k.id}`,
      title: k.subtitle ? `${k.title} — ${k.subtitle}` : k.title,
      description:
        k.description ||
        `دفترچه سوالات و کلید پاسخ کنکور ${k.year} رشته ${k.field}`,
      category: k.field,
      type: "کنکور",
      href: `/konkur/${k.slug}`,
      badge: `کنکور ${k.year}`,
    }));

    // ─── ترکیب نتایج ───
    const results = [...konkurResults, ...matchedFiles].slice(0, 30);

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], total: 0, error: "خطا در جستجو" },
      { status: 500 }
    );
  }
}