import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  if ((session.user as { role?: string }).role !== "admin") return false;
  return true;
}

const defaultSettings = {
  siteName: "برگ دانش",
  siteDescription: "مرجع دانلود جزوه، کتاب و مقاله دانشگاهی",
  siteEmail: "info@bargdanesh.ir",
  sitePhone: "۰۹۱۲۳۴۵۶۷۸۹",
  telegram: "",
  instagram: "",
  twitter: "",
  youtube: "",
  footerText: "© 1405 - برگ دانش ، تمامی حقوق محفوظ است",
  maintenanceMode: false,
};

export async function GET() {
  if (!(await checkAdmin())) {
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
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();

  await prisma.setting.upsert({
    where: { id: "main" },
    update: { data: JSON.stringify(body) },
    create: { id: "main", data: JSON.stringify(body) },
  });

  return NextResponse.json({ message: "تنظیمات ذخیره شد", settings: body });
}