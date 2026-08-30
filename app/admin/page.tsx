"use client";

import { useState, useEffect } from "react";
import { Customer, Draw, DrawWinner } from "@/lib/types";
import { 
  getCustomers, 
  resetToDefaultData, 
  getNextDrawDate, 
  saveNextDrawDate, 
  getPrizes, 
  savePrizes, 
  PrizeConfig,
  getPastDraws,
  deleteCustomer,
  addCustomer
} from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiOutlineLockClosed,
  HiOutlineKey,
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineGift,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineTv,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

type AdminTab = "overview" | "customers" | "schedule" | "prizes" | "history";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  
  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pastDraws, setPastDraws] = useState<Draw[]>([]);
  const [nextDrawDate, setNextDrawDate] = useState<string>("");
  const [prizes, setPrizes] = useState<PrizeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [customDateInput, setCustomDateInput] = useState("");
  const [dateSaveSuccess, setDateSaveSuccess] = useState(false);
  
  const [prizeForm, setPrizeForm] = useState<PrizeConfig>({
    first: { title: "", highlight: "", warranty: "" },
    second: { title: "", highlight: "", warranty: "" },
    third: { title: "", highlight: "", warranty: "" },
  });
  const [prizeSaveSuccess, setPrizeSaveSuccess] = useState(false);

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
      const [custList, draws, nextDate, prizeData] = await Promise.all([
        getCustomers(),
        getPastDraws(),
        getNextDrawDate(),
        getPrizes(),
      ]);
      setCustomers(custList);
      setPastDraws(draws);
      setNextDrawDate(nextDate);
      setPrizes(prizeData);
      setPrizeForm(prizeData);
      
      // initialize date input with current ISO slice
      if (nextDate) {
        const d = new Date(nextDate);
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setCustomDateInput(localIso);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
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
    if (confirm(language === "bn" ? "সকল ডাটা ও সেটিংস ডিফল্টে রিসেট করতে চান?" : "Reset all customers, draws, schedule, and prizes to default?")) {
      await resetToDefaultData();
      await loadData();
    }
  };

  const handleCustomerAdded = (newCust: Customer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  // Schedule updates
  const handleSaveCustomDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDateInput) return;
    const iso = new Date(customDateInput).toISOString();
    const updated = await saveNextDrawDate(iso);
    setNextDrawDate(updated);
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

  const handleApplyPresetDays = async (days: number) => {
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const iso = target.toISOString();
    const updated = await saveNextDrawDate(iso);
    setNextDrawDate(updated);
    const localIso = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setCustomDateInput(localIso);
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

  // Prize updates
  const handleSavePrizes = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await savePrizes(prizeForm);
    setPrizes(updated);
    setPrizeSaveSuccess(true);
    setTimeout(() => setPrizeSaveSuccess(false), 3000);
  };

  // ================= PASSWORD GATE VIEW =================
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-xs">
              <HiOutlineLockClosed className="h-7 w-7" />
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
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                  authError ? "border-rose-500 focus:border-rose-500" : "border-slate-300 focus:border-blue-600 shadow-xs"
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
              className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-center text-sm font-bold text-white transition-colors shadow-xs"
            >
              {t.enterBtn}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors underline font-semibold"
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

  // ================= AUTHENTICATED ADMIN DASHBOARD =================
  const activeCount = customers.filter((c) => c.status === "active").length;
  const wonCount = customers.filter((c) => c.status === "won").length;

  const formattedDrawDate = nextDrawDate
    ? new Date(nextDrawDate).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Top Admin Navigation Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <HiOutlineShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900">
                  {siteConfig.shopName} Admin Center
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ● Authenticated
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Manage Customers, Grand Prizes, Draw Schedule & Live Tumbler
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/draw"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <HiOutlineSparkles className="h-4.5 w-4.5 text-white" />
              <span>{t.navDrawBooth}</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition"
              title="View Public Store"
            >
              <HiOutlineEye className="h-4 w-4" />
              <span className="hidden sm:inline">View Public Store</span>
            </Link>

            <button
              type="button"
              onClick={handleResetData}
              title="Reset mock data"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition"
            >
              <HiOutlineArrowPath className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 px-3 py-2 text-xs font-semibold text-slate-700 transition"
              title="Logout"
            >
              <HiOutlineArrowLeftOnRectangle className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 sm:space-x-2 border-t border-slate-100 pt-1.5 pb-2">
          {[
            { id: "overview", label: language === "bn" ? "ড্যাশবোর্ড ওভারভিউ" : "Overview", icon: HiOutlineTv },
            { id: "customers", label: language === "bn" ? "কাস্টমার ও টিকেট" : "Customers & Tickets", icon: HiOutlineUsers },
            { id: "schedule", label: language === "bn" ? "ড্র শিডিউল ও কাউন্টডাউন" : "Draw Schedule", icon: HiOutlineCalendarDays },
            { id: "prizes", label: language === "bn" ? "পুরস্কার কনফিগারেশন" : "Prize Pool Config", icon: HiOutlineGift },
            { id: "history", label: language === "bn" ? "বিজয়ীদের ইতিহাস" : "Draw History", icon: HiOutlineTrophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Top Metric Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Registered
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {toBnNum(customers.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <HiOutlineUsers className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Active In Pool
                  </span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">
                    {toBnNum(activeCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <HiOutlineTicket className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Awarded Winners
                  </span>
                  <div className="text-3xl font-black text-amber-700 mt-1">
                    {toBnNum(wonCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <HiOutlineTrophy className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Completed Draws
                  </span>
                  <div className="text-3xl font-black text-purple-700 mt-1">
                    {toBnNum(pastDraws.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <HiOutlineSparkles className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Quick Management Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Draw Schedule Status Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <HiOutlineCalendarDays className="h-4.5 w-4.5" />
                      Current Raffle Schedule
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("schedule")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      Change Date
                    </button>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    {formattedDrawDate}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    This countdown date is actively displayed on the storefront hero section.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Eligible Active Tickets: <strong className="text-slate-900">{toBnNum(activeCount)}</strong>
                  </span>
                  <Link
                    href="/admin/draw"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
                  >
                    <HiOutlineSparkles className="h-4 w-4" />
                    <span>Launch Live Tumbler</span>
                  </Link>
                </div>
              </div>

              {/* Grand Prizes Showcase Status */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <HiOutlineGift className="h-4.5 w-4.5" />
                      Grand Prizes Configured
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("prizes")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      Edit Prizes
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-900">🥇 1st Prize:</span>
                      <span className="font-medium text-slate-700">{prizes?.first.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-900">🥈 2nd Prize:</span>
                      <span className="font-medium text-slate-700">{prizes?.second.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-bold text-slate-900">🥉 3rd Prize:</span>
                      <span className="font-medium text-slate-700">{prizes?.third.title}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("prizes")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 text-xs font-bold transition text-center"
                  >
                    Modify Prize Titles & Warranties
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Customer Register & Table View */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Latest Customer Registrations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Overview of recent raffle entries issued to customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("customers")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  <span>Open Full Management</span>
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <CustomerTable customers={customers.slice(0, 5)} />
            </div>

          </div>
        )}

        {/* ================= TAB 2: CUSTOMERS & TICKETS ================= */}
        {activeTab === "customers" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 sticky top-28">
              <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <CustomerTable 
                customers={customers} 
                onRefresh={loadData} 
              />
            </div>
          </div>
        )}

        {/* ================= TAB 3: DRAW SCHEDULE & COUNTDOWN ================= */}
        {activeTab === "schedule" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                  <HiOutlineCalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Raffle Draw Schedule & Live Timer
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set exactly when the live raffle draw takes place. This directly controls the countdown on the homepage.
                  </p>
                </div>
              </div>

              {/* Current Active Date Box */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Current Scheduled Draw
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {formattedDrawDate}
                  </div>
                </div>
                <span className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-mono font-bold text-blue-700 shadow-2xs">
                  Live on Homepage
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Quick Preset Schedules
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "+7 Days (Next Week)", days: 7 },
                    { label: "+14 Days (Standard)", days: 14 },
                    { label: "+21 Days (3 Weeks)", days: 21 },
                    { label: "+30 Days (Month End)", days: 30 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => handleApplyPresetDays(preset.days)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 p-3 text-xs font-bold text-slate-700 transition text-center shadow-2xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Time Form */}
              <form onSubmit={handleSaveCustomDate} className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label htmlFor="customDateTime" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Specific Date & Time
                  </label>
                  <input
                    id="customDateTime"
                    type="datetime-local"
                    required
                    value={customDateInput}
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {dateSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Draw schedule updated successfully!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-xs transition"
                  >
                    Save Draw Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 4: GRAND PRIZE POOL CONFIGURATION ================= */}
        {activeTab === "prizes" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                  <HiOutlineGift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Grand Prizes Configuration
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customize the 1st, 2nd, and 3rd grand prizes. These titles and descriptions dynamically appear on the public storefront, live draw booth, and winner tickets.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePrizes} className="space-y-6">
                
                {/* 1st Prize (Grand Champion) */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
                      1
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      1st Prize — Grand Champion
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prize Name / Model Title
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.first.title}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          first: { ...prizeForm.first, title: e.target.value }
                        })}
                        placeholder="e.g. Smart 4K UHD LED TV (55&quot;)"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highlight / Tagline
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.first.highlight}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          first: { ...prizeForm.first, highlight: e.target.value }
                        })}
                        placeholder="e.g. Grand Champion Mega Prize"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                      2
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      2nd Prize — 1st Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prize Name / Model Title
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.second.title}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          second: { ...prizeForm.second, title: e.target.value }
                        })}
                        placeholder="e.g. Microwave Oven & Air Fryer Combo"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highlight / Tagline
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.second.highlight}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          second: { ...prizeForm.second, highlight: e.target.value }
                        })}
                        placeholder="e.g. 1st Runner-Up Prize"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3rd Prize */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                      3
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      3rd Prize — 2nd Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prize Name / Model Title
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.third.title}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          third: { ...prizeForm.third, title: e.target.value }
                        })}
                        placeholder="e.g. Wireless ANC Soundbar & Subwoofer"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highlight / Tagline
                      </label>
                      <input
                        type="text"
                        required
                        value={prizeForm.third.highlight}
                        onChange={(e) => setPrizeForm({
                          ...prizeForm,
                          third: { ...prizeForm.third, highlight: e.target.value }
                        })}
                        placeholder="e.g. Premium Audio Prize"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {prizeSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Prize configurations saved & synced with Storefront!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-xs transition"
                  >
                    Save & Update All Prizes
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 5: DRAW HISTORY ================= */}
        {activeTab === "history" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Past Draw Sessions Archive
                </h2>
                <p className="text-xs text-slate-500">
                  Historical log of all completed raffle draw winners.
                </p>
              </div>
              <Link
                href="/admin/draw"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition"
              >
                <HiOutlineSparkles className="h-4 w-4" />
                <span>Start New Live Draw</span>
              </Link>
            </div>

            {pastDraws.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <HiOutlineTrophy className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-sm">No past draws recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastDraws.map((draw) => (
                  <div key={draw.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{draw.title}</h3>
                        <span className="text-[11px] font-mono text-slate-400">ID: {draw.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                        <HiOutlineCalendarDays className="h-4 w-4 text-blue-600" />
                        <span>{new Date(draw.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {draw.winners.map((winner) => (
                        <WinnerTicket key={winner.code} winner={winner} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
