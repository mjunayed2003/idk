"use client";

import { useState } from "react";
import { Customer, CustomerStatus } from "@/lib/types";
import { sendCode } from "@/lib/sms";
import { useLanguage } from "@/context/LanguageContext";
import {
  HiMagnifyingGlass,
  HiTicket,
  HiPaperAirplane,
  HiFunnel,
  HiCheckCircle,
  HiSparkles,
  HiArchiveBox,
} from "react-icons/hi2";

interface CustomerTableProps {
  customers: Customer[];
  onRefresh?: () => void;
}

export default function CustomerTable({
  customers,
}: CustomerTableProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [smsStatusMap, setSmsStatusMap] = useState<Record<string, "sending" | "sent" | "failed">>({});

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.product.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendSms = async (customer: Customer) => {
    setSmsStatusMap((prev) => ({ ...prev, [customer.id]: "sending" }));
    try {
      const res = await sendCode(customer.phone, customer.code);
      if (res.success) {
        setSmsStatusMap((prev) => ({ ...prev, [customer.id]: "sent" }));
        setTimeout(() => {
          setSmsStatusMap((prev) => {
            const next = { ...prev };
            delete next[customer.id];
            return next;
          });
        }, 3000);
      } else {
        setSmsStatusMap((prev) => ({ ...prev, [customer.id]: "failed" }));
      }
    } catch {
      setSmsStatusMap((prev) => ({ ...prev, [customer.id]: "failed" }));
    }
  };

  const statusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-sans font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.statusActive}
          </span>
        );
      case "won":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-[11px] font-sans font-bold text-amber-800">
            <HiSparkles className="h-3 w-3 text-amber-600" />
            {t.statusWon}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[11px] font-sans font-bold text-slate-500">
            <HiArchiveBox className="h-3 w-3" />
            {t.statusExpired}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:outline-none shadow-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
          <HiFunnel className="h-4 w-4 text-slate-400 ml-2 mr-1 hidden sm:block" />
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
                  ? "bg-indigo-600 text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">{t.thCustomer}</th>
              <th className="px-6 py-4">{t.thProduct}</th>
              <th className="px-6 py-4">{t.thCode}</th>
              <th className="px-6 py-4">{t.thStatus}</th>
              <th className="px-6 py-4">{t.thDate}</th>
              <th className="px-6 py-4 text-right">{t.thAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-sans">
                  {language === "bn" ? "কোনো গ্রাহক পাওয়া যায়নি।" : "No customers found matching your criteria."}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const smsState = smsStatusMap[customer.id];

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Customer info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{customer.name}</div>
                      <div className="font-mono text-indigo-600 font-semibold text-[11px]">
                        {customer.phone}
                      </div>
                      <div className="text-slate-500 text-[11px] line-clamp-1 max-w-[200px]">
                        {customer.address}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">
                        {customer.product}
                      </span>
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3 py-1 text-amber-300 font-mono font-bold tracking-wider shadow-xs">
                        <HiTicket className="h-3.5 w-3.5 text-amber-400" />
                        <span>{customer.code}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{statusBadge(customer.status)}</td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 font-sans text-[11px]">
                      {new Date(customer.createdAt).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* SMS Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendSms(customer)}
                        disabled={smsState === "sending" || smsState === "sent"}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-sans text-[11px] font-bold tracking-wide transition ${
                          smsState === "sent"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                            : smsState === "sending"
                            ? "bg-slate-100 text-slate-400"
                            : "bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-300 shadow-xs"
                        }`}
                      >
                        {smsState === "sent" ? (
                          <>
                            <HiCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{t.btnSent}</span>
                          </>
                        ) : (
                          <>
                            <HiPaperAirplane className="h-3.5 w-3.5" />
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

      {/* Summary Count Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-sans text-slate-500">
        <span>
          {t.showingSummary.replace("{count}", toBnNum(filteredCustomers.length)).replace("{total}", toBnNum(customers.length))}
        </span>
        <span>
          {t.eligibleSummary.replace("{count}", toBnNum(customers.filter((c) => c.status === "active").length))}
        </span>
      </div>
    </div>
  );
}
