"use client";

import { useState, useEffect } from "react";
import { Customer, DrawWinner } from "@/lib/types";
import { getActiveCustomers, runDrawSelection, saveDrawResult } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiSparkles,
  HiTrophy,
  HiTicket,
  HiArrowPath,
  HiCheckCircle,
  HiArrowLeft,
  HiLockClosed,
  HiEye,
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
        <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs mx-auto">
            <HiLockClosed className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.restrictedTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold uppercase text-white shadow-xs transition-colors"
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
            className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <HiArrowLeft className="h-3.5 w-3.5" />
            <span>{language === "bn" ? "অ্যাডমিন পোর্টালে ফিরুন" : "Return to Admin Portal"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold shadow-xs">
              <HiSparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {t.drawBoothHeading}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {t.drawBoothSub}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 border border-slate-200 shadow-xs">
            <HiTicket className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-600">
              {t.activePoolMetric}: <strong className="text-blue-600 font-bold">{toBnNum(activeCustomers.length)}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={loadActive}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:text-blue-600 transition shadow-xs"
            title="Refresh count"
          >
            <HiArrowPath className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ================= DRAW ACTION ARENA ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-xs space-y-6">
        
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {t.fairDraw}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
            {t.drawBoothHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.drawInstruction}
          </p>
        </div>

        {/* Big Action Button */}
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRunDraw}
            disabled={isDrawing || activeCustomers.length < 3}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all shadow-xs ${
              isDrawing
                ? "bg-slate-100 text-slate-400 cursor-wait border border-slate-200"
                : activeCustomers.length < 3
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 hover:scale-102"
            }`}
          >
            <HiSparkles className={`h-5 w-5 ${isDrawing ? "animate-spin" : ""}`} />
            <span>{isDrawing ? t.spinningBtn : t.spinBtn}</span>
          </button>

          {activeCustomers.length < 3 && (
            <p className="text-xs text-rose-600 font-medium">
              * {t.needMinCustomers}
            </p>
          )}
        </div>

        {/* Active tickets preview ticker */}
        <div className="pt-5 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            {t.qualifyingTickets}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-h-28 overflow-y-auto p-1">
            {activeCustomers.map((cust) => (
              <span
                key={cust.id}
                className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-700 border border-slate-200"
              >
                {cust.code} ({cust.name.split(" ")[0]})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= WINNER REVEAL AREA ================= */}
      {selectedWinners && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
                <HiTrophy className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.winnersRevealedHeading}
                </h3>
                <p className="text-xs text-slate-500">
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
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
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
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-lg font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                <HiCheckCircle className="h-5 w-5 text-emerald-600" />
                <span>{t.readyToSaveTitle}</span>
              </div>
              <p className="text-xs text-slate-600 max-w-lg">
                {t.readyToSaveSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {savedSuccess ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2 text-xs font-bold text-emerald-800">
                    {t.drawPersistedNotice}
                  </span>
                  <Link
                    href="/results"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    <HiEye className="h-4 w-4" />
                    <span>{t.viewArchiveBtn}</span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveDraw}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-xs"
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
