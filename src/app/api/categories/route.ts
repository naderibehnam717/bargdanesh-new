import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        ...(group && group !== "all" ? { group } : {}),
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        icon: true,
        group: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json([]);
  }
}