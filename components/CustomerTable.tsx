"use client";

import { useState } from "react";
import { Customer, CustomerStatus } from "@/lib/types";
import { sendTicketSmsNotification } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import {
  HiMagnifyingGlass,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiPaperAirplane,
  HiCheckCircle,
} from "react-icons/hi2";

interface CustomerTableProps {
  customers: Customer[];
  onCustomerUpdated?: () => void;
}

export default function CustomerTable({
  customers,
}: CustomerTableProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [smsSendingMap, setSmsSendingMap] = useState<Record<string, "sending" | "sent" | "idle">>({});

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendSms = async (customer: Customer) => {
    setSmsSendingMap((prev) => ({ ...prev, [customer.id]: "sending" }));
    try {
      const sent = await sendTicketSmsNotification(customer.phone, customer.code, customer.name);
      if (sent) {
        setSmsSendingMap((prev) => ({ ...prev, [customer.id]: "sent" }));
      } else {
        setSmsSendingMap((prev) => ({ ...prev, [customer.id]: "idle" }));
      }
    } catch {
      setSmsSendingMap((prev) => ({ ...prev, [customer.id]: "idle" }));
    }
  };

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return {
          label: t.statusActive,
          classes: "bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/40",
        };
      case "won":
        return {
          label: t.statusWon,
          classes: "bg-[#950101]/25 text-[#FF0000] border-[#950101]/50",
        };
      case "expired":
        return {
          label: t.statusExpired,
          classes: "bg-[#3D0000]/20 text-[#950101] border-[#3D0000]/40",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF0000]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-slate-200 dark:border-[#950101]/40 bg-white dark:bg-[#000000] pl-10 pr-4 py-2.5 text-xs text-[#140000] dark:text-[#ffffff] placeholder-[#950101]/60 dark:placeholder-slate-400 focus:border-[#FF0000] focus:outline-none shadow-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#000000] border border-slate-200 dark:border-[#950101]/40 w-full sm:w-auto overflow-x-auto">
          {[
            { key: "all", label: t.allTab },
            { key: "active", label: t.activeTab },
            { key: "won", label: t.wonTab },
            { key: "expired", label: t.expiredTab },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key as CustomerStatus | "all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition ${
                statusFilter === item.key
                  ? "bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 font-black border border-[#FF0000]"
                  : "text-[#140000] dark:text-[#ffffff]/70 hover:text-[#FF0000] dark:hover:text-[#ffffff] hover:bg-white dark:hover:bg-white/[0.06]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-[#950101]/40 bg-white dark:bg-[#3D0000]/90 backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#950101]/40 bg-slate-50 dark:bg-[#140000]/60 text-[11px] font-sans font-bold uppercase tracking-wider text-[#950101] dark:text-[#ffffff]/70">
                <th className="px-6 py-4">{t.thCustomer}</th>
                <th className="px-6 py-4">{t.thProduct}</th>
                <th className="px-6 py-4">{t.thCode}</th>
                <th className="px-6 py-4">{t.thStatus}</th>
                <th className="px-6 py-4">{t.thDate}</th>
                <th className="px-6 py-4 text-right">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#950101] dark:text-[#ffffff]/70">
                    <p className="font-semibold text-sm">{language === "bn" ? "কোন কাস্টমার পাওয়া যায়নি" : "No matching customers found"}</p>
                    <p className="text-xs mt-1">{language === "bn" ? "অনুগ্রহ করে সঠিক নাম বা ফোন দিয়ে খুঁজুন" : "Try searching by a different name, phone, or code"}</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const badge = getStatusBadge(customer.status);
                  const smsState = smsSendingMap[customer.id] || "idle";

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Name & Phone */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-sm text-[#140000] dark:text-[#ffffff] flex items-center gap-1.5">
                            <HiOutlineUser className="h-4 w-4 text-[#FF0000]" />
                            <span>{customer.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#950101] dark:text-[#ffffff]/70 font-mono">
                            <HiOutlinePhone className="h-3 w-3 text-[#FF0000]" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Purchased Product */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-[#140000] dark:text-[#ffffff] flex items-center gap-1.5">
                            <HiOutlineShoppingBag className="h-4 w-4 text-[#FF0000]" />
                            <span>{customer.product}</span>
                          </div>
                          {customer.address && (
                            <div className="flex items-center gap-1 text-[11px] text-[#950101] dark:text-[#ffffff]/70 truncate max-w-[200px]">
                              <HiOutlineMapPin className="h-3 w-3 text-[#950101] shrink-0" />
                              <span>{customer.address}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Ticket Number */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-black text-[#FF0000] tracking-wider px-3 py-1 rounded-xl bg-[#FF0000]/15 dark:bg-[#FF0000]/20 border border-[#FF0000]/30 inline-block">
                          {customer.code}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 font-mono text-[11px] text-[#950101] dark:text-[#ffffff]/70">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCalendarDays className="h-4 w-4 text-[#FF0000]" />
                          <span>
                            {new Date(customer.createdAt).toLocaleDateString(
                              language === "bn" ? "bn-BD" : "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        </div>
                      </td>

                      {/* SMS Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSendSms(customer)}
                          disabled={smsState === "sending" || smsState === "sent"}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-sans text-xs font-bold tracking-wide transition ${
                            smsState === "sent"
                              ? "bg-[#3D0000] text-white"
                              : smsState === "sending"
                              ? "bg-[#FF0000]/15 text-[#FF0000]"
                              : "bg-white dark:bg-[#000000]/60 hover:bg-[#FF0000] hover:text-white text-[#140000] dark:text-[#ffffff] border border-slate-200 dark:border-[#950101]/40 shadow-xs"
                          }`}
                        >
                          {smsState === "sent" ? (
                            <>
                              <HiCheckCircle className="h-4 w-4 text-[#FF0000]" />
                              <span>{t.btnSent}</span>
                            </>
                          ) : (
                            <>
                              <HiPaperAirplane className="h-4 w-4" />
                              <span>{smsState === "sending" ? t.sendingSms : t.btnSendSms}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counter summary */}
      <div className="flex items-center justify-between text-xs text-[#950101] dark:text-[#ffffff]/70 font-medium px-2">
        <span>
          {t.showingSummary
            .replace("{count}", toBnNum(filteredCustomers.length))
            .replace("{total}", toBnNum(customers.length))}
        </span>
      </div>
    </div>
  );
}
