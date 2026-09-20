import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ─── GET: لیست کامنت‌های یه فایل (با ریپلای‌ها) ───
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileSlug = searchParams.get("fileSlug");

    if (!fileSlug) {
      return NextResponse.json(
        { error: "شناسه فایل لازم است" },
        { status: 400 }
      );
    }

    // فقط کامنت‌های اصلی (بدون parent)
    const comments = await prisma.comment.findMany({
      where: {
        fileSlug,
        isApproved: true,
        parentId: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          where: { isApproved: true },
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: { isApproved: true },
              orderBy: { createdAt: "asc" },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت کامنت‌ها" },
      { status: 500 }
    );
  }
}

// ─── POST: ارسال کامنت یا ریپلای ───
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "برای ثبت نظر باید وارد شوید" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 401 });
    }

    const body = await request.json();
    const { fileSlug, content, parentId } = body;

    // اعتبارسنجی
    if (!fileSlug || !content) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: "متن نظر باید حداقل ۳ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "متن نظر نباید بیش از ۱۰۰۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    // اگه parentId داره، چک کن وجود داره
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "کامنت والد یافت نشد" },
          { status: 404 }
        );
      }

      // جلوگیری از ریپلای به ریپلای (فقط ۲ سطح)
      if (parent.parentId) {
        return NextResponse.json(
          { error: "امکان پاسخ به پاسخ وجود ندارد" },
          { status: 400 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        fileSlug,
        content: content.trim(),
        isApproved: true,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json({ error: "خطا در ثبت نظر" }, { status: 500 });
  }
}

// ─── DELETE: حذف کامنت (ادمین یا صاحب کامنت) ───
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const userRole = (session.user as { role?: string }).role;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "شناسه کامنت لازم است" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "کامنت یافت نشد" },
        { status: 404 }
      );
    }

    const isAdmin = userRole === "admin";
    const isOwner = comment.userId === userId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id } });

    return NextResponse.json({ message: "کامنت حذف شد" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ error: "خطا در حذف کامنت" }, { status: 500 });
  }
}