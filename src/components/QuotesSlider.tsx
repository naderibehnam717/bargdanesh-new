"use client";

import { useEffect, useState } from "react";
import { quotes } from "@/lib/quotes";

export default function QuotesSlider() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];

  return (
    <div className="quotes-slider">
      <div className="quotes-slider__stars" aria-hidden="true">
        <span className="quotes-slider__star quotes-slider__star--1">✨</span>
        <span className="quotes-slider__star quotes-slider__star--2">💫</span>
        <span className="quotes-slider__star quotes-slider__star--3">🌟</span>
        <span className="quotes-slider__star quotes-slider__star--4">⭐</span>
        <span className="quotes-slider__star quotes-slider__star--5">✨</span>
        <span className="quotes-slider__star quotes-slider__star--6">💫</span>
        <span className="quotes-slider__star quotes-slider__star--7">📚</span>
        <span className="quotes-slider__star quotes-slider__star--8">🍃</span>
      </div>

      <div className="quotes-slider__inner">
        <span className="quotes-slider__icon">💡</span>
        <p
          className="quotes-slider__text"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {quote.text}
        </p>
        <p
          className="quotes-slider__author"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          — {quote.author}
        </p>
      </div>
    </div>
  );
}