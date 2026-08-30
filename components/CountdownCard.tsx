"use client";

import { useEffect, useState } from "react";
import TicketStub from "./TicketStub";
import { useLanguage } from "@/context/LanguageContext";
import { HiClock, HiSparkles, HiCalendarDays, HiArrowRight } from "react-icons/hi2";
import Link from "next/link";

interface CountdownCardProps {
  targetDate: string;
  rotation?: "left" | "right" | "left-lg" | "right-lg" | "none";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function CountdownCard({
  targetDate,
  rotation = "none",
}: CountdownCardProps) {
  const { language, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n).padStart(2, "0");
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .padStart(2, "0")
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const formattedDate = mounted
    ? new Date(targetDate).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : language === "bn" ? "লোড হচ্ছে..." : "Loading schedule...";

  return (
    <TicketStub
      rotation={rotation}
      pinBadge={false}
      serial="DRAW-LIVE"
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col space-y-4">
        
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-rose-600">
              {t.nextDrawTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700">
            <HiCalendarDays className="h-3.5 w-3.5 text-indigo-600" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Big Display Title */}
        <div>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <HiSparkles className="h-6 w-6 text-amber-500" />
            {t.nextDrawTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
            {t.countdownDesc}
          </p>
        </div>

        {/* Live Digits Box */}
        <div 
          className="grid grid-cols-4 gap-2 sm:gap-3 py-2"
          role="timer"
          aria-live="polite"
          aria-label="Time until next raffle draw"
        >
          {[
            { label: t.days, val: timeLeft.days },
            { label: t.hours, val: timeLeft.hours },
            { label: t.mins, val: timeLeft.minutes },
            { label: t.secs, val: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 px-2 py-3.5 text-white shadow-xs border border-slate-800"
            >
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-amber-300">
                {mounted ? toBnNum(item.val) : "--"}
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-300 mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info & CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-sans text-slate-600">
            <HiClock className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>{t.drawNotice}</span>
          </div>
          
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-sans font-bold tracking-wide transition-all shadow-xs group"
          >
            <span>{t.viewPastDrawsBtn}</span>
            <HiArrowRight className="h-3.5 w-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </TicketStub>
  );
}
