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
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── GET: لیست دسته‌ها ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(categories);
}

// ─── POST: افزودن دسته ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug: customSlug, icon, color, description, order } = body;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
  }

  let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
  if (!baseSlug) {
    baseSlug = `category-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    const category = await prisma.category.create({
      data: {
        slug,
        title: title.trim(),
        icon: icon || "📁",
        color: color || "blue",
        description: description || null,
        order: order ? parseInt(String(order)) : 0,
        isActive: true,
      },
    });

    await logActivity({
      adminId,
      action: "create",
      entityType: "Settings", // می‌تونیم بعداً "Category" اضافه کنیم
      entityId: category.id,
      details: {
        title: category.title,
        slug: category.slug,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }
}

// ─── PUT: ویرایش دسته ───
export async function PUT(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { id, title, icon, color, description, order, isActive } = body;

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  try {
    const oldCategory = await prisma.category.findUnique({ where: { id } });
    if (!oldCategory) {
      return NextResponse.json({ error: "دسته یافت نشد" }, { status: 404 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        title: title ?? oldCategory.title,
        icon: icon ?? oldCategory.icon,
        color: color ?? oldCategory.color,
        description:
          description !== undefined
            ? description || null
            : oldCategory.description,
        order:
          order !== undefined && order !== ""
            ? parseInt(String(order))
            : oldCategory.order,
        isActive:
          isActive !== undefined ? Boolean(isActive) : oldCategory.isActive,
      },
    });

    await logActivity({
      adminId,
      action: "update",
      entityType: "Settings",
      entityId: id,
      details: {
        title: category.title,
        slug: category.slug,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "خطا در ویرایش" }, { status: 500 });
  }
}

// ─── DELETE: حذف دسته ───
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
    const category = await prisma.category.findUnique({
      where: { id },
      select: { title: true, slug: true },
    });

    await prisma.category.delete({ where: { id } });

    await logActivity({
      adminId,
      action: "delete",
      entityType: "Settings",
      entityId: id,
      details: category || { id },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ message: "دسته حذف شد" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}