"use client";

import { useState, useEffect } from "react";
import { Customer, DrawWinner } from "@/lib/types";
import { getActiveCustomers, runDrawSelection, saveDrawResult } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineTicket,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
  HiOutlineEye,
} from "react-icons/hi2";

export default function DrawBoothPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeCustomers, setActiveCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawTitle, setDrawTitle] = useState("");
  const [selectedWinners, setSelectedWinners] = useState<DrawWinner[] | null>(null);
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

  const handleRunDraw = async () => {
    if (activeCustomers.length < 3) {
      setErrorMsg(t.needMinCustomers);
      return;
    }

    setIsDrawing(true);
    setErrorMsg(null);
    setSelectedWinners(null);
    setSavedSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const winners = await runDrawSelection();
      setSelectedWinners(winners);
      setDrawTitle(language === "bn" ? `মেগা লয়ালটি ড্র #${Date.now().toString().slice(-4)}` : `Grand Draw #${Date.now().toString().slice(-4)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to run draw selection.");
      }
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
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#950101] dark:text-[#ffffff]/70 hover:text-[#FF0000] dark:hover:text-white transition-colors mb-2"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5" />
            <span>{language === "bn" ? "অ্যাডমিন পোর্টালে ফিরুন" : "Return to Admin Portal"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-bold shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
              <HiOutlineSparkles className="h-6 w-6 text-white" />
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

      {/* ================= DRAW ACTION ARENA ================= */}
      <div className="luxury-card p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        {/* Ambient glowing arena */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#FF0000]/15 blur-3xl pointer-events-none" />
        
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

        {/* Big Action Button */}
        <div className="flex flex-col items-center justify-center gap-3 relative z-10">
          <button
            type="button"
            onClick={handleRunDraw}
            disabled={isDrawing || activeCustomers.length < 3}
            className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-5 text-lg font-black uppercase tracking-wider transition-all shadow-2xl ${
              isDrawing
                ? "bg-[#3D0000] text-white/50 cursor-wait border border-[#950101]"
                : activeCustomers.length < 3
                ? "bg-[#3D0000] text-white/50 cursor-not-allowed border border-[#950101]"
                : "bg-[#FF0000] hover:bg-[#d60000] text-white shadow-[#FF0000]/40 hover:scale-105 border border-[#FF0000]"
            }`}
          >
            <HiOutlineSparkles className={`h-6 w-6 ${isDrawing ? "animate-spin text-white" : "text-white"}`} />
            <span>{isDrawing ? t.spinningBtn : t.spinBtn}</span>
          </button>

          {activeCustomers.length < 3 && (
            <p className="text-xs text-[#FF0000] font-medium">
              * {t.needMinCustomers}
            </p>
          )}
        </div>

        {/* Active tickets preview ticker */}
        <div className="pt-6 border-t border-[#950101]/20 dark:border-white/10 relative z-10">
          <span className="text-xs font-bold text-[#950101] dark:text-[#ffffff]/70 uppercase tracking-wider block mb-3">
            {t.qualifyingTickets}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-h-32 overflow-y-auto p-1">
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
      </div>

      {/* ================= WINNER REVEAL AREA ================= */}
      {selectedWinners && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#950101]/20 dark:border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white font-black shadow-lg shadow-[#FF0000]/40">
                <HiOutlineTrophy className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#140000] dark:text-[#ffffff]">
                  {t.winnersRevealedHeading}
                </h3>
                <p className="text-xs text-[#950101] dark:text-[#ffffff]/70">
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
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#000000] px-4 py-2 text-xs text-[#140000] dark:text-[#ffffff] font-medium focus:border-[#FF0000] focus:outline-none shadow-inner"
              />
            </div>
          </div>

          {/* 3 Winner Ticket Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
          <div className="rounded-3xl border border-[#FF0000]/40 bg-[#3D0000]/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <HiOutlineCheckCircle className="h-5 w-5 text-[#FF0000]" />
                <span>{t.readyToSaveTitle}</span>
              </div>
              <p className="text-xs text-white/80 max-w-lg font-sans">
                {t.readyToSaveSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {savedSuccess ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/40 px-4 py-2.5 text-xs font-bold text-[#FF0000]">
                    {t.drawPersistedNotice}
                  </span>
                  <Link
                    href="/results"
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-[#FF0000] hover:bg-[#d60000] px-5 py-2.5 text-xs font-bold text-white transition shadow-md shadow-[#FF0000]/30 border border-[#FF0000]"
                  >
                    <HiOutlineEye className="h-4 w-4" />
                    <span>{t.viewArchiveBtn}</span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveDraw}
                  className="rounded-2xl bg-[#FF0000] hover:bg-[#d60000] text-white px-6 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]"
                >
                  {t.saveDrawBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
