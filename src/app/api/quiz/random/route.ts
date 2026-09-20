import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── ذخیره‌ی سوالات دیده‌شده در session ───
// (برای هر کاربر جداگانه نیست، ولی حداقل در هر session)
const seenCache = new Map<string, Set<string>>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cacheTimestamps = new Map<string, number>();

function getSeenSet(sessionId: string): Set<string> {
  const now = Date.now();
  const lastTime = cacheTimestamps.get(sessionId) || 0;

  // اگه cache منقضی شده، پاک کن
  if (now - lastTime > CACHE_TTL) {
    seenCache.delete(sessionId);
    cacheTimestamps.set(sessionId, now);
  }

  if (!seenCache.has(sessionId)) {
    seenCache.set(sessionId, new Set());
  }

  return seenCache.get(sessionId)!;
}

export async function GET(request: Request) {
  try {
    // ─── Session ID از header یا IP ───
    const headers = request.headers;
    const sessionId =
      headers.get("x-session-id") ||
      headers.get("x-forwarded-for") ||
      "default";

    const seen = getSeenSet(sessionId);

    // ─── کل سوالات منتشرشده ───
    const allQuizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      select: { id: true },
    });

    if (allQuizzes.length === 0) {
      return NextResponse.json(
        { error: "سوالی موجود نیست" },
        { status: 404 }
      );
    }

    // ─── فیلتر سوالات دیده‌نشده ───
    const unseen = allQuizzes.filter((q) => !seen.has(q.id));

    // اگه همه دیده شدن، ریست کن
    if (unseen.length === 0) {
      seen.clear();
      // دوباره همه رو unseen کن
      const freshQuizzes = await prisma.quiz.findMany({
        where: { isPublished: true },
      });

      const randomIndex = Math.floor(Math.random() * freshQuizzes.length);
      const quiz = freshQuizzes[randomIndex];

      seen.add(quiz.id);

      return await buildResponse(quiz.id, freshQuizzes.length, seen.size);
    }

    // ─── انتخاب رندوم از unseen ───
    const randomIndex = Math.floor(Math.random() * unseen.length);
    const selectedId = unseen[randomIndex].id;

    // علامت‌گذاری به‌عنوان دیده‌شده
    seen.add(selectedId);

    return await buildResponse(
      selectedId,
      allQuizzes.length,
      seen.size
    );
  } catch (error) {
    console.error("Quiz random error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوال" },
      { status: 500 }
    );
  }
}

async function buildResponse(
  quizId: string,
  totalQuizzes: number,
  seenCount: number
) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    return NextResponse.json(
      { error: "سوال یافت نشد" },
      { status: 404 }
    );
  }

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
    seenCount,
    totalQuizzes,
  });
}