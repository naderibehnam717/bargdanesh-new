import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  if ((session.user as { role?: string }).role !== "admin") return false;
  return true;
}

export async function GET(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
  const userId = searchParams.get("userId");

  try {
    const downloads = await prisma.download.findMany({
      where: userId ? { userId } : undefined,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("Downloads error:", error);
    return NextResponse.json({ error: "خطا در دریافت" }, { status: 500 });
  }
}