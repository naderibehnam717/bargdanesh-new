import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return (session.user as { id?: string }).id || null;
}

// ─── GET: لیست ایمیل‌های ارسالی ───
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(logs);
}

// ─── POST: ارسال ایمیل گروهی ───
export async function POST(request: Request) {
  const adminId = await checkAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const { subject, content, onlySubscribed, recipientType } = body;

  if (!subject || !content) {
    return NextResponse.json(
      { error: "موضوع و متن ایمیل الزامی هستند" },
      { status: 400 }
    );
  }

  if (subject.length > 200) {
    return NextResponse.json({ error: "موضوع طولانی است" }, { status: 400 });
  }

  if (content.length > 10000) {
    return NextResponse.json(
      { error: "متن ایمیل طولانی است (حداکثر ۱۰۰۰۰ کاراکتر)" },
      { status: 400 }
    );
  }

  try {
    let users;

    if (recipientType === "admins") {
      users = await prisma.user.findMany({
        where: { role: "admin" },
        select: { id: true, email: true, name: true },
      });
    } else if (recipientType === "users") {
      users = await prisma.user.findMany({
        where: { role: "user" },
        select: { id: true, email: true, name: true },
      });
    } else {
      users = await prisma.user.findMany({
        where: onlySubscribed ? { subscribed: true } : undefined,
        select: { id: true, email: true, name: true },
      });
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: "کاربری برای ارسال یافت نشد" },
        { status: 400 }
      );
    }

    const log = await prisma.emailLog.create({
      data: {
        subject,
        content,
        recipientCount: users.length,
        status: "sending",
      },
    });

    let sentCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      try {
        const emails = batch.map((user) => ({
          from: "برگ دانش <noreply@bargdanesh.ir>",
          to: [user.email],
          subject,
          html: `
            <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
              <div style="background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 42px; margin-bottom: 8px;">📚</div>
                  <h1 style="color: #0066cc; font-size: 22px; margin: 0;">برگ دانش</h1>
                  <p style="color: #666; font-size: 13px; margin: 4px 0 0;">دانش، یک برگ فاصله دارد</p>
                </div>
                <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 20px 0;">
                ${
                  user.name
                    ? `<p style="color: #444; font-size: 15px;">سلام ${user.name} عزیز،</p>`
                    : `<p style="color: #444; font-size: 15px;">سلام،</p>`
                }
                <div style="color: #444; font-size: 14px; line-height: 2; margin: 16px 0;">
                  ${content.replace(/\n/g, "<br>")}
                </div>
                <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 24px 0;">
                <div style="text-align: center;">
                  <a href="https://www.bargdanesh.ir" style="display: inline-block; background: #0066cc; color: #fff; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                    🚀 بازگشت به برگ دانش
                  </a>
                </div>
                <p style="color: #999; font-size: 11px; text-align: center; margin: 24px 0 0;">
                  این ایمیل از طرف برگ دانش ارسال شده است.
                  <br>
                  برای لغو عضویت، در پنل کاربری خود وارد شوید.
                </p>
              </div>
            </div>
          `,
        }));

        const response = await resend.batch.send(emails);

        if (response.error) {
          console.error("Resend batch error:", response.error);
          failedCount += batch.length;
        } else {
          sentCount += batch.length;
        }

        if (i + BATCH_SIZE < users.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error("Batch error:", error);
        failedCount += batch.length;
      }
    }

    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        sentCount,
        failedCount,
        status: failedCount === 0 ? "success" : "partial",
      },
    });

    // ✅ ثبت فعالیت
    await logActivity({
      adminId,
      action: "send_email",
      entityType: "Email",
      entityId: log.id,
      details: {
        subject,
        recipientCount: users.length,
        sentCount,
        failedCount,
        recipientType: recipientType || "all",
      },
    });

    return NextResponse.json({
      message: "ایمیل‌ها ارسال شدند",
      sentCount,
      failedCount,
      totalCount: users.length,
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json({ error: "خطا در ارسال ایمیل" }, { status: 500 });
  }
}