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

// ─── GET: لیست سوالات ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quizzes);
}

// ─── POST: افزودن سوال ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();

  const { question, options, correctIdx, explanation, category, level } = body;

  if (!question || !options || !Array.isArray(options)) {
    return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
  }

  if (options.length !== 4 || options.some((o: string) => !o.trim())) {
    return NextResponse.json(
      { error: "باید ۴ گزینه پر شده باشد" },
      { status: 400 }
    );
  }

  if (typeof correctIdx !== "number" || correctIdx < 0 || correctIdx > 3) {
    return NextResponse.json(
      { error: "گزینه‌ی درست نامعتبر است" },
      { status: 400 }
    );
  }

  if (!category) {
    return NextResponse.json(
      { error: "دسته‌بندی الزامی است" },
      { status: 400 }
    );
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        question,
        options,
        correctIdx,
        explanation: explanation || null,
        category,
        level: level || "دانشگاهی",
        isPublished: true,
      },
    });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "create",
      entityType: "Quiz",
      entityId: quiz.id,
      details: {
        question: quiz.question.slice(0, 100),
        category: quiz.category,
        level: quiz.level,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Create quiz error:", error);
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }
}

// ─── DELETE: حذف سوال ───
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

  try {
    // قبل از حذف، اطلاعات رو بگیر
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      select: { question: true, category: true, level: true },
    });

    await prisma.quiz.delete({ where: { id } });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "delete",
      entityType: "Quiz",
      entityId: id,
      details: quiz
        ? {
            question: quiz.question.slice(0, 100),
            category: quiz.category,
            level: quiz.level,
          }
        : { id },
    });

    return NextResponse.json({ message: "سوال حذف شد" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}