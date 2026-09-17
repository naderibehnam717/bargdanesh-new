import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const body = await request.json();
  const { fileTitle } = body;

  if (!fileTitle) {
    return NextResponse.json({ error: "عنوان فایل لازم است" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
  }

  const existing = await prisma.favorite.findFirst({
    where: { userId: user.id, fileTitle },
  });

  if (existing) {
    return NextResponse.json({ error: "قبلاً اضافه شده" }, { status: 400 });
  }

  const favorite = await prisma.favorite.create({
    data: { userId: user.id, fileTitle },
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
  }

  await prisma.favorite.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ message: "حذف شد" });
}