"use client";

import { useState, useEffect } from "react";
import { useLoginMutation, useGetAllCustomersQuery } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import AdminChatManager from "@/components/AdminChatManager";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { 
  HiOutlineLockClosed, 
  HiOutlineUserPlus, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
  HiOutlineKey
} from "react-icons/hi2";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identifier, setIdentifier] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"contacts" | "chat">("contacts");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { data: customers = [], refetch } = useGetAllCustomersQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 5000,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ identifier: identifier.trim(), password }).unwrap();
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        setIsAuthenticated(true);
        setAuthError(false);
        refetch();
      }
    } catch (err) {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/30 bg-white p-8 backdrop-blur-xl shadow-xl">
          <div className="mb-6 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#064E3B]/10 text-[#064E3B] border border-[#D4AF37]/40 mb-3">
              <HiOutlineLockClosed className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold text-[#022C22]">
              {language === "bn" ? "অ্যাডমিন লগইন" : "Admin Login"}
            </h1>
            <p className="mt-1 text-sm text-[#065F46]">
              {language === "bn" ? "ইমেইল বা মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করুন।" : "Enter email or phone number and password to access."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier: Email or Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {language === "bn" ? "ইমেইল অথবা মোবাইল নম্বর" : "Email or Phone Number"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder={language === "bn" ? "যেমন: admin@example.com বা 01700000000" : "admin@example.com or 01700000000"}
                  className="w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-[#065F46]/60 transition focus:outline-none shadow-inner border-[#D4AF37]/40 focus:border-[#064E3B]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex justify-between items-center">
                <label className="text-xs font-semibold text-[#022C22]">
                  {language === "bn" ? "পাসওয়ার্ড" : "Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-[#064E3B] hover:text-[#D4AF37] hover:underline font-semibold"
                >
                  {language === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-[#065F46]/60 transition focus:outline-none shadow-inner border-[#D4AF37]/40 focus:border-[#064E3B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#065F46]/70 hover:text-[#064E3B] transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-xs text-red-600">
                  {language === "bn" ? "ভুল তথ্য! সঠিক ইমেইল/নম্বর এবং পাসওয়ার্ড দিন।" : "Invalid email/phone or password. Please try again."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-2xl bg-[#064E3B] hover:bg-[#043c2e] py-3 text-center text-xs font-black uppercase text-white transition-all shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] disabled:opacity-60"
            >
              {isLoggingIn ? (language === "bn" ? "প্রবেশ করা হচ্ছে..." : "Logging in...") : (language === "bn" ? "লগইন করুন" : "Login")}
            </button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 text-center">
            <p className="text-xs text-[#065F46]">
              {language === "bn" ? "ডিফল্ট অ্যাডমিন:" : "Default Admin:"}{" "}
              <span className="font-semibold text-[#022C22]">admin@example.com</span> /{" "}
              <span className="font-semibold text-[#022C22]">01700000000</span> (Pass: <span className="font-semibold text-[#022C22]">admin123</span>)
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

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#022C22] tracking-tight flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[#064E3B] ring-4 ring-[#D4AF37]/30" />
            Admin Control Center
          </h1>
          <p className="text-[#065F46] mt-1">Manage customer registrations and live customer support.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentTab("contacts")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === "contacts"
                  ? "bg-[#064E3B] text-white shadow-sm border border-[#D4AF37]"
                  : "text-slate-600 hover:text-[#064E3B]"
              }`}
            >
              <HiOutlineUserPlus className="h-4 w-4" />
              <span>Add Contacts</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("chat")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === "chat"
                  ? "bg-[#064E3B] text-white shadow-sm border border-[#D4AF37]"
                  : "text-slate-600 hover:text-[#064E3B]"
              }`}
            >
              <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
              <span>Live Chat & Block</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-[#064E3B] hover:text-[#D4AF37] transition-colors border border-[#D4AF37]/40 rounded-xl px-3.5 py-2 hover:bg-slate-50 font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {currentTab === "contacts" ? (
        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <div className="w-full max-w-2xl">
            <AddCustomerForm onCustomerAdded={refetch} userRole="admin" />
          </div>
          <div className="w-full">
            <div className="rounded-2xl border border-slate-200 bg-white backdrop-blur-xl shadow-xl overflow-hidden flex flex-col h-full">
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-[#022C22] flex items-center gap-2">
                  Recently Added
                </h3>
              </div>
              <div className="flex-1 p-0 sm:p-4">
                <CustomerTable customers={customers.slice(0, 10)} userRole="admin" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <AdminChatManager adminRole="ADMIN" adminName="Admin Support" />
        </div>
      )}
    </div>
  );
}
