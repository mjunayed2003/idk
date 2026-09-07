"use client";

import { useState, useEffect } from "react";
import { useLoginMutation, useGetAllCustomersQuery } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerTable from "@/components/CustomerTable";
import AdminChatManager from "@/components/AdminChatManager";
import { HiOutlineLockClosed, HiOutlineUserPlus, HiOutlineEye, HiOutlineEyeSlash, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<"contacts" | "chat">("contacts");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { data: customers = [], refetch } = useGetAllCustomersQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 5000,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email: "admin@example.com", password }).unwrap();
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
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 backdrop-blur-xl shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/20">
              <HiOutlineLockClosed className="h-8 w-8" />
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-[#140000]">
            Admin Login
          </h1>
          <p className="mb-6 text-center text-sm text-[#950101]">
            Enter the admin password (admin123) to access data entry & support.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border bg-[#faf8f8] px-4 py-3 text-sm text-[#140000] placeholder-[#950101]/60 transition focus:outline-none shadow-inner border-[#950101]/30 focus:border-[#FF0000]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#950101]/70 hover:text-[#FF0000] transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-sm text-[#FF0000]">
                  Invalid password. Please try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#FF0000] hover:bg-[#d60000] py-3 text-center text-xs font-black uppercase text-white transition-all shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#140000] tracking-tight flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            Admin Control Center
          </h1>
          <p className="text-[#950101] mt-1">Manage customer registrations and live customer support.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentTab("contacts")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === "contacts"
                  ? "bg-[#FF0000] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
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
                  ? "bg-[#FF0000] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
              <span>Live Chat & Block</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-[#950101] hover:text-[#FF0000] transition-colors border border-slate-200 rounded-xl px-3.5 py-2 hover:bg-slate-50 font-bold"
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
                <h3 className="font-bold text-[#140000] flex items-center gap-2">
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
