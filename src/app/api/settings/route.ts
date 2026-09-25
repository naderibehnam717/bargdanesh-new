import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
  try {
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
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(defaultSettings);
  }
}