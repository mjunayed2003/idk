"use client";

import { useState, useEffect } from "react";
import { Customer, DrawWinner } from "@/lib/types";
import { getActiveCustomers, runSingleDrawSelection, saveDrawResult } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import CasinoWheel from "@/components/CasinoWheel";
import Link from "next/link";
import {
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineTrophy,
  HiOutlineTicket,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

export default function DrawBoothPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeCustomers, setActiveCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawTitle, setDrawTitle] = useState("");
  const [selectedWinners, setSelectedWinners] = useState<DrawWinner[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("idk_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const loadActive = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const active = await getActiveCustomers();
      setActiveCustomers(active);
    } catch (err) {
      console.error("Failed to load active customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActive();
  }, []);

  const handleRunSingleDraw = async (position: 1 | 2 | 3) => {
    if (activeCustomers.length < 1) {
      setErrorMsg(t.needMinCustomers);
      return;
    }

    setIsDrawing(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const excludeIds = selectedWinners.map((w) => w.customerId);
      const winner = await runSingleDrawSelection(position, excludeIds);
      
      // BROADCAST to Live Page
      if (typeof window !== "undefined") {
        localStorage.setItem("idk_live_event", JSON.stringify({
          action: "SPIN",
          position,
          winner,
          ts: Date.now()
        }));
      }

      // Wait 3 seconds for the wheel animation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      setSelectedWinners((prev) => {
        const newWinners = [...prev, winner];
        // Sort ascending by position so 1st place is at top/left, 2nd, 3rd
        return newWinners.sort((a, b) => a.position - b.position);
      });

      if (!drawTitle) {
        setDrawTitle(language === "bn" ? `মেগা লয়ালটি ড্র #${Date.now().toString().slice(-4)}` : `Grand Draw #${Date.now().toString().slice(-4)}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to draw winner.");
    } finally {
      setIsDrawing(false);
    }
  };

  const handleSaveDraw = async () => {
    if (!selectedWinners) return;
    try {
      await saveDrawResult(drawTitle, selectedWinners);
      setSavedSuccess(true);
      await loadActive();
    } catch (err) {
      console.error("Error saving draw result:", err);
    }
  };

  const handleResetDraw = () => {
    setSelectedWinners([]);
    setErrorMsg(null);
    setDrawTitle("");
    if (typeof window !== "undefined") {
      localStorage.setItem("idk_live_event", JSON.stringify({ action: "RESET", ts: Date.now() }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="luxury-card p-8 text-center space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-bold shadow-lg shadow-[#FF0000]/40 border border-[#FF0000] mx-auto">
            <HiOutlineLockClosed className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#140000] dark:text-[#ffffff]">
              {t.restrictedTitle}
            </h1>
            <p className="text-xs text-[#950101] dark:text-[#ffffff]/70 mt-1">
              {t.restrictedSub}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === "admin123" || password === "admin" || password === "idk2026") {
                setIsAuthenticated(true);
                sessionStorage.setItem("idk_admin_auth", "true");
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passcode (admin123)"
              className="w-full rounded-2xl border border-[#950101]/30 dark:border-white/10 bg-[#faf8f8] dark:bg-[#000000] px-4 py-3 text-sm text-[#140000] dark:text-[#ffffff] font-mono placeholder-[#950101]/60 dark:placeholder-slate-500 focus:border-[#FF0000] focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#FF0000] hover:bg-[#d60000] py-3 text-xs font-black uppercase text-white shadow-lg shadow-[#FF0000]/40 transition-all border border-[#FF0000]"
            >
              {t.enterBtn}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(true);
              sessionStorage.setItem("idk_admin_auth", "true");
            }}
            className="text-xs text-[#FF0000] hover:underline font-semibold"
          >
            {t.demoUnlockBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#950101]/20 dark:border-white/10 pb-5">
        <div>
          <Link
            href="/super-admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#950101] dark:text-[#ffffff]/70 hover:text-[#FF0000] dark:hover:text-white transition-colors mb-2"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5" />
            <span>{language === "bn" ? "অ্যাডমিন পোর্টালে ফিরুন" : "Return to Admin Portal"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-bold shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
              <HiOutlinePlay className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#140000] dark:text-[#ffffff]">
                {t.drawBoothHeading}
              </h1>
              <p className="text-xs sm:text-sm text-[#950101] dark:text-[#ffffff]/70">
                {t.drawBoothSub}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-2xl bg-[#FF0000]/15 dark:bg-white/[0.04] px-4 py-2 border border-[#FF0000]/30 dark:border-white/10 shadow-xs">
            <HiOutlineTicket className="h-4.5 w-4.5 text-[#FF0000]" />
            <span className="text-xs font-medium text-[#140000] dark:text-[#ffffff]">
              {t.activePoolMetric}: <strong className="text-[#FF0000] font-bold font-mono">{toBnNum(activeCustomers.length)}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={loadActive}
            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.1] p-2.5 text-[#140000] dark:text-[#ffffff] transition shadow-xs"
            title="Refresh count"
          >
            <HiOutlineArrowPath className={`h-4 w-4 ${loading ? "animate-spin text-[#FF0000]" : "text-[#FF0000]"}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-2xl border border-[#950101]/50 bg-[#3D0000]/50 p-4 text-xs text-white font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ================= SINGLE CARD LAYOUT ================= */}
      <div className="luxury-card p-6 sm:p-10 lg:p-12 text-center space-y-8 relative overflow-hidden">
        {/* Ambient glowing arena */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#FF0000]/15 blur-3xl pointer-events-none" />
        
        <div className="max-w-xl mx-auto space-y-2 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF0000]">
            {t.fairDraw}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#140000] dark:text-[#ffffff]">
            {t.drawBoothHeading}
          </h2>
          <p className="text-xs sm:text-sm text-[#950101] dark:text-[#ffffff]/70 font-sans">
            {t.drawInstruction}
          </p>
        </div>

        {/* CasinoWheel Display */}
        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
          <CasinoWheel
            isSpinning={isDrawing}
            winner={selectedWinners.length > 0 ? { name: selectedWinners[selectedWinners.length - 1].name, code: selectedWinners[selectedWinners.length - 1].code } : null}
          />

          {/* 3 Pick Winner Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {[3, 2, 1].map((pos) => {
              const isDrawn = selectedWinners.some((w) => w.position === pos);
              const posNames = { 3: "3rd Place", 2: "2nd Place", 1: "1st Place" };
              return (
                <button
                  key={pos}
                  onClick={() => handleRunSingleDraw(pos as 1 | 2 | 3)}
                  disabled={isDrawn || isDrawing || activeCustomers.length < 1}
                  className={`px-6 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border shadow-lg flex items-center gap-2 ${
                    isDrawn
                      ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/20 border-slate-200 dark:border-white/5 cursor-not-allowed"
                      : "bg-[#FF0000] hover:bg-[#d60000] text-white border-[#FF0000] shadow-[#FF0000]/30 hover:scale-105 active:scale-95"
                  }`}
                >
                  {isDrawn ? (
                    <HiOutlineCheckCircle className="h-4 w-4" />
                  ) : (
                    <HiOutlinePlay className="h-4 w-4" />
                  )}
                  {language === "bn" ? `${pos}ম বিজয়ী নির্বাচন` : `Draw ${posNames[pos as 1 | 2 | 3]}`}
                </button>
              );
            })}
          </div>

          {activeCustomers.length < 1 && (
            <p className="text-xs text-[#FF0000] font-medium mt-2">
              * {language === "bn" ? "ড্র করার জন্য কোনো গ্রাহক নেই" : "Not enough active customers"}
            </p>
          )}
        </div>

        {/* Active tickets preview ticker - ONLY show when not drawn yet */}
        {selectedWinners.length === 0 && (
          <div className="pt-6 border-t border-[#950101]/20 dark:border-white/10 relative z-10">
            <span className="text-xs font-bold text-[#950101] dark:text-[#ffffff]/70 uppercase tracking-wider block mb-3">
              {t.qualifyingTickets}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[#FF0000]/20 scrollbar-track-transparent">
              {activeCustomers.map((cust) => (
                <span
                  key={cust.id}
                  className="rounded-xl bg-white dark:bg-[#000000]/80 px-3 py-1.5 text-xs font-mono text-[#140000] dark:text-[#ffffff] border border-slate-200 dark:border-[#950101]/40 shadow-xs hover:border-[#FF0000] transition-colors"
                >
                  <strong className="text-[#FF0000]">{cust.code}</strong> ({cust.name.split(" ")[0]})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ================= WINNER REVEAL AREA (INSIDE THE SAME CARD) ================= */}
        {selectedWinners.length > 0 && (
          <div className="mt-8 pt-8 border-t-2 border-dashed border-[#FF0000]/30 space-y-8 animate-in fade-in slide-in-from-top-8 duration-500 relative z-10 text-left">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000] text-white font-black shadow-lg shadow-[#FF0000]/40">
                  <HiOutlineTrophy className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#140000] dark:text-[#ffffff]">
                    {t.winnersRevealedHeading}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#950101] dark:text-[#ffffff]/70 uppercase tracking-wider font-bold">
                    {t.winnersRevealedSub}
                  </p>
                </div>
              </div>

              {/* Title editor */}
              <div>
                <input
                  type="text"
                  value={drawTitle}
                  onChange={(e) => setDrawTitle(e.target.value)}
                  placeholder="Draw Title"
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#faf8f8] dark:bg-[#000000] px-4 py-2 text-xs text-[#140000] dark:text-[#ffffff] font-medium focus:border-[#FF0000] focus:outline-none shadow-inner w-full sm:w-64"
                />
              </div>
            </div>

            {/* 3 Winner Ticket Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {selectedWinners.map((winner) => {
                return (
                  <WinnerTicket
                    key={winner.customerId}
                    winner={winner}
                    highlight={winner.position === 1}
                  />
                );
              })}
            </div>

            {/* PERSIST & FINALIZE ACTION BANNER */}
            <div className="rounded-3xl border border-[#FF0000]/40 bg-[#3D0000]/95 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FF0000]/20 p-2">
                  <HiOutlineCheckCircle className="h-6 w-6 text-[#FF0000]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.readyToSaveTitle}</h4>
                  <p className="text-[10px] text-white/70 max-w-xs">{t.readyToSaveSub}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {savedSuccess ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <span className="rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/40 px-4 py-2.5 text-xs font-bold text-[#FF0000] text-center w-full sm:w-auto">
                      {t.drawPersistedNotice}
                    </span>
                    <Link
                      href="/results"
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#FF0000] hover:bg-[#d60000] px-5 py-2.5 text-xs font-bold text-white transition shadow-md shadow-[#FF0000]/30 border border-[#FF0000] w-full sm:w-auto"
                    >
                      <HiOutlineEye className="h-4 w-4" />
                      <span>{t.viewArchiveBtn}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-row w-full gap-2">
                    <button
                      type="button"
                      onClick={handleResetDraw}
                      className="flex-1 rounded-2xl bg-black/40 hover:bg-black/60 text-white px-5 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg border border-white/10"
                    >
                      {language === "bn" ? "রিসেট করুন" : "Reset"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraw}
                      className="flex-[2] rounded-2xl bg-gradient-to-r from-[#FF0000] to-[#950101] hover:from-[#d60000] hover:to-[#7a0000] text-white px-5 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]"
                    >
                      {t.saveDrawBtn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
