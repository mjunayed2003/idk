"use client";

import { useState, useEffect } from "react";
import { Customer, Draw } from "@/lib/types";
import { PrizeConfig } from "@/lib/types";
import { 
  useGetAllCustomersQuery,
  useGetDrawHistoryQuery,
  useGetNextDrawDateQuery,
  useSetNextDrawDateMutation,
  useGetPrizesQuery,
  useSetPrizesMutation,
  useLoginMutation
} from "@/lib/store";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import WinnerTicket from "@/components/WinnerTicket";
import AdminChatManager from "@/components/AdminChatManager";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
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
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

type AdminTab = "overview" | "customers" | "schedule" | "prizes" | "history" | "chat";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identifier, setIdentifier] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  
  // Auth state
  const [login] = useLoginMutation();

  // RTK Query hooks
  const { data: customers = [], refetch: refetchCustomers } = useGetAllCustomersQuery(undefined, { skip: !isAuthenticated });
  const { data: pastDraws = [] } = useGetDrawHistoryQuery(undefined, { skip: !isAuthenticated });
  const { data: nextDrawDateData } = useGetNextDrawDateQuery(undefined, { skip: !isAuthenticated });
  const { data: prizesData } = useGetPrizesQuery(undefined, { skip: !isAuthenticated });
  
  const [setNextDrawDateMut] = useSetNextDrawDateMutation();
  const [setPrizesMut] = useSetPrizesMutation();

  const nextDrawDate = nextDrawDateData?.date || "";
  const prizes = prizesData || null;

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ identifier: identifier.trim(), password }).unwrap();
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        setIsAuthenticated(true);
        setAuthError(false);
      }
    } catch (err) {
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

  const loadData = () => {
    // handled by RTK query automatically, but we can set local form states
    if (nextDrawDateData?.date) {
      setCustomDateInput(new Date(nextDrawDateData.date).toISOString().slice(0, 16));
    }
    if (prizesData) {
      setPrizeForm(prizesData);
    }
  };

  useEffect(() => {
    if (nextDrawDateData?.date || prizesData) {
      loadData();
    }
  }, [nextDrawDateData, prizesData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("token");
      if (isAuth) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleResetData = async () => {
    alert("Reset data not supported in production API yet.");
  };

  const handleCustomerAdded = () => {
    refetchCustomers();
  };

  const handleApplyPresetDays = async (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(20, 0, 0, 0); // 8:00 PM
    const isoString = d.toISOString();
    await setNextDrawDateMut(isoString).unwrap();
    setCustomDateInput(d.toISOString().slice(0, 16));
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

  const handleSaveCustomDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDateInput) return;
    const isoString = new Date(customDateInput).toISOString();
    await setNextDrawDateMut(isoString).unwrap();
    setDateSaveSuccess(true);
    setTimeout(() => setDateSaveSuccess(false), 3000);
  };

  const handleSavePrizes = async (e: React.FormEvent) => {
    e.preventDefault();
    await setPrizesMut(prizeForm).unwrap();
    setPrizeSaveSuccess(true);
    setTimeout(() => setPrizeSaveSuccess(false), 3000);
  };

  // ================= PASSWORD GATE VIEW =================
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="luxury-card p-8 text-center space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] font-bold shadow-lg shadow-[#064E3B]/25 border border-[#D4AF37]/40">
              <HiOutlineLockClosed className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold text-[#022C22]">
              Super Admin Login
            </h1>
            <p className="mb-6 text-center text-sm text-[#065F46]">
              {language === "bn" 
                ? "ইমেইল বা মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করুন।" 
                : "Enter email or phone number and password to access the system."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email or Phone Number */}
            <div className="text-left">
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {language === "bn" ? "ইমেইল অথবা মোবাইল নম্বর" : "Email or Phone Number"}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setAuthError(false);
                }}
                placeholder={language === "bn" ? "যেমন: admin@example.com বা 01700000000" : "e.g. admin@example.com or 01700000000"}
                className="w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-slate-400 transition focus:outline-none shadow-inner border-slate-200 focus:border-[#064E3B]"
              />
            </div>

            {/* Password */}
            <div className="text-left">
              <div className="mb-1.5 flex justify-between items-center">
                <label
                  htmlFor="adminPassword"
                  className="block text-xs font-semibold text-[#022C22]"
                >
                  {t.passcodeLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-[#064E3B] hover:underline font-semibold"
                >
                  {language === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                </button>
              </div>
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
                  className={`w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-slate-400 transition focus:outline-none shadow-inner ${
                    authError ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-[#064E3B]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#064E3B] transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">
                  {language === "bn" ? "ভুল তথ্য! সঠিক ইমেইল/নম্বর এবং পাসওয়ার্ড দিন।" : "Invalid email/phone or password. Please try again."}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#064E3B] hover:bg-[#022C22] py-3 text-center text-xs font-black uppercase text-[#D4AF37] transition-all shadow-lg shadow-[#064E3B]/25 border border-[#D4AF37]/50"
            >
              {t.enterBtn}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-3 border-t border-slate-200 text-center space-y-1">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="text-xs text-[#064E3B] hover:underline font-semibold"
            >
              {t.demoUnlockBtn}
            </button>
            <p className="text-[11px] text-[#065F46]">
              Default: <span className="font-semibold text-[#022C22]">admin@example.com</span> / <span className="font-semibold text-[#022C22]">01700000000</span> (Pass: <span className="font-semibold text-[#022C22]">admin123</span>)
            </p>
          </div>

          {/* Forgot Password Modal */}
          <ForgotPasswordModal
            isOpen={isForgotPasswordOpen}
            onClose={() => setIsForgotPasswordOpen(false)}
            initialIdentifier={identifier}
            isBn={language === "bn"}
            onSuccess={(newId) => {
              setIdentifier(newId);
              setPassword("");
            }}
          />
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED ADMIN DASHBOARD =================
  const activeCount = customers.filter((c: import('@/lib/types').Customer) => c.status === "active").length;
  const wonCount = customers.filter((c: import('@/lib/types').Customer) => c.status === "won").length;

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
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 pt-2 pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex overflow-x-auto space-x-1 sm:space-x-2 scrollbar-hide">
          {[
            { id: "overview", label: language === "bn" ? "ড্যাশবোর্ড ওভারভিউ" : "Overview", icon: HiOutlineTv },
            { id: "customers", label: language === "bn" ? "কাস্টমার ও টিকেট" : "Customers & Tickets", icon: HiOutlineUsers },
            { id: "chat", label: language === "bn" ? "লাইভ চ্যাট ও ব্লক" : "Live Chat & Block", icon: HiOutlineChatBubbleLeftRight },
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
                    ? "bg-[#064E3B] text-[#D4AF37] shadow-md shadow-[#064E3B]/25 border border-[#D4AF37]/40"
                    : "text-[#022C22] hover:text-[#064E3B] hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#D4AF37]" : "text-[#064E3B]"}`} />
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-[#022C22] transition"
            >
              <HiOutlineArrowPath className="h-4 w-4 text-[#064E3B]" />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                    Total Registered
                  </span>
                  <div className="text-3xl font-black text-[#022C22] mt-1 font-mono">
                    {toBnNum(customers.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/30">
                  <HiOutlineUsers className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#D4AF37]/50">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                    Active In Pool
                  </span>
                  <div className="text-3xl font-black text-[#064E3B] mt-1 font-mono">
                    {toBnNum(activeCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#064E3B] border border-[#D4AF37]/40">
                  <HiOutlineTicket className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#064E3B]/30">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                    Awarded Winners
                  </span>
                  <div className="text-3xl font-black text-[#022C22] mt-1 font-mono">
                    {toBnNum(wonCount)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20">
                  <HiOutlineTrophy className="h-6 w-6" />
                </div>
              </div>

              <div className="luxury-card p-5 flex items-center justify-between border-[#D4AF37]/30">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                    Completed Draws
                  </span>
                  <div className="text-3xl font-black text-[#022C22] mt-1 font-mono">
                    {toBnNum(pastDraws.length)}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#064E3B] border border-[#D4AF37]/40">
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
                    <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                      <HiOutlineCalendarDays className="h-4.5 w-4.5 text-[#064E3B]" />
                      Current Raffle Schedule
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("schedule")}
                      className="text-xs font-bold text-[#064E3B] hover:underline"
                    >
                      Change Date
                    </button>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#022C22] mt-2">
                    {formattedDrawDate}
                  </h3>
                  <p className="text-xs text-[#065F46] mt-1 font-sans">
                    This countdown date is actively displayed on the storefront hero section.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-[#065F46]">
                    Eligible Active Tickets: <strong className="text-[#022C22] font-mono">{toBnNum(activeCount)}</strong>
                  </span>
                  <Link
                    href="/super-admin/draw"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-[#D4AF37] px-4 py-2 text-xs font-bold transition shadow-xs border border-[#D4AF37]/40"
                  >
                    <HiOutlinePlay className="h-4 w-4 text-[#D4AF37]" />
                    <span>Launch Live Tumbler</span>
                  </Link>
                </div>
              </div>

              {/* Grand Prizes Showcase Status */}
              <div className="luxury-card p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                      <HiOutlineGift className="h-4.5 w-4.5 text-[#064E3B]" />
                      Grand Prizes Configured
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("prizes")}
                      className="text-xs font-bold text-[#064E3B] hover:underline"
                    >
                      Edit Prizes
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
                      <span className="font-bold text-[#D4AF37]">🥇 1st Prize:</span>
                      <span className="font-medium text-[#022C22]">{prizes?.first.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
                      <span className="font-bold text-[#064E3B]">🥈 2nd Prize:</span>
                      <span className="font-medium text-[#022C22]">{prizes?.second.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-bold text-[#065F46]">🥉 3rd Prize:</span>
                      <span className="font-medium text-[#022C22]">{prizes?.third.title}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("prizes")}
                    className="w-full rounded-xl border border-[#064E3B]/30 bg-white hover:bg-slate-50 text-[#064E3B] py-2 text-xs font-bold transition text-center"
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
                  <h3 className="text-lg font-bold text-[#022C22]">
                    Latest Customer Registrations
                  </h3>
                  <p className="text-xs text-[#065F46]">
                    Overview of recent raffle entries issued to customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("customers")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:underline"
                >
                  <span>Open Full Management</span>
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <CustomerTable customers={customers.slice(0, 5)} userRole="super-admin" />
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
                userRole="super-admin"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 3: DRAW SCHEDULE & COUNTDOWN ================= */}
        {activeTab === "schedule" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="luxury-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] shadow-lg shadow-[#064E3B]/25 border border-[#D4AF37]/40">
                  <HiOutlineCalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#022C22]">
                    Raffle Draw Schedule & Live Timer
                  </h2>
                  <p className="text-xs text-[#065F46] font-sans">
                    Set exactly when the live raffle draw takes place. This directly controls the countdown on the homepage.
                  </p>
                </div>
              </div>

              {/* Current Active Date Box */}
              <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#064E3B]/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                    Current Scheduled Draw
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#022C22] mt-0.5">
                    {formattedDrawDate}
                  </div>
                </div>
                <span className="px-3.5 py-1 bg-white border border-[#D4AF37]/40 rounded-full text-xs font-mono font-bold text-[#064E3B] shadow-xs">
                  Live on Homepage
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-[#022C22] uppercase tracking-wider mb-2.5">
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
                      className="rounded-2xl border border-slate-200 bg-white hover:border-[#064E3B] hover:text-[#064E3B] p-3 text-xs font-bold text-[#022C22] transition text-center shadow-xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Time Form */}
              <form onSubmit={handleSaveCustomDate} className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <label htmlFor="customDateTime" className="block text-xs font-bold text-[#022C22] mb-1.5">
                    Select Specific Date & Time
                  </label>
                  <input
                    id="customDateTime"
                    type="datetime-local"
                    required
                    value={customDateInput}
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#faf8f8] px-4 py-3 text-sm font-medium text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {dateSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B]">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Draw schedule updated successfully!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#064E3B] hover:bg-[#022C22] px-6 py-3 text-sm font-bold text-[#D4AF37] shadow-lg shadow-[#064E3B]/25 transition border border-[#D4AF37]/40"
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
              <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] shadow-lg shadow-[#064E3B]/25 border border-[#D4AF37]/40">
                  <HiOutlineGift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#022C22]">
                    Grand Prizes Configuration
                  </h2>
                  <p className="text-xs text-[#065F46] font-sans">
                    Customize the 1st, 2nd, and 3rd grand prizes. These titles and descriptions dynamically appear on the public storefront, live draw booth, and winner tickets.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePrizes} className="space-y-6">
                
                {/* 1st Prize (Grand Champion) */}
                <div className="rounded-2xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#022C22] text-xs font-black shadow-xs">
                      1
                    </span>
                    <span className="font-bold text-sm text-[#022C22]">
                      1st Prize — Grand Champion
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="rounded-2xl border border-[#064E3B]/40 bg-[#064E3B]/5 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#064E3B] text-white text-xs font-black shadow-xs">
                      2
                    </span>
                    <span className="font-bold text-sm text-[#022C22]">
                      2nd Prize — 1st Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* 3rd Prize */}
                <div className="rounded-2xl border border-slate-300 bg-slate-50 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-black shadow-xs">
                      3
                    </span>
                    <span className="font-bold text-sm text-[#022C22]">
                      3rd Prize — 2nd Runner Up
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#022C22] mb-1">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[#022C22] focus:border-[#064E3B] focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  {prizeSaveSuccess ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B]">
                      <HiOutlineCheckCircle className="h-5 w-5" />
                      <span>Prize configurations saved & synced with Storefront!</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="rounded-2xl bg-[#064E3B] hover:bg-[#022C22] px-6 py-3 text-sm font-bold text-[#D4AF37] shadow-lg shadow-[#064E3B]/25 transition border border-[#D4AF37]/40"
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
                <h2 className="text-xl font-bold text-[#022C22]">
                  Past Draw Sessions Archive
                </h2>
                <p className="text-xs text-[#065F46]">
                  Historical log of all completed raffle draw winners.
                </p>
              </div>
              <Link
                href="/super-admin/draw"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#064E3B] hover:bg-[#022C22] text-[#D4AF37] px-5 py-2.5 text-xs font-bold shadow-md shadow-[#064E3B]/25 transition border border-[#D4AF37]/40"
              >
                <HiOutlinePlay className="h-4 w-4 text-[#D4AF37]" />
                <span>Start New Live Draw</span>
              </Link>
            </div>

            {pastDraws.length === 0 ? (
              <div className="luxury-card p-12 text-center text-[#065F46]">
                <HiOutlineTrophy className="h-10 w-10 mx-auto text-[#D4AF37] mb-2" />
                <p className="font-semibold text-sm">No past draws recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastDraws.map((draw: import('@/lib/types').Draw) => (
                  <div key={draw.id} className="luxury-card p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="font-bold text-base text-[#022C22]">{draw.title}</h3>
                        <span className="text-[11px] font-mono text-[#065F46]">ID: {draw.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#022C22] bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                        <HiOutlineCalendarDays className="h-4 w-4 text-[#064E3B]" />
                        <span>{new Date(draw.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {draw.winners.map((winner: import('@/lib/types').DrawWinner) => (
                        <div key={winner.customerId} className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5 shadow-inner">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#064E3B]">
                            {winner.position === 1 ? "1st Prize" : winner.position === 2 ? "2nd Prize" : "3rd Prize"}
                          </span>
                          <div className="font-bold text-sm text-[#022C22]">{winner.name}</div>
                          <div className="font-mono text-xs text-[#065F46]">{winner.code}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: LIVE CHAT & BLOCK ================= */}
        {activeTab === "chat" && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <AdminChatManager adminRole="SUPER_ADMIN" adminName="Super Admin" />
          </div>
        )}

      </div>
    </div>
  );
}
