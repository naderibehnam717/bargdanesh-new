import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  userName?: string | null
) {
  const baseUrl =
    process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
    to
  )}`;

  const { data, error } = await resend.emails.send({
    from: "برگ دانش <onboarding@resend.dev>",
    to: [to],
    subject: "🔑 بازیابی رمز عبور - برگ دانش",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Tahoma, Arial, sans-serif; background-color: #f8fafc; direction: rtl;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="font-size: 24px; font-weight: 800; color: #1e40af;">
                      📚 برگ دانش
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: #0f172a; font-size: 22px; margin: 0 0 16px 0; font-weight: 700;">
                      🔑 بازیابی رمز عبور
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="color: #475569; font-size: 15px; line-height: 2; margin: 0 0 16px 0; text-align: right;">
                      سلام ${userName || "کاربر عزیز"}،
                    </p>
                    <p style="color: #475569; font-size: 15px; line-height: 2; margin: 0 0 24px 0; text-align: right;">
                      ما درخواست بازیابی رمز عبور برای حساب شما دریافت کردیم.
                      برای تنظیم رمز جدید، روی دکمه زیر کلیک کنید:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
                      🔓 تنظیم رمز جدید
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0; text-align: right;">
                      یا این لینک را در مرورگر خود کپی کنید:
                    </p>
                    <p style="font-size: 12px; word-break: break-all; color: #2563eb; background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 0 0 20px 0; text-align: left; direction: ltr;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="background: #fef3c7; color: #92400e; padding: 12px 16px; border-radius: 8px; font-size: 13px; border-right: 4px solid #f59e0b; text-align: right;">
                      ⏰ این لینک فقط تا <strong>۱ ساعت</strong> اعتبار دارد.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 16px 0 0 0; text-align: center;">
                      اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.
                    </p>
                    <p style="color: #1e40af; font-size: 13px; font-weight: 700; margin: 8px 0 0 0; text-align: center;">
                      دانش، یک برگ فاصله دارد.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("خطا در ارسال ایمیل:", error);
    throw new Error("خطا در ارسال ایمیل");
  }

  return data;
}