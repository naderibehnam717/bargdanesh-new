import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // تعداد سوالات منتشرشده
    const count = await prisma.quiz.count({
      where: { isPublished: true },
    });

    if (count === 0) {
      return NextResponse.json(
        { error: "سوالی موجود نیست" },
        { status: 404 }
      );
    }

    // یه سوال رندوم
    const skip = Math.floor(Math.random() * count);
    const quiz = await prisma.quiz.findFirst({
      where: { isPublished: true },
      skip,
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "سوالی موجود نیست" },
        { status: 404 }
      );
    }

    // آمار
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
    });
  } catch (error) {
    console.error("Quiz random error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوال" },
      { status: 500 }
    );
  }
}