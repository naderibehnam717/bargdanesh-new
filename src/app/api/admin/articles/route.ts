import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return (session.user as { id?: string }).id || null;
}

function slugify(text: string): string {
  const hasPersian = /[\u0600-\u06FF]/.test(text);
  if (hasPersian) {
    return `article-${Date.now()}`;
  }
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── GET: لیست مقالات ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const articles = await prisma.article.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(articles);
}

// ─── POST: افزودن مقاله ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug: customSlug, excerpt, content, coverImage, category, tags, author, isPublished, order } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "عنوان و محتوا الزامی هستند" },
      { status: 400 }
    );
  }

  let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
  if (!baseSlug) {
    baseSlug = `article-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    const article = await prisma.article.create({
      data: {
        slug,
        title: title.trim(),
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category: category || null,
        tags: tags || null,
        author: author || null,
        isPublished: isPublished !== false,
        order: order ? parseInt(String(order)) : 0,
      },
    });

    await logActivity({
      adminId,
      action: "create",
      entityType: "File",
      entityId: article.id,
      details: {
        title: article.title,
        slug: article.slug,
        type: "article",
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }
}

// ─── PUT: ویرایش مقاله ───
export async function PUT(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  try {
    const oldArticle = await prisma.article.findUnique({ where: { id } });
    if (!oldArticle) {
      return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title ?? oldArticle.title,
        excerpt: data.excerpt !== undefined ? data.excerpt || null : oldArticle.excerpt,
        content: data.content ?? oldArticle.content,
        coverImage: data.coverImage !== undefined ? data.coverImage || null : oldArticle.coverImage,
        category: data.category !== undefined ? data.category || null : oldArticle.category,
        tags: data.tags !== undefined ? data.tags || null : oldArticle.tags,
        author: data.author !== undefined ? data.author || null : oldArticle.author,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : oldArticle.isPublished,
        order: data.order !== undefined && data.order !== "" ? parseInt(String(data.order)) : oldArticle.order,
      },
    });

    await logActivity({
      adminId,
      action: "update",
      entityType: "File",
      entityId: id,
      details: {
        title: article.title,
        slug: article.slug,
        type: "article",
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json({ error: "خطا در ویرایش" }, { status: 500 });
  }
}

// ─── DELETE: حذف مقاله ───
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
    const article = await prisma.article.findUnique({
      where: { id },
      select: { title: true, slug: true },
    });

    await prisma.article.delete({ where: { id } });

    await logActivity({
      adminId,
      action: "delete",
      entityType: "File",
      entityId: id,
      details: article || { id },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ message: "مقاله حذف شد" });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}