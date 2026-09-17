import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // برای امنیت، همیشه پیام موفقیت می‌دیم
      return NextResponse.json({
        message: "اگر ایمیل شما در سیستم باشد، لینک بازیابی ارسال می‌شود",
      });
    }

    // حذف توکن‌های قدیمی
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // ساخت توکن جدید
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // ۱ ساعت

    // ذخیره توکن در دیتابیس
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // ارسال ایمیل
    try {
      await sendPasswordResetEmail(email, token, user.name);
    } catch (emailError) {
      console.error("خطا در ارسال ایمیل:", emailError);
      // ادامه می‌دیم حتی اگه ایمیل ارسال نشد
    }

    return NextResponse.json({
      message: "اگر ایمیل شما در سیستم باشد، لینک بازیابی ارسال می‌شود",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطایی رخ داد" }, { status: 500 });
  }
}