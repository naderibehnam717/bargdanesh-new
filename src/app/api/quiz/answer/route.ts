import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizId, selectedIdx } = body;

    // اعتبارسنجی
    if (!quizId || typeof selectedIdx !== "number") {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    // سوال رو پیدا کن
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "سوال یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی پاسخ
    const isCorrect = quiz.correctIdx === selectedIdx;

    // اطلاعات کاربر (اگه لاگین باشه)
    const session = await auth();
    const userId = session?.user
      ? (session.user as { id?: string }).id
      : null;

    // ثبت پاسخ
    await prisma.quizAttempt.create({
      data: {
        userId: userId || null,
        quizId: quiz.id,
        selectedIdx,
        isCorrect,
      },
    });

    // آمار به‌روز
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: quiz.id },
      select: { isCorrect: true },
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;

    return NextResponse.json({
      isCorrect,
      correctIdx: quiz.correctIdx,
      explanation: quiz.explanation,
      totalAttempts,
      correctAttempts,
    });
  } catch (error) {
    console.error("Quiz answer error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت پاسخ" },
      { status: 500 }
    );
  }
}