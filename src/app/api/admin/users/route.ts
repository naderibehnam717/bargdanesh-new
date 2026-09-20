import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false, userId: null };
  if ((session.user as { role?: string }).role !== "admin") {
    return { ok: false, userId: null };
  }
  return {
    ok: true,
    userId: (session.user as { id?: string }).id || null,
  };
}

// ─── GET: لیست کاربران ───
export async function GET() {
  const check = await checkAdmin();
  if (!check.ok) {
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
  const check = await checkAdmin();
  if (!check.ok) {
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

  if (id === check.userId) {
    return NextResponse.json(
      { error: "نمی‌تونی نقش خودت رو تغییر بدی" },
      { status: 400 }
    );
  }

  try {
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "خطا در تغییر نقش" }, { status: 500 });
  }
}

// ─── DELETE: حذف کاربر ───
export async function DELETE(request: Request) {
  const check = await checkAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  if (id === check.userId) {
    return NextResponse.json(
      { error: "نمی‌تونی خودت رو حذف کنی" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "کاربر حذف شد" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}