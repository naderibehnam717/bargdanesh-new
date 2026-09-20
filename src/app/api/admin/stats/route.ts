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

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ─── آمار کلی ───
    const [
      totalUsers,
      totalFiles,
      totalDownloads,
      totalComments,
      totalQuizzes,
      totalQuizAttempts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.file.count(),
      prisma.download.count(),
      prisma.comment.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
    ]);

    // ─── کاربران جدید در ۳۰ روز ───
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    // ─── دانلودها در ۳۰ روز ───
    const downloadsLastMonth = await prisma.download.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    // ─── کامنت‌ها در ۳۰ روز ───
    const commentsLastMonth = await prisma.comment.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    // ─── گروه‌بندی بر اساس روز (۳۰ روز اخیر) ───
    const dailyUsers: Record<string, number> = {};
    const dailyDownloads: Record<string, number> = {};
    const dailyComments: Record<string, number> = {};

    // ساخت لیست ۳۰ روز
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyUsers[key] = 0;
      dailyDownloads[key] = 0;
      dailyComments[key] = 0;
    }

    newUsers.forEach((u) => {
      const key = u.createdAt.toISOString().split("T")[0];
      if (dailyUsers[key] !== undefined) dailyUsers[key]++;
    });

    downloadsLastMonth.forEach((d) => {
      const key = d.createdAt.toISOString().split("T")[0];
      if (dailyDownloads[key] !== undefined) dailyDownloads[key]++;
    });

    commentsLastMonth.forEach((c) => {
      const key = c.createdAt.toISOString().split("T")[0];
      if (dailyComments[key] !== undefined) dailyComments[key]++;
    });

    // ─── پرفروش‌ترین فایل‌ها (۱۰ تا) ───
    const topDownloads = await prisma.download.groupBy({
      by: ["fileTitle"],
      _count: { fileTitle: true },
      orderBy: { _count: { fileTitle: "desc" } },
      take: 10,
    });

    // ─── فعال‌ترین کاربران (۱۰ تا) ───
    const activeUsers = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            downloads: true,
            comments: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        downloads: { _count: "desc" },
      },
    });

    // ─── توزیع کامنت بر اساس فایل (۵ تا) ───
    const topCommentFiles = await prisma.comment.groupBy({
      by: ["fileSlug"],
      _count: { fileSlug: true },
      orderBy: { _count: { fileSlug: "desc" } },
      take: 5,
    });

    // ─── توزیع کوییز بر اساس دسته ───
    const quizByCategory = await prisma.quiz.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    return NextResponse.json({
      totals: {
        users: totalUsers,
        files: totalFiles,
        downloads: totalDownloads,
        comments: totalComments,
        quizzes: totalQuizzes,
        quizAttempts: totalQuizAttempts,
      },
      daily: {
        users: Object.entries(dailyUsers).map(([date, count]) => ({
          date,
          count,
        })),
        downloads: Object.entries(dailyDownloads).map(([date, count]) => ({
          date,
          count,
        })),
        comments: Object.entries(dailyComments).map(([date, count]) => ({
          date,
          count,
        })),
      },
      topDownloads: topDownloads.map((t) => ({
        title: t.fileTitle,
        count: t._count.fileTitle,
      })),
      activeUsers: activeUsers.map((u) => ({
        id: u.id,
        name: u.name || "بدون نام",
        email: u.email,
        downloads: u._count.downloads,
        comments: u._count.comments,
        favorites: u._count.favorites,
      })),
      topCommentFiles: topCommentFiles.map((t) => ({
        slug: t.fileSlug,
        count: t._count.fileSlug,
      })),
      quizByCategory: quizByCategory.map((q) => ({
        category: q.category,
        count: q._count.category,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "خطا در محاسبه" }, { status: 500 });
  }
}