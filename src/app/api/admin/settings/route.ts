import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return (session.user as { id?: string }).id || null;
}

const defaultSettings = {
  siteName: "برگ دانش",
  siteDescription: "مرجع دانلود جزوه، کتاب و مقاله دانشگاهی",
  siteEmail: "info@bargdanesh.ir",
  sitePhone: "",
  telegram: "",
  instagram: "",
  twitter: "",
  youtube: "",
  footerText: "© 1405 - برگ دانش ، تمامی حقوق محفوظ است",
  maintenanceMode: false,
};

export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const setting = await prisma.setting.findUnique({
    where: { id: "main" },
  });

  if (!setting) {
    return NextResponse.json(defaultSettings);
  }

  return NextResponse.json({
    ...defaultSettings,
    ...JSON.parse(setting.data),
  });
}

export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();

  try {
    // قبل از آپدیت، تنظیمات قدیمی رو بگیر
    const oldSetting = await prisma.setting.findUnique({
      where: { id: "main" },
    });

    const oldData = oldSetting ? JSON.parse(oldSetting.data) : {};

    // پیدا کردن فیلدهایی که تغییر کردن
    const changedFields: Record<string, { old: unknown; new: unknown }> = {};
    Object.keys(body).forEach((key) => {
      if (oldData[key] !== body[key]) {
        changedFields[key] = {
          old: oldData[key],
          new: body[key],
        };
      }
    });

    await prisma.setting.upsert({
      where: { id: "main" },
      update: { data: JSON.stringify(body) },
      create: { id: "main", data: JSON.stringify(body) },
    });

    // ✅ ثبت فعالیت (فقط اگه چیزی تغییر کرده باشه)
    if (Object.keys(changedFields).length > 0) {
      await logActivity({
        adminId,
        action: "update",
        entityType: "Settings",
        details: {
          changedFields: Object.keys(changedFields),
          changes: changedFields,
        },
      });
    }

    return NextResponse.json({
      message: "تنظیمات ذخیره شد",
      settings: body,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره تنظیمات" },
      { status: 500 }
    );
  }
}