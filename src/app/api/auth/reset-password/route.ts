import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    // پیدا کردن توکن
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "لینک بازیابی نامعتبر است" },
        { status: 400 }
      );
    }

    // چک کردن انقضا
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "لینک بازیابی منقضی شده است" },
        { status: 400 }
      );
    }

    // هش کردن رمز جدید
    const hashedPassword = await bcrypt.hash(password, 10);

    // آپدیت رمز کاربر
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // حذف توکن
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return NextResponse.json({
      message: "رمز عبور با موفقیت تغییر کرد",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطایی رخ داد" }, { status: 500 });
  }
}