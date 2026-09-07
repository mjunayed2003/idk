"use client";

import { useEffect, useState } from "react";
import { useGetDrawHistoryQuery } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiOutlineTrophy,
  HiOutlineCalendarDays,
  HiOutlineTicket,
  HiOutlinePlay,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

export default function ResultsPage() {
  const { language, t } = useLanguage();
  const { data: draws = [], isLoading: loading, refetch } = useGetDrawHistoryQuery(undefined);

  const loadDraws = () => {
    refetch();
  };

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8 sm:space-y-10">
      
      {/* Header with High-Contrast Clear Colors */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          {/* Sharp High-Contrast Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:text-[#022C22] transition-colors mb-2.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-xs"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5 text-[#064E3B]" />
            <span>{t.backToArena}</span>
          </Link>

          <div className="flex items-center gap-3 mt-1">
            {/* Rich Trophy Badge with High-Contrast Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] font-black shadow-lg shadow-[#064E3B]/25 border border-[#D4AF37]/50">
              <HiOutlineTrophy className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#022C22]">
                {t.resultsHeading}
              </h1>
              <p className="text-xs sm:text-sm text-[#065F46] font-medium mt-0.5">
                {t.resultsSubheading}
              </p>
            </div>
          </div>
        </div>

        {/* High-Contrast Refresh Button */}
        <button
          type="button"
          onClick={loadDraws}
          className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#022C22] transition-all shadow-xs"
        >
          <HiOutlineArrowPath className={`h-4 w-4 ${loading ? "animate-spin text-[#064E3B]" : "text-[#064E3B]"}`} />
          <span>{t.refreshRecords}</span>
        </button>
      </div>

      {/* Draws List */}
      {loading ? (
        <div className="py-20 text-center text-[#065F46] font-medium">
          <HiOutlinePlay className="h-8 w-8 text-[#064E3B] animate-spin mx-auto mb-3" />
          <p>{language === "bn" ? "ড্র ফলাফল লোড হচ্ছে..." : "Loading draw records..."}</p>
        </div>
      ) : draws.length === 0 ? (
        <div className="luxury-card p-10 text-center text-[#065F46] space-y-4 shadow-xl">
          <HiOutlineTicket className="h-12 w-12 text-[#D4AF37] mx-auto" />
          <h3 className="text-xl font-bold text-[#022C22]">{t.noDrawsTitle}</h3>
          <p className="text-xs sm:text-sm max-w-md mx-auto text-[#065F46]">
            {t.noDrawsDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#022C22] px-5 py-2.5 text-xs font-bold text-[#D4AF37] transition shadow-md shadow-[#064E3B]/25 border border-[#D4AF37]/50"
            >
              {t.checkCountdown}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {draws.map((draw: import('@/lib/types').Draw, drawIndex: number) => (
            <section
              key={draw.id}
              className="luxury-card p-6 sm:p-7 space-y-6 relative overflow-hidden"
            >
              {/* Draw Title & Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/30 px-3 py-0.5 text-xs font-bold font-mono">
                      {t.drawNumber} #{toBnNum(draws.length - drawIndex)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#022C22]">
                      {draw.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#065F46] font-medium">
                    <HiOutlineCalendarDays className="h-4 w-4 text-[#064E3B]" />
                    <span>
                      {t.conductedOn}:{" "}
                      {new Date(draw.date).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37]/15 px-3 py-1 text-xs font-bold text-[#064E3B] border border-[#D4AF37]/40">
                  <HiOutlineShieldCheck className="h-4 w-4 text-[#064E3B]" />
                  <span>{t.threeWinnersConfirmed}</span>
                </div>
              </div>

              {/* 3 Winner Ticket Cards (1st, 2nd, 3rd) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[...draw.winners]
                  .sort((a: import('@/lib/types').DrawWinner, b: import('@/lib/types').DrawWinner) => a.position - b.position)
                  .map((winner: import('@/lib/types').DrawWinner) => {
                    return (
                      <WinnerTicket
                        key={winner.customerId + winner.position}
                        winner={winner}
                        highlight={winner.position === 1}
                      />
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Safety & Compliance Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center text-xs text-[#065F46] font-medium shadow-xs">
        <span>
          🛡️ {t.privacyNotice}
        </span>
      </div>
    </div>
  );
}
