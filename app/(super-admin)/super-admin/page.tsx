"use client";

import { useState, useEffect } from "react";
import { Customer, Draw } from "@/lib/types";
import { 
  getCustomers, 
  resetToDefaultData, 
  getNextDrawDate, 
  saveNextDrawDate, 
  getPrizes, 
  savePrizes, 
  PrizeConfig,
  getPastDraws,
} from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import WinnerTicket from "@/components/WinnerTicket";
import Link from "next/link";
import {
  HiOutlineLockClosed,
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlinePlay,
  HiOutlineTrophy,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineGift,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineTv,
} from "react-icons/hi2";

type AdminTab = "overview" | "customers" | "schedule" | "prizes" | "history";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  
  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pastDraws, setPastDraws] = useState<Draw[]>([]);
  const [nextDrawDate, setNextDrawDate] = useState<string>("");
  const [prizes, setPrizes] = useState<PrizeConfig | null>(null);

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
    if (password === "superadmin" || password === "idk2026") {
      setIsAuthenticated(true);
      setAuthError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("idk_super_admin_auth", "true");
      }
    } else {
      setAuthError(true);
    }
  };

  const handleQuickDemoUnlock = () => {
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("idk_super_admin_auth", "true");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("idk_super_admin_auth");
    }
  };

  const loadData = async () => {
    try {
      const custs = await getCustomers();
      const draws = await getPastDraws();
      const targetDate = await getNextDrawDate();
      const p = await getPrizes();

      setCustomers(custs);
      setPastDraws(draws);
      setNextDrawDate(targetDate);
      setCustomDateInput(targetDate ? new Date(targetDate).toISOString().slice(0, 16) : "");
      setPrizes(p);
      setPrizeForm(p);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("idk_super_admin_auth");
      if (isAuth === "true") {
        setIsAuthenticated(true);
      }
    }
    loadData();
  }, []);

  const handleResetData = async () => {
    if (confirm("Reset all data to sample records? This cannot be undone.")) {
      await resetToDefaultData();
      await loadData();
    }
  };

  const handleCustomerAdded = () => {
    loadData();
  };

  const handleApplyPresetDays = async (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(20, 0, 0, 0); // 8:00 PM
    const isoString = d.toISOString();
    await saveNextDrawDate(isoString);
    setNextDrawDate(isoString);
    setCustomDateInput(d.toISOString().slice(0, 16));
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

  const handleSaveCustomDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDateInput) return;
    const isoString = new Date(customDateInput).toISOString();
    await saveNextDrawDate(isoString);
    setNextDrawDate(isoString);
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

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
        <div className="luxury-card p-8 text-center space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-bold shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
              <HiOutlineLockClosed className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold text-[#ffffff]">
            Super Admin Login
          </h1>
          <p className="mb-6 text-center text-sm text-[#ffffff]/70">
            Enter the super admin password (superadmin) to access the system.
          </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="adminPassword"
                className="mb-1.5 block text-xs font-semibold text-[#140000] "
              >
                {t.passcodeLabel}
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder={t.passcodePlaceholder}
                  className={`w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#140000] placeholder-[#950101]/60 transition focus:outline-none shadow-inner ${
                    authError ? "border-rose-500 focus:border-rose-500" : "border-[#950101]/30 focus:border-[#FF0000]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#950101]/70 hover:text-[#FF0000] :text-[#FF0000] transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="mt-1 text-xs text-[#FF0000]">
                  {language === "bn" ? "ভুল পাসকোড! superadmin লিখুন বা নিচের বাটনে ক্লিক করুন।" : "Incorrect passcode. Try `superadmin`."}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#FF0000] hover:bg-[#d60000] py-3 text-center text-xs font-black uppercase text-white transition-all shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]"
            >
              {t.enterBtn}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-3 border-t border-[#950101]/20 text-center space-y-1">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="text-xs text-[#FF0000] hover:underline font-semibold"
            >
              {t.demoUnlockBtn}
            </button>
            <p className="text-[11px] text-[#950101] ">
              Default: <span className="font-semibold text-[#140000] ">superadmin</span>
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
    <div className="min-h-[100dvh] pb-16">
      
      {/* Header Actions & Tab Navigation Menu */}
      <div className="border-b border-[#950101]/20 bg-white/95 backdrop-blur-xl sticky top-0 z-40 pt-2 pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex overflow-x-auto space-x-1 sm:space-x-2 scrollbar-hide">
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
                    ? "bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 border border-[#FF0000]"
                    : "text-[#140000] hover:text-[#FF0000] :text-[#ffffff] hover:bg-slate-100 :bg-white/[0.05]"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-[#FF0000]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              title="Reset mock data"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 :bg-white/[0.1] px-3 py-2 text-xs font-semibold text-[#140000] transition"
            >
              <HiOutlineArrowPath className="h-4 w-4 text-[#FF0000]" />
              <span className="hidden sm:inline">Reset System Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Top Metric Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="luxury-card p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#950101] ">
                    Total Registered
                  </span>
                  <div className="text-3xl font-black text-[#140000] mt-1 font-mono">
                    {toBnNum(customers.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/30">
                  <HiOutlineUsers className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#FF0000]/50 ">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000]">
                    Active In Pool
                  </span>
                  <div className="text-3xl font-black text-[#FF0000] mt-1 font-mono">
                    {toBnNum(activeCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/30">
                  <HiOutlineTicket className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#950101]/50 ">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#950101]">
                    Awarded Winners
                  </span>
                  <div className="text-3xl font-black text-[#950101] mt-1 font-mono">
                    {toBnNum(wonCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#950101]/15 text-[#950101] border border-[#950101]/30">
                  <HiOutlineTrophy className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#3D0000]/50 ">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000]">
                    Completed Draws
                  </span>
                  <div className="text-3xl font-black text-[#FF0000] mt-1 font-mono">
                    {toBnNum(pastDraws.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/30">
                  <HiOutlinePlay className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Quick Management Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Draw Schedule Status Card */}
              <div className="luxury-card p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000] flex items-center gap-1.5">
                      <HiOutlineCalendarDays className="h-4.5 w-4.5" />
                      Current Raffle Schedule
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("schedule")}
                      className="text-xs font-bold text-[#FF0000] hover:underline"
                    >
                      Change Date
                    </button>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#140000] mt-2">
                    {formattedDrawDate}
                  </h3>
                  <p className="text-xs text-[#950101] mt-1 font-sans">
                    This countdown date is actively displayed on the storefront hero section.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#950101]/20 flex items-center justify-between">
                  <span className="text-xs text-[#950101] ">
                    Eligible Active Tickets: <strong className="text-[#140000] font-mono">{toBnNum(activeCount)}</strong>
                  </span>
                  <Link
                    href="/admin/draw"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF0000] hover:bg-[#d60000] text-white px-4 py-2 text-xs font-bold transition shadow-xs border border-[#FF0000]"
                  >
                    <HiOutlinePlay className="h-4 w-4 text-white" />
                    <span>Launch Live Tumbler</span>
                  </Link>
                </div>
              </div>

              {/* Grand Prizes Showcase Status */}
              <div className="luxury-card p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000] flex items-center gap-1.5">
                      <HiOutlineGift className="h-4.5 w-4.5" />
                      Grand Prizes Configured
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("prizes")}
                      className="text-xs font-bold text-[#FF0000] hover:underline"
                    >
                      Edit Prizes
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-[#950101]/20 ">
                      <span className="font-bold text-[#FF0000]">🥇 1st Prize:</span>
                      <span className="font-medium text-[#140000] ">{prizes?.first.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-[#950101]/20 ">
                      <span className="font-bold text-[#950101]">🥈 2nd Prize:</span>
                      <span className="font-medium text-[#140000] ">{prizes?.second.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-bold text-[#3D0000] ">🥉 3rd Prize:</span>
                      <span className="font-medium text-[#140000] ">{prizes?.third.title}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("prizes")}
                    className="w-full rounded-xl border border-[#950101]/30 bg-white hover:bg-slate-50 :bg-white/[0.1] text-[#140000] py-2 text-xs font-bold transition text-center"
                  >
                    Modify Prize Titles & Warranties
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Customer Register & Table View */}
            <div className="luxury-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#140000] ">
                    Latest Customer Registrations
                  </h3>
                  <p className="text-xs text-[#950101] ">
                    Overview of recent raffle entries issued to customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("customers")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF0000] hover:underline"
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
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-2xl">
              <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
            </div>
            <div className="w-full">
              <CustomerTable 
                customers={customers} 
                onCustomerUpdated={loadData} 
              />
            </div>
          </div>
        )}

        {/* ================= TAB 3: DRAW SCHEDULE & COUNTDOWN ================= */}
        {activeTab === "schedule" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="luxury-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-[#950101]/20 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
                  <HiOutlineCalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#140000] ">
                    Raffle Draw Schedule & Live Timer
                  </h2>
                  <p className="text-xs text-[#950101] font-sans">
                    Set exactly when the live raffle draw takes place. This directly controls the countdown on the homepage.
                  </p>
                </div>
              </div>

              {/* Current Active Date Box */}
              <div className="rounded-2xl border border-[#FF0000]/40 bg-[#FF0000]/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000]">
                    Current Scheduled Draw
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#140000] mt-0.5">
                    {formattedDrawDate}
                  </div>
                </div>
                <span className="px-3.5 py-1 bg-white/80 border border-[#FF0000]/40 rounded-full text-xs font-mono font-bold text-[#FF0000] shadow-xs">
                  Live on Homepage
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-[#140000] uppercase tracking-wider mb-2.5">
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
                      className="rounded-2xl border border-slate-200 bg-white hover:border-[#FF0000] p-3 text-xs font-bold text-[#140000] transition text-center shadow-xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Time Form */}
              <form onSubmit={handleSaveCustomDate} className="space-y-4 pt-4 border-t border-[#950101]/20 ">
                <div>
                  <label htmlFor="customDateTime" className="block text-xs font-bold text-[#140000] mb-1.5">
                    Select Specific Date & Time
                  </label>
                  <input
                    id="customDateTime"
                    type="datetime-local"
                    required
                    value={customDateInput}
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#faf8f8] px-4 py-3 text-sm font-medium text-[#140000] focus:border-[#FF0000] focus:outline-none shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {dateSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF0000]">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Draw schedule updated successfully!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#FF0000] hover:bg-[#d60000] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF0000]/40 transition border border-[#FF0000]"
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
            <div className="luxury-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-[#950101]/20 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
                  <HiOutlineGift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#140000] ">
                    Grand Prizes Configuration
                  </h2>
                  <p className="text-xs text-[#950101] font-sans">
                    Customize the 1st, 2nd, and 3rd grand prizes. These titles and descriptions dynamically appear on the public storefront, live draw booth, and winner tickets.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePrizes} className="space-y-6">
                
                {/* 1st Prize (Grand Champion) */}
                <div className="rounded-2xl border border-[#FF0000]/50 bg-[#FF0000]/15 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF0000] text-white text-xs font-black shadow-xs">
                      1
                    </span>
                    <span className="font-bold text-sm text-[#140000] ">
                      1st Prize — Grand Champion
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#FF0000] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#FF0000] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="rounded-2xl border border-[#950101]/50 bg-[#950101]/15 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#950101] text-white text-xs font-black shadow-xs">
                      2
                    </span>
                    <span className="font-bold text-sm text-[#140000] ">
                      2nd Prize — 1st Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#950101] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#950101] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* 3rd Prize */}
                <div className="rounded-2xl border border-[#3D0000]/50 bg-[#3D0000]/15 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3D0000] text-white text-xs font-black shadow-xs border border-[#950101]">
                      3
                    </span>
                    <span className="font-bold text-sm text-[#140000] ">
                      3rd Prize — 2nd Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#FF0000] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#140000] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#140000] focus:border-[#FF0000] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#950101]/20 ">
                  {prizeSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF0000]">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Prize configurations saved & synced with Storefront!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#FF0000] hover:bg-[#d60000] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF0000]/40 transition border border-[#FF0000]"
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
                <h2 className="text-xl font-bold text-[#140000] ">
                  Past Draw Sessions Archive
                </h2>
                <p className="text-xs text-[#950101] ">
                  Historical log of all completed raffle draw winners.
                </p>
              </div>
              <Link
                href="/super-admin/draw"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF0000] hover:bg-[#d60000] text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-[#FF0000]/30 transition border border-[#FF0000]"
              >
                <HiOutlinePlay className="h-4 w-4 text-white" />
                <span>Start New Live Draw</span>
              </Link>
            </div>

            {pastDraws.length === 0 ? (
              <div className="luxury-card p-12 text-center text-[#950101] ">
                <HiOutlineTrophy className="h-10 w-10 mx-auto text-[#FF0000] mb-2" />
                <p className="font-semibold text-sm">No past draws recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastDraws.map((draw) => (
                  <div key={draw.id} className="luxury-card p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#950101]/20 pb-3">
                      <div>
                        <h3 className="font-bold text-base text-[#140000] ">{draw.title}</h3>
                        <span className="text-[11px] font-mono text-[#950101] ">ID: {draw.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#140000] bg-white px-3 py-1.5 rounded-xl border border-slate-200 ">
                        <HiOutlineCalendarDays className="h-4 w-4 text-[#FF0000]" />
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
