import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const field = searchParams.get("field");

    const where: { year?: number; field?: string } = {};

    if (year && year !== "all") {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) where.year = yearNum;
    }

    if (field && field !== "all") {
      where.field = field;
    }

    const konkur = await prisma.konkur.findMany({
      where,
      orderBy: [{ year: "desc" }, { order: "asc" }],
    });

    return NextResponse.json(konkur);
  } catch (error) {
    console.error("Konkur list error:", error);
    return NextResponse.json({ error: "خطا در دریافت" }, { status: 500 });
  }
}