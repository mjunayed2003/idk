"use client";

import { DrawWinner } from "@/lib/types";
import TicketStub from "./TicketStub";
import { useLanguage } from "@/context/LanguageContext";
import { HiOutlineTrophy, HiOutlineSparkles, HiOutlineGift, HiOutlineTicket } from "react-icons/hi2";

interface WinnerTicketProps {
  winner: DrawWinner;
  rotation?: "left" | "right" | "left-lg" | "right-lg" | "none";
  highlight?: boolean;
}

export default function WinnerTicket({
  winner,
  rotation = "none",
  highlight = false,
}: WinnerTicketProps) {
  const { language, t } = useLanguage();

  const positionConfig = {
    1: {
      label: t.firstPlace,
      subLabel: t.grandWinner,
      badgeColor: "bg-amber-500 text-slate-950 font-black",
      iconColor: "text-amber-600",
      pinColor: "amber" as const,
      borderAccent: "border-amber-200",
      accentBg: "bg-amber-50/80",
      posText: language === "bn" ? "১" : "1",
    },
    2: {
      label: t.secondPlace,
      subLabel: t.runnerUp,
      badgeColor: "bg-slate-200 text-slate-800 font-bold",
      iconColor: "text-slate-600",
      pinColor: "indigo" as const,
      borderAccent: "border-slate-200",
      accentBg: "bg-slate-50",
      posText: language === "bn" ? "২" : "2",
    },
    3: {
      label: t.thirdPlace,
      subLabel: t.runnerUp,
      badgeColor: "bg-orange-500 text-white font-bold",
      iconColor: "text-orange-600",
      pinColor: "rose" as const,
      borderAccent: "border-orange-200",
      accentBg: "bg-orange-50/80",
      posText: language === "bn" ? "৩" : "3",
    },
  }[winner.position];

  const customStubBadge = (
    <div className="flex flex-col items-center justify-center text-center space-y-1">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${positionConfig.badgeColor}`}>
        <HiOutlineTrophy className="h-4.5 w-4.5" />
      </div>
      <span className="font-display text-xl tracking-wider text-slate-900">
        #{positionConfig.posText}
      </span>
      <span className="font-sans text-[9px] font-bold text-slate-400">
        {language === "bn" ? "বিজয়ী" : "WINNER"}
      </span>
    </div>
  );

  return (
    <TicketStub
      rotation={rotation}
      pinBadge={false}
      stubBadge={customStubBadge}
      className={`h-full ${highlight ? "scale-105 shadow-md" : ""}`}
    >
      <div className="flex flex-col justify-between h-full space-y-3.5">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase ${positionConfig.badgeColor}`}>
            {winner.position === 1 && <HiOutlineSparkles className="h-3.5 w-3.5" />}
            {positionConfig.label}
          </span>

          <span className="font-sans text-[11px] font-semibold text-slate-400">
            {positionConfig.subLabel}
          </span>
        </div>

        {/* Winner Name & Ticket Code (NO phone or address) */}
        <div>
          <span className="text-[11px] font-sans font-medium text-slate-400 block">
            {t.luckyWinner}
          </span>
          <h4 className="font-display text-2xl text-slate-900 tracking-wide uppercase truncate">
            {winner.name}
          </h4>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-white shadow-xs">
            <HiOutlineTicket className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase">
              {winner.code}
            </span>
          </div>
        </div>

        {/* Awarded Prize */}
        <div className={`p-3 rounded-xl border ${positionConfig.borderAccent} ${positionConfig.accentBg}`}>
          <div className="flex items-center gap-1.5 text-slate-600">
            <HiOutlineGift className={`h-4 w-4 ${positionConfig.iconColor}`} />
            <span className="text-[11px] font-sans font-bold text-slate-700">
              {t.prizeWon}
            </span>
          </div>
          <p className="font-sans font-bold text-xs sm:text-sm text-slate-900 mt-1 line-clamp-2">
            {winner.prize}
          </p>
        </div>
      </div>
    </TicketStub>
  );
}
