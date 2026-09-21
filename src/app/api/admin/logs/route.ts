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
  const action = searchParams.get("action");
  const entityType = searchParams.get("entityType");
  const adminId = searchParams.get("adminId");

  try {
    const where: {
      action?: string;
      entityType?: string;
      adminId?: string;
    } = {};

    if (action && action !== "all") where.action = action;
    if (entityType && entityType !== "all") where.entityType = entityType;
    if (adminId && adminId !== "all") where.adminId = adminId;

    const logs = await prisma.activityLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Logs error:", error);
    return NextResponse.json({ error: "خطا در دریافت" }, { status: 500 });
  }
}

// ─── DELETE: پاک کردن لاگ‌های قدیمی ───
export async function DELETE(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  if (isNaN(days) || days < 1) {
    return NextResponse.json({ error: "روز نامعتبر" }, { status: 400 });
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return NextResponse.json({
      message: `${result.count} لاگ قدیمی‌تر از ${days} روز حذف شد`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Delete logs error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}