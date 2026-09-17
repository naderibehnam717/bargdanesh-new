import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  userName?: string | null
) {
  const resetUrl = `${
    process.env.AUTH_URL || "http://localhost:3000"
  }/reset-password?token=${token}&email=${encodeURIComponent(to)}`;

  const { data, error } = await resend.emails.send({
    from: "برگ دانش <onboarding@resend.dev>",
    to: [to],
    subject: "🔑 بازیابی رمز عبور - برگ دانش",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Tahoma, Arial, sans-serif;
            background-color: #f8fafc;
            padding: 40px 20px;
            direction: rtl;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          .logo {
            text-align: center;
            font-size: 24px;
            font-weight: 800;
            color: #1e40af;
            margin-bottom: 24px;
          }
          h1 {
            color: #0f172a;
            font-size: 22px;
            margin-bottom: 16px;
            text-align: center;
          }
          p {
            color: #475569;
            font-size: 15px;
            line-height: 2;
            margin-bottom: 16px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: #ffffff !important;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            margin: 20px 0;
          }
          .btn-wrapper {
            text-align: center;
            margin: 24px 0;
          }
          .footer {
            color: #94a3b8;
            font-size: 13px;
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
          }
          .warning {
            background: #fef3c7;
            color: #92400e;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            margin-top: 20px;
            border-right: 4px solid #f59e0b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">📚 برگ دانش</div>
          <h1>🔑 بازیابی رمز عبور</h1>
          <p>سلام ${userName || "کاربر عزیز"}،</p>
          <p>
            ما درخواست بازیابی رمز عبور برای حساب شما دریافت کردیم.
            برای تنظیم رمز جدید، روی دکمه زیر کلیک کنید:
          </p>
          <div class="btn-wrapper">
            <a href="${resetUrl}" class="btn">🔓 تنظیم رمز جدید</a>
          </div>
          <p style="font-size: 13px; color: #94a3b8;">
            یا این لینک را در مرورگر خود کپی کنید:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #2563eb; background: #f1f5f9; padding: 12px; border-radius: 8px;">
            ${resetUrl}
          </p>
          <div class="warning">
            ⏰ این لینک فقط تا <strong>۱ ساعت</strong> اعتبار دارد.
          </div>
          <div class="footer">
            اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.
            <br>
            <strong style="color: #1e40af;">دانش، یک برگ فاصله دارد.</strong>
          </div>
        </div>
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