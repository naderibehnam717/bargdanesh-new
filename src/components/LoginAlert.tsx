"use client";

import Link from "next/link";

export default function LoginAlert() {
  return (
    <>
      <div className="login-alert">
        <span className="login-alert__icon">🔒</span>
        <div className="login-alert__text">
          <strong>توجه!</strong> برای مشاهده و دانلود رایگان فایل‌ها، ابتدا
          باید{" "}
          <Link href="/signup" className="login-alert__link">
            ثبت‌نام
          </Link>{" "}
          کنید یا{" "}
          <Link href="/login" className="login-alert__link">
            وارد شوید
          </Link>
          .
        </div>
        <span className="login-alert__sparkle">✨</span>
      </div>

      <style jsx>{`
        .login-alert {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          padding: 14px 22px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
          border: 2px solid #f59e0b;
          max-width: 640px;
          animation: alertFloat 3s ease-in-out infinite,
                     alertGlow 2s ease-in-out infinite;
          overflow: hidden;
          text-align: right;
        }

        .login-alert::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 100px;
          height: 100px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 0%,
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
        }

        .login-alert__icon {
          font-size: 24px;
          animation: bellShake 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .login-alert__text {
          line-height: 1.9;
          position: relative;
          z-index: 1;
        }

        .login-alert__text strong {
          color: #b45309;
          font-weight: 800;
        }

        .login-alert__link {
          color: #b45309;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease;
        }

        .login-alert__link:hover {
          color: #78350f;
        }

        .login-alert__sparkle {
          position: absolute;
          top: 8px;
          left: 12px;
          font-size: 16px;
          opacity: 0.7;
          animation: sparkleTwinkle 1.5s ease-in-out infinite;
        }

        @keyframes alertFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes alertGlow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
          }
          50% {
            box-shadow: 0 8px 32px rgba(245, 158, 11, 0.55);
          }
        }

        @keyframes bellShake {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-15deg);
          }
          20%, 40% {
            transform: rotate(15deg);
          }
          50% {
            transform: rotate(0deg);
          }
        }

        @keyframes sparkleTwinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(20deg);
          }
        }

        @media (max-width: 600px) {
          .login-alert {
            font-size: 13px;
            padding: 12px 16px;
            flex-direction: column;
            gap: 8px;
          }

          .login-alert__icon {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}