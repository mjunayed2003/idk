"use client";

import { useEffect, useState } from "react";
import TicketStub from "./TicketStub";
import { useLanguage } from "@/context/LanguageContext";
import { HiOutlineClock, HiOutlineCalendarDays, HiOutlineArrowRight } from "react-icons/hi2";
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
      pinColor="amber"
      serial="LIVE"
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col space-y-4">
        
        {/* Header Ribbon with LIVE Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
          <div className="flex items-center gap-2 rounded-full bg-[#064E3B]/10 border border-[#D4AF37]/50 px-3 py-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#064E3B]">
              LIVE DRAW
            </span>
          </div>

          {/* High Contrast Date Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#D4AF37]/40 px-3.5 py-1.5 font-mono text-xs font-bold text-[#022C22] shadow-xs">
            <HiOutlineCalendarDays className="h-4 w-4 text-[#D4AF37]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Big Display Title */}
        <div>
          <h3 className="font-display text-3xl sm:text-4xl text-[#022C22] tracking-wide uppercase leading-none">
            {t.nextDrawTitle}
          </h3>
          <p className="text-xs text-[#065F46] font-sans mt-1.5 font-medium">
            {t.countdownDesc}
          </p>
        </div>

        {/* Live Digits Box */}
        <div 
          className="grid grid-cols-4 gap-2 sm:gap-3 py-1"
          role="timer"
          aria-live="polite"
        >
          {[
            { label: t.days, val: timeLeft.days },
            { label: t.hours, val: timeLeft.hours },
            { label: t.mins, val: timeLeft.minutes },
            { label: t.secs, val: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-[#D4AF37]/30 p-3 sm:p-4 shadow-md shadow-[#064E3B]/5 relative overflow-hidden group hover:border-[#D4AF37] transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none" />
              
              {/* Digits */}
              <span className="font-mono text-2xl sm:text-4xl font-black tracking-tight text-[#064E3B]">
                {mounted ? toBnNum(item.val) : "--"}
              </span>
              
              {/* Label */}
              <span className="font-sans text-[10px] sm:text-[11px] font-extrabold text-[#065F46] tracking-widest mt-1 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info & CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/30">
          <div className="flex items-center gap-1.5 text-xs text-[#065F46] font-sans font-medium">
            <HiOutlineClock className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <span>{t.drawNotice}</span>
          </div>
          
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] hover:bg-[#043c2e] text-white px-4 py-2 text-xs font-bold transition-all shadow-md shadow-[#064E3B]/30 border border-[#D4AF37]"
          >
            <span>{t.viewPastDrawsBtn}</span>
            <HiOutlineArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
          </Link>
        </div>
      </div>
    </TicketStub>
  );
}
