import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-log";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return (session.user as { id?: string }).id || null;
}

function slugify(text: string): string {
  const hasPersian = /[\u0600-\u06FF]/.test(text);
  if (hasPersian) {
    return `file-${Date.now()}`;
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

// ─── GET ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const files = await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(files);
}

// ─── POST ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();

  if (!body.title || !body.desc || !body.category) {
    return NextResponse.json(
      { error: "عنوان، توضیح و دسته‌بندی الزامی هستند" },
      { status: 400 }
    );
  }

  let baseSlug = slugify(body.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.file.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    const newFile = await prisma.file.create({
      data: {
        slug,
        title: body.title,
        desc: body.desc,
        category: body.category,
        type: body.type || "جزوه",
        level: body.level || "دانشگاهی",
        author: body.author || null,
        viewUrl: body.viewUrl || null,
        downloadUrl: body.downloadUrl || null,
        downloadName: body.downloadName || null,
        color: body.color || "blue",
      },
    });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "create",
      entityType: "File",
      entityId: newFile.id,
      details: {
        title: newFile.title,
        category: newFile.category,
        type: newFile.type,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error("Error creating file:", error);
    return NextResponse.json({ error: "خطا در ذخیره فایل" }, { status: 500 });
  }
}

// ─── DELETE ───
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
    const file = await prisma.file.findUnique({
      where: { id },
      select: { title: true, category: true, type: true },
    });

    await prisma.file.delete({ where: { id } });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "delete",
      entityType: "File",
      entityId: id,
      details: file || { id },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ message: "فایل حذف شد" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}