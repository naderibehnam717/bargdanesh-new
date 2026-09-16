"use client";

import { useEffect, useState } from "react";

function toFaNum(n: number): string {
  return String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

const konkurDate = new Date("2027-07-02T08:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const distance = konkurDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown">
      <span className="countdown__badge">احتمالی</span>
      <h3 className="countdown__title">⏳ تا کنکور سراسری</h3>
      <div className="countdown__grid">
        <div className="countdown__item">
          <span className="countdown__num">{toFaNum(timeLeft.days)}</span>
          <span className="countdown__label">روز</span>
        </div>
        <div className="countdown__item">
          <span className="countdown__num">{toFaNum(timeLeft.hours)}</span>
          <span className="countdown__label">ساعت</span>
        </div>
        <div className="countdown__item">
          <span className="countdown__num">{toFaNum(timeLeft.mins)}</span>
          <span className="countdown__label">دقیقه</span>
        </div>
        <div className="countdown__item">
          <span className="countdown__num">{toFaNum(timeLeft.secs)}</span>
          <span className="countdown__label">ثانیه</span>
        </div>
      </div>
      <p className="countdown__note">📅 ۱۱ تیر ۱۴۰۶ — ممکنه تغییر کنه</p>
    </div>
  );
}