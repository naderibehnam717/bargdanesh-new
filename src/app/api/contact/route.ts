import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // اعتبارسنجی
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "همه‌ی فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // اعتبارسنجی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "ایمیل نامعتبر است" },
        { status: 400 }
      );
    }

    // ارسال ایمیل به خودت
    const { data, error } = await resend.emails.send({
      from: "برگ دانش <noreply@bargdanesh.ir>",
      to: ["info@bargdanesh.ir"],  // ایمیل خودت
      replyTo: email,                // کاربر بتونه پاسخ بده
      subject: `📩 پیام جدید از ${name}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
            <h2 style="color: #1a1a1a; margin-bottom: 24px; border-bottom: 2px solid #0066cc; padding-bottom: 12px;">
              📩 پیام جدید از برگ دانش
            </h2>

            <div style="margin-bottom: 20px;">
              <strong style="color: #0066cc;">نام فرستنده:</strong>
              <p style="margin: 8px 0; color: #444;">${name}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <strong style="color: #0066cc;">ایمیل فرستنده:</strong>
              <p style="margin: 8px 0; color: #444;">
                <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <strong style="color: #0066cc;">پیام:</strong>
              <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 8px; border-right: 3px solid #0066cc; color: #444; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              این پیام از طریق فرم تماس برگ دانش ارسال شده است.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "خطا در ارسال ایمیل" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "پیام شما با موفقیت ارسال شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}