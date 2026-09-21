import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return (session.user as { id?: string }).id || null;
}

// ─── GET: لیست کاربران ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          downloads: true,
          comments: true,
          favorites: true,
        },
      },
    },
  });

  return NextResponse.json(users);
}

// ─── PATCH: تغییر نقش ───
export async function PATCH(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { id, role } = body;

  if (!id || !role) {
    return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
  }

  if (role !== "user" && role !== "admin") {
    return NextResponse.json({ error: "نقش نامعتبر" }, { status: 400 });
  }

  if (id === adminId) {
    return NextResponse.json(
      { error: "نمی‌تونی نقش خودت رو تغییر بدی" },
      { status: 400 }
    );
  }

  try {
    // قبل از تغییر، نقش قدیمی رو بگیر
    const oldUser = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true, role: true },
    });

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "change_role",
      entityType: "User",
      entityId: id,
      details: {
        name: oldUser?.name || "بدون نام",
        email: oldUser?.email,
        oldRole: oldUser?.role,
        newRole: role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "خطا در تغییر نقش" }, { status: 500 });
  }
}

// ─── DELETE: حذف کاربر ───
export async function DELETE(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  if (id === adminId) {
    return NextResponse.json(
      { error: "نمی‌تونی خودت رو حذف کنی" },
      { status: 400 }
    );
  }

  try {
    // قبل از حذف، اطلاعات رو بگیر
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true, role: true },
    });

    await prisma.user.delete({ where: { id } });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "delete",
      entityType: "User",
      entityId: id,
      details: user || { id },
    });

    return NextResponse.json({ message: "کاربر حذف شد" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}