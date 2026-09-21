import { prisma } from "@/lib/prisma";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "send_email"
  | "change_role"
  | "login"
  | "logout";

export type EntityType =
  | "File"
  | "User"
  | "Comment"
  | "Quiz"
  | "Settings"
  | "Email"
  | "Auth";

interface LogActivityParams {
  adminId: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, unknown> | string;
}

/**
 * ثبت فعالیت ادمین در دیتابیس
 * - اگه خطا داد، log نمی‌کنه ولی برنامه رو متوقف نمی‌کنه
 */
export async function logActivity({
  adminId,
  action,
  entityType,
  entityId,
  details,
}: LogActivityParams): Promise<void> {
  try {
    const detailsStr =
      typeof details === "string"
        ? details
        : details
        ? JSON.stringify(details)
        : null;

    await prisma.activityLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId: entityId || null,
        details: detailsStr,
      },
    });
  } catch (error) {
    // خطا رو log می‌کنیم ولی برنامه رو متوقف نمی‌کنیم
    console.error("Failed to log activity:", error);
  }
}

/**
 * توضیحات فارسی برای هر action
 */
export const actionLabels: Record<ActivityAction, string> = {
  create: "ایجاد",
  update: "ویرایش",
  delete: "حذف",
  approve: "تأیید",
  reject: "رد",
  send_email: "ارسال ایمیل",
  change_role: "تغییر نقش",
  login: "ورود",
  logout: "خروج",
};

/**
 * آیکون برای هر action
 */
export const actionIcons: Record<ActivityAction, string> = {
  create: "🟢",
  update: "🟡",
  delete: "🔴",
  approve: "✅",
  reject: "❌",
  send_email: "📧",
  change_role: "👑",
  login: "🔓",
  logout: "🔒",
};

/**
 * رنگ برای هر action
 */
export const actionColors: Record<ActivityAction, string> = {
  create: "#10b981",
  update: "#f59e0b",
  delete: "#ef4444",
  approve: "#10b981",
  reject: "#ef4444",
  send_email: "#7c3aed",
  change_role: "#f59e0b",
  login: "#0ea5e9",
  logout: "#6b7280",
};

/**
 * برچسب فارسی برای هر entity type
 */
export const entityLabels: Record<EntityType, string> = {
  File: "فایل",
  User: "کاربر",
  Comment: "کامنت",
  Quiz: "کوییز",
  Settings: "تنظیمات",
  Email: "ایمیل",
  Auth: "احراز هویت",
};

/**
 * آیکون برای هر entity type
 */
export const entityIcons: Record<EntityType, string> = {
  File: "📁",
  User: "👤",
  Comment: "💬",
  Quiz: "🎯",
  Settings: "🔧",
  Email: "📧",
  Auth: "🔐",
};