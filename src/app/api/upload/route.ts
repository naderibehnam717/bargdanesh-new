import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(request: Request) {
  try {
    // ─── بررسی ادمین ───
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });
    }
    if ((session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "فقط ادمین" }, { status: 403 });
    }

    // ─── بررسی توکن ───
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN تنظیم نشده است" },
        { status: 500 }
      );
    }

    // ─── دریافت فایل ───
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "فایلی ارسال نشد" }, { status: 400 });
    }

    // ─── بررسی حجم ───
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم فایل بیش از ۲۰ مگابایت است" },
        { status: 400 }
      );
    }

    // ─── بررسی نوع ───
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع فایل مجاز نیست (فقط عکس و PDF)" },
        { status: 400 }
      );
    }

    // ─── ساخت اسم یکتا ───
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop() || "bin";
    const cleanName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .substring(0, 50);
    const filename = `${timestamp}-${randomStr}-${cleanName}.${ext}`;

    // ─── آپلود به Vercel Blob ───
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "خطای ناشناخته";
    return NextResponse.json(
      { error: "خطا در آپلود فایل", details: message },
      { status: 500 }
    );
  }
}