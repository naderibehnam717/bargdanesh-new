"use client";

import { useEffect, useState } from "react";

interface AnimatedTitleProps {
  text: string;
  emojis?: string[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#06b6d4",
  "#2563eb",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
];

const DEFAULT_EMOJIS = ["✨", "🌟", "💫", "⭐", "✨", "🌟"];

export default function AnimatedTitle({
  text,
  emojis = DEFAULT_EMOJIS,
  colors = DEFAULT_COLORS,
}: AnimatedTitleProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* اموجی‌های شناور دور عنوان */}
      {emojis.map((emoji, index) => {
        const positions = [
          { top: "-10px", left: "-40px" },
          { top: "20%", right: "-40px" },
          { bottom: "-10px", left: "10%" },
          { bottom: "20%", right: "10%" },
          { top: "50%", left: "-50px" },
          { top: "-20px", right: "20%" },
          { bottom: "-20px", right: "30%" },
          { top: "30%", left: "5%" },
        ];
        const pos = positions[index % positions.length];

        return (
          <span
            key={index}
            style={{
              position: "absolute",
              ...pos,
              fontSize: "28px",
              opacity: visible ? 0.8 : 0,
              transition: `opacity 0.5s ease ${index * 0.2}s`,
              animation: visible
                ? `emojiFloat${index % 3} 4s ease-in-out ${index * 0.3}s infinite`
                : "none",
              pointerEvents: "none",
              filter: "drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3))",
            }}
          >
            {emoji}
          </span>
        );
      })}

      {/* خود عنوان */}
      <h1 className="subject-hero__title" data-text={text}>
        {text.split("").map((char, index) => {
          const color = colors[index % colors.length];
          const delay = index * 0.15;

          return (
            <span
              key={index}
              style={{
                color: color,
                opacity: visible ? 1 : 0,
                display: "inline-block",
                transition: `opacity 0.4s ease ${delay}s`,
                animation: visible
                  ? `letterFloat 3s ease-in-out ${delay}s infinite`
                  : "none",
              }}
            >
              {char}
            </span>
          );
        })}
      </h1>

      <style jsx>{`
        @keyframes letterFloat {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(-3deg) scale(1.08);
          }
          50% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          75% {
            transform: translateY(8px) rotate(3deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }

        @keyframes emojiFloat0 {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-15px) rotate(15deg) scale(1.2);
          }
        }

        @keyframes emojiFloat1 {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(12px) rotate(-20deg) scale(1.15);
          }
        }

        @keyframes emojiFloat2 {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-10px) rotate(25deg) scale(1.25);
          }
        }
      `}</style>
    </div>
  );
}