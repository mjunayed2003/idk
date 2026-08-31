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
          badgeColor: "bg-[#FF0000] text-white font-black shadow-lg shadow-[#FF0000]/40",
          cardBorder: "border-[#FF0000] crimson-glow bg-white ",
          iconColor: "text-[#FF0000]",
          num: language === "bn" ? "১" : "1",
        };
      case 2:
        return {
          title: t.secondPlace,
          badgeColor: "bg-[#950101] text-white font-black shadow-lg shadow-[#950101]/30",
          cardBorder: "border-[#950101]/70 bg-white ",
          iconColor: "text-[#FF0000]",
          num: language === "bn" ? "২" : "2",
        };
      case 3:
        return {
          title: t.thirdPlace,
          badgeColor: "bg-[#3D0000] text-white font-black shadow-lg shadow-[#3D0000]/40 border border-[#950101]",
          cardBorder: "border-[#950101]/50 bg-white ",
          iconColor: "text-[#FF0000]",
          num: language === "bn" ? "৩" : "3",
        };
      default:
        return {
          title: `${pos}`,
          badgeColor: "bg-[#3D0000] text-white",
          cardBorder: "border-[#950101]/40 bg-white ",
          iconColor: "text-[#FF0000]",
          num: `${pos}`,
        };
    }
  };

  const posInfo = getPositionDetails(winner.position);

  return (
    <div
      className={`rounded-2xl border ${posInfo.cardBorder} p-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg ${
        highlight ? "scale-[1.02] ring-2 ring-[#FF0000]/50" : ""
      }`}
    >
      {/* Top Banner: Position Pill & Verified Seal */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] ${posInfo.badgeColor}`}>
            {posInfo.num}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF0000]">
            {posInfo.title}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#FF0000]/15 border border-[#FF0000]/30 px-2 py-0.5 text-[9px] font-bold text-[#FF0000]">
          <HiOutlineShieldCheck className="h-3 w-3" />
          <span>{t.threeWinnersConfirmed}</span>
        </div>
      </div>

      {/* Center: Awarded Prize Showcase */}
      <div className="my-3 space-y-1">
        <div className="flex items-center gap-1 text-[10px] text-[#950101] font-semibold uppercase tracking-wider">
          <HiOutlineTrophy className={`h-3.5 w-3.5 ${posInfo.iconColor}`} />
          <span>{t.prizeWon}</span>
        </div>
        <h4 className="text-lg font-black text-[#140000] tracking-tight leading-tight line-clamp-2">
          {winner.prize}
        </h4>
      </div>

      {/* Ticket Details Box */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2.5 shadow-inner">
        {/* Ticket Serial Slot */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#950101] flex items-center gap-1">
            <HiOutlineTicket className="h-3 w-3" />
            <span>{t.ticketCode}</span>
          </span>
          <span className="font-mono text-xs font-black text-[#FF0000] tracking-wider px-2 py-0.5 rounded-md bg-[#FF0000]/15 border border-[#FF0000]/30">
            {winner.code}
          </span>
        </div>

        {/* Winner Name */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-[#950101] font-medium flex items-center gap-1">
              <HiOutlineUser className="h-3 w-3 text-[#FF0000]" />
              <span>{t.luckyWinner}:</span>
            </span>
            <strong className="text-[#140000] font-bold text-xs truncate max-w-[120px]">{winner.name}</strong>
          </div>
        </div>
      </div>

      {/* Footer Verified Seal */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-[#950101] font-medium">
        <span className="flex items-center gap-1 font-semibold">
          <HiOutlineShieldCheck className="h-3.5 w-3.5 text-[#FF0000]" />
          <span>{t.fairDraw}</span>
        </span>

        <span className="font-mono text-[#FF0000] font-bold uppercase tracking-wider">
          VERIFIED
        </span>
      </div>
    </div>
  );
}
