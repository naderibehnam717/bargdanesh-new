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

// ─── GET: لیست کنکورها ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const konkur = await prisma.konkur.findMany({
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });

  return NextResponse.json(konkur);
}

// ─── POST: افزودن کنکور ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { title, subtitle, year, field, description, questionUrl, answerUrl } =
    body;

  if (!title || !year || !field) {
    return NextResponse.json(
      { error: "عنوان، سال و رشته الزامی هستند" },
      { status: 400 }
    );
  }

  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return NextResponse.json({ error: "سال نامعتبر" }, { status: 400 });
  }

  const fieldSlug = field
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  let baseSlug = `konkur-${yearNum}-${fieldSlug}`;
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.konkur.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    const newKonkur = await prisma.konkur.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        year: yearNum,
        field,
        description: description || null,
        questionUrl: questionUrl || null,
        answerUrl: answerUrl || null,
      },
    });

    await logActivity({
      adminId,
      action: "create",
      entityType: "Konkur",
      entityId: newKonkur.id,
      details: {
        title: newKonkur.title,
        year: newKonkur.year,
        field: newKonkur.field,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(newKonkur, { status: 201 });
  } catch (error) {
    console.error("Create konkur error:", error);
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }
}

// ─── PUT: ویرایش کنکور ───
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
    const oldKonkur = await prisma.konkur.findUnique({
      where: { id },
    });

    if (!oldKonkur) {
      return NextResponse.json({ error: "کنکور یافت نشد" }, { status: 404 });
    }

    const updatedKonkur = await prisma.konkur.update({
      where: { id },
      data: {
        title: data.title ?? oldKonkur.title,
        subtitle:
          data.subtitle !== undefined ? data.subtitle || null : oldKonkur.subtitle,
        year: data.year ? parseInt(data.year) : oldKonkur.year,
        field: data.field ?? oldKonkur.field,
        description:
          data.description !== undefined
            ? data.description || null
            : oldKonkur.description,
        questionUrl:
          data.questionUrl !== undefined
            ? data.questionUrl || null
            : oldKonkur.questionUrl,
        answerUrl:
          data.answerUrl !== undefined
            ? data.answerUrl || null
            : oldKonkur.answerUrl,
      },
    });

    await logActivity({
      adminId,
      action: "update",
      entityType: "Konkur",
      entityId: id,
      details: {
        title: updatedKonkur.title,
        year: updatedKonkur.year,
        field: updatedKonkur.field,
        changes: Object.keys(data),
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(updatedKonkur);
  } catch (error) {
    console.error("Update konkur error:", error);
    return NextResponse.json({ error: "خطا در ویرایش" }, { status: 500 });
  }
}

// ─── DELETE: حذف کنکور ───
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
    const konkur = await prisma.konkur.findUnique({
      where: { id },
      select: { title: true, year: true, field: true },
    });

    await prisma.konkur.delete({ where: { id } });

    await logActivity({
      adminId,
      action: "delete",
      entityType: "Konkur",
      entityId: id,
      details: konkur || { id },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ message: "حذف شد" });
  } catch (error) {
    console.error("Delete konkur error:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}