"use client";

import { DrawWinner } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  HiOutlineTrophy,
  HiOutlineShieldCheck,
  HiOutlineTicket,
  HiOutlineUser,
} from "react-icons/hi2";

interface WinnerTicketProps {
  winner: DrawWinner;
  highlight?: boolean;
}

export default function WinnerTicket({
  winner,
  highlight = false,
}: WinnerTicketProps) {
  const { language, t } = useLanguage();

  const getPositionDetails = (pos: number) => {
    switch (pos) {
      case 1:
        return {
          title: t.firstPlace,
          badgeColor: "bg-[#064E3B] text-[#D4AF37] font-black border border-[#D4AF37] shadow-lg shadow-[#064E3B]/30",
          cardBorder: "border-[#D4AF37] gold-glow bg-white",
          iconColor: "text-[#D4AF37]",
          num: language === "bn" ? "১" : "1",
        };
      case 2:
        return {
          title: t.secondPlace,
          badgeColor: "bg-[#044333] text-white font-black shadow-lg shadow-[#064E3B]/20 border border-[#D4AF37]/50",
          cardBorder: "border-[#064E3B]/40 bg-white",
          iconColor: "text-[#064E3B]",
          num: language === "bn" ? "২" : "2",
        };
      case 3:
        return {
          title: t.thirdPlace,
          badgeColor: "bg-[#022C22] text-white font-black shadow-lg shadow-[#022C22]/30 border border-[#D4AF37]/30",
          cardBorder: "border-slate-200 bg-white",
          iconColor: "text-[#064E3B]",
          num: language === "bn" ? "৩" : "3",
        };
      default:
        return {
          title: `${pos}`,
          badgeColor: "bg-[#022C22] text-white",
          cardBorder: "border-slate-200 bg-white",
          iconColor: "text-[#064E3B]",
          num: `${pos}`,
        };
    }
  };

  const posInfo = getPositionDetails(winner.position);

  return (
    <div
      className={`rounded-2xl border ${posInfo.cardBorder} p-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg ${
        highlight ? "scale-[1.02] ring-2 ring-[#D4AF37]" : ""
      }`}
    >
      {/* Top Banner: Position Pill & Verified Seal */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] ${posInfo.badgeColor}`}>
            {posInfo.num}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#064E3B]">
            {posInfo.title}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#064E3B]/10 border border-[#D4AF37]/40 px-2 py-0.5 text-[9px] font-bold text-[#064E3B]">
          <HiOutlineShieldCheck className="h-3 w-3 text-[#D4AF37]" />
          <span>{t.threeWinnersConfirmed}</span>
        </div>
      </div>

      {/* Center: Awarded Prize Showcase */}
      <div className="my-3 space-y-1">
        <div className="flex items-center gap-1 text-[10px] text-[#065F46] font-semibold uppercase tracking-wider">
          <HiOutlineTrophy className={`h-3.5 w-3.5 ${posInfo.iconColor}`} />
          <span>{t.prizeWon}</span>
        </div>
        <h4 className="text-lg font-black text-[#022C22] tracking-tight leading-snug line-clamp-2">
          {winner.prize}
        </h4>
      </div>

      {/* Ticket Details Box */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2.5 shadow-inner">
        {/* Ticket Serial Slot */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1">
            <HiOutlineTicket className="h-3 w-3" />
            <span>{t.ticketCode}</span>
          </span>
          <span className="font-mono text-xs font-black text-[#064E3B] tracking-wider px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40">
            {winner.code}
          </span>
        </div>

        {/* Winner Name */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-[#065F46] font-medium flex items-center gap-1">
              <HiOutlineUser className="h-3 w-3 text-[#D4AF37]" />
              <span>{t.luckyWinner}:</span>
            </span>
            <strong className="text-[#022C22] font-bold text-xs truncate max-w-[120px]">{winner.name}</strong>
          </div>
        </div>
      </div>

      {/* Footer Verified Seal */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-[#065F46] font-medium">
        <span className="flex items-center gap-1 font-semibold">
          <HiOutlineShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>{t.fairDraw}</span>
        </span>

        <span className="font-mono text-[#064E3B] font-bold uppercase tracking-wider">
          VERIFIED
        </span>
      </div>
    </div>
  );
}
