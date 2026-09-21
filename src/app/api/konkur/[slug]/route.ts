import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const konkur = await prisma.konkur.findUnique({
      where: { slug },
    });

    if (!konkur) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(konkur);
  } catch (error) {
    console.error("Konkur detail error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}