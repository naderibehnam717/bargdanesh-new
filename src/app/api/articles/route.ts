import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");

    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      ...(limit ? { take: parseInt(limit) } : {}),
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        author: true,
        viewCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Articles GET error:", error);
    return NextResponse.json([]);
  }
}