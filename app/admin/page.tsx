"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import { getCustomers, resetToDefaultData } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import Link from "next/link";
import {
  HiLockClosed,
  HiKey,
  HiUsers,
  HiTicket,
  HiSparkles,
  HiTrophy,
  HiArrowPath,
  HiShieldCheck,
  HiArrowRight,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "admin" || password === "idk2026") {
      setIsAuthenticated(true);
      setAuthError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("idk_admin_auth", "true");
      }
    } else {
      setAuthError(true);
    }
  };

  const handleQuickDemoUnlock = () => {
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("idk_admin_auth", "true");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("idk_admin_auth");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getCustomers();
      setCustomers(list);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("idk_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
    loadData();
  }, []);

  const handleResetData = async () => {
    if (confirm(language === "bn" ? "সকল ডাটা রিসেট করতে চান?" : "Reset customer pool and past draws to initial mock data?")) {
      await resetToDefaultData();
      await loadData();
    }
  };

  // ================= PASSWORD GATE VIEW =================
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <HiLockClosed className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.adminAuthHeading}
            </h1>
            <p className="text-xs text-slate-500">
              {t.adminAuthSub}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="adminPassword"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                {t.passcodeLabel}
              </label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                placeholder={t.passcodePlaceholder}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                  authError ? "border-rose-500 focus:border-rose-500" : "border-slate-300 focus:border-blue-600"
                }`}
              />
              {authError && (
                <p className="mt-1 text-xs text-rose-600">
                  {language === "bn" ? "ভুল পাসকোড! admin123 লিখুন বা নিচের বাটনে ক্লিক করুন।" : "Incorrect passcode. Try `admin123`."}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-center text-sm font-bold text-white transition-colors shadow-xs"
            >
              {t.enterBtn}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-1">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors underline font-medium"
            >
              {t.demoUnlockBtn}
            </button>
            <p className="text-[11px] text-slate-400">
              Default: <span className="font-semibold text-slate-700">admin123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED DASHBOARD =================
  const activeCount = customers.filter((c) => c.status === "active").length;
  const wonCount = customers.filter((c) => c.status === "won").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <HiShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {t.adminControlHeading}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {t.adminControlSub}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/draw"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold transition-colors shadow-xs"
          >
            <HiSparkles className="h-4 w-4" />
            <span>{t.launchDrawBtn}</span>
            <HiArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handleResetData}
            title="Reset seed data"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition"
          >
            <HiArrowPath className="h-4 w-4" />
            <span>{t.resetSeedBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-red-600 transition"
          >
            <HiArrowLeftOnRectangle className="h-4 w-4" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="retail-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t.totalCustomersMetric}
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {toBnNum(customers.length)}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <HiUsers className="h-5 w-5" />
          </div>
        </div>

        <div className="retail-card p-5 flex items-center justify-between border-blue-200 bg-blue-50/30">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-700">
              {t.activePoolMetric}
            </span>
            <div className="text-3xl font-bold text-blue-700 mt-1">
              {toBnNum(activeCount)}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <HiTicket className="h-5 w-5" />
          </div>
        </div>

        <div className="retail-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t.pastWinnersMetric}
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {toBnNum(wonCount)}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <HiTrophy className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Section 1: Add Customer Form */}
      <AddCustomerForm onCustomerAdded={() => loadData()} />

      {/* Section 2: Customer Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {t.tableHeading}
          </h2>
          <button
            type="button"
            onClick={loadData}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
          >
            <HiArrowPath className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>{t.refreshRoster}</span>
          </button>
        </div>

        <CustomerTable customers={customers} onRefresh={loadData} />
      </div>
    </div>
  );
}
