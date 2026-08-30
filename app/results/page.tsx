"use client";

import { useEffect, useState } from "react";
import { Draw } from "@/lib/types";
import { getPastDraws } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiTrophy,
  HiCalendarDays,
  HiTicket,
  HiSparkles,
  HiArrowLeft,
  HiArrowPath,
  HiShieldCheck,
} from "react-icons/hi2";

export default function ResultsPage() {
  const { language, t } = useLanguage();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDraws = async () => {
    setLoading(true);
    try {
      const data = await getPastDraws();
      setDraws(data);
    } catch (err) {
      console.error("Failed to load draws:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDraws();
  }, []);

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <HiArrowLeft className="h-3.5 w-3.5" />
            <span>{t.backToArena}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <HiTrophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {t.resultsHeading}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {t.resultsSubheading}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadDraws}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <HiArrowPath className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>{t.refreshRecords}</span>
        </button>
      </div>

      {/* Draws List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">
          <HiSparkles className="h-6 w-6 text-blue-600 animate-spin mx-auto mb-2" />
          <p>{language === "bn" ? "ড্র ফলাফল লোড হচ্ছে..." : "Loading draw records..."}</p>
        </div>
      ) : draws.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 space-y-3 shadow-xs">
          <HiTicket className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">{t.noDrawsTitle}</h3>
          <p className="text-xs sm:text-sm max-w-md mx-auto text-slate-500">
            {t.noDrawsDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              {t.checkCountdown}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {draws.map((draw, drawIndex) => (
            <section
              key={draw.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs"
            >
              {/* Draw Title & Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-bold font-mono">
                      {t.drawNumber} #{toBnNum(draws.length - drawIndex)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {draw.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <HiCalendarDays className="h-4 w-4 text-blue-600" />
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

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <HiShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>{t.threeWinnersConfirmed}</span>
                </div>
              </div>

              {/* 3 Winner Ticket Cards (1st, 2nd, 3rd) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {draw.winners
                  .sort((a, b) => a.position - b.position)
                  .map((winner) => {
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
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-500 font-medium">
        <span>
          🛡️ {t.privacyNotice}
        </span>
      </div>
    </div>
  );
}
