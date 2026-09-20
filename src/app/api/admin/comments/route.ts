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

// ─── GET: لیست همه کامنت‌ها (برای ادمین) ───
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const comments = await prisma.comment.findMany({
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

  return NextResponse.json(comments);
}

// ─── PATCH: تایید یا رد کامنت ───
export async function PATCH(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { id, isApproved } = body;

  if (!id || typeof isApproved !== "boolean") {
    return NextResponse.json(
      { error: "اطلاعات ناقص است" },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی" },
      { status: 500 }
    );
  }
}

// ─── DELETE: حذف کامنت (ادمین) ───
export async function DELETE(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "شناسه کامنت لازم است" },
      { status: 400 }
    );
  }

  try {
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ message: "کامنت حذف شد" });
  } catch (error) {
    console.error("Delete admin comment error:", error);
    return NextResponse.json(
      { error: "خطا در حذف" },
      { status: 500 }
    );
  }
}