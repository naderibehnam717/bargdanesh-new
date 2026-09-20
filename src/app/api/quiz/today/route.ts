import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedQuizzes } from "@/lib/quiz-data";

export const dynamic = "force-dynamic";

// ─── انتخاب سوال روز (بدون تکرار تا پایان چرخه) ───
function getTodayIndex(totalQuizzes: number): number {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // سوال امروز بر اساس روز سال
  // چرخه‌ی کامل: هر تعداد سوال یه دور کامل
  return dayOfYear % totalQuizzes;
}

export async function GET() {
  try {
    // ۱. اگه DB خالیه، سوالات اولیه رو وارد کن
    const count = await prisma.quiz.count();
    if (count === 0) {
      await prisma.quiz.createMany({
        data: seedQuizzes.map((q) => ({
          question: q.question,
          options: q.options as unknown as object,
          correctIdx: q.correctIdx,
          explanation: q.explanation,
          category: q.category,
          level: q.level,
          isPublished: true,
        })),
      });
    }

    // ۲. تعداد سوالات منتشرشده
    const totalQuizzes = await prisma.quiz.count({
      where: { isPublished: true },
    });

    if (totalQuizzes === 0) {
      return NextResponse.json(
        { error: "سوالی موجود نیست" },
        { status: 404 }
      );
    }

    // ۳. سوال امروز بر اساس روز سال
    // چون تعداد سوالات زیاد می‌شه، هر روز سوال متفاوت
    const todayIndex = getTodayIndex(totalQuizzes);

    // ۴. سوالات رو با ترتیب ثابت بگیر
    const quizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
      skip: todayIndex,
      take: 1,
    });

    const quiz = quizzes[0];

    if (!quiz) {
      return NextResponse.json(
        { error: "سوالی یافت نشد" },
        { status: 404 }
      );
    }

    // ۵. آمار
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: quiz.id },
      select: { isCorrect: true },
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;

    return NextResponse.json({
      id: quiz.id,
      question: quiz.question,
      options: quiz.options,
      category: quiz.category,
      level: quiz.level,
      totalAttempts,
      correctAttempts,
      dayIndex: todayIndex + 1,
      totalQuizzes,
    });
  } catch (error) {
    console.error("Quiz today error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوال" },
      { status: 500 }
    );
  }
}