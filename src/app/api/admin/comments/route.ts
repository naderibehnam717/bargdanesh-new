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

// ─── GET: لیست همه کامنت‌های اصلی ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const comments = await prisma.comment.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(comments);
}

// ─── PATCH: تایید یا رد کامنت ───
export async function PATCH(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { id, isApproved } = body;

  if (!id || typeof isApproved !== "boolean") {
    return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
  }

  try {
    // قبل از آپدیت، اطلاعات رو بگیر
    const oldComment = await prisma.comment.findUnique({
      where: { id },
      select: { content: true, fileSlug: true, isApproved: true },
    });

    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: isApproved ? "approve" : "reject",
      entityType: "Comment",
      entityId: id,
      details: {
        content: oldComment?.content?.slice(0, 100),
        fileSlug: oldComment?.fileSlug,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی" }, { status: 500 });
  }
}

// ─── DELETE: حذف کامنت ───
export async function DELETE(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "شناسه کامنت لازم است" }, { status: 400 });
  }

  try {
    // قبل از حذف، اطلاعات رو بگیر
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: {
        content: true,
        fileSlug: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    await prisma.comment.delete({ where: { id } });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "delete",
      entityType: "Comment",
      entityId: id,
      details: {
        content: comment?.content?.slice(0, 100),
        fileSlug: comment?.fileSlug,
        authorName: comment?.user?.name,
        authorEmail: comment?.user?.email,
      },
    });

    return NextResponse.json({ message: "کامنت حذف شد" });
  } catch (error) {
    console.error("Delete admin comment error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}