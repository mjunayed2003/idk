"use client";

import { useState } from "react";
import { Customer } from "@/lib/types";
import { addCustomer } from "@/lib/data";
import { sendCode } from "@/lib/sms";
import { useLanguage } from "@/context/LanguageContext";
import { 
  HiUserPlus, 
  HiTicket, 
  HiPaperAirplane, 
  HiCheckCircle, 
  HiPhone, 
  HiMapPin, 
  HiShoppingBag, 
  HiUser,
  HiXMark
} from "react-icons/hi2";

interface AddCustomerFormProps {
  onCustomerAdded?: (customer: Customer) => void;
}

export default function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+880 ");
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestCustomer, setLatestCustomer] = useState<Customer | null>(null);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSuccess, setSmsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !product.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSmsSuccess(null);

    try {
      const newCustomer = await addCustomer({
        name,
        phone,
        address,
        product,
        triggerSms: false,
      });

      setLatestCustomer(newCustomer);
      if (onCustomerAdded) {
        onCustomerAdded(newCustomer);
      }

      setName("");
      setPhone("+880 ");
      setAddress("");
      setProduct("");
    } catch (err) {
      console.error("Error creating customer raffle ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSms = async () => {
    if (!latestCustomer) return;
    setSmsSending(true);
    try {
      const res = await sendCode(latestCustomer.phone, latestCustomer.code);
      setSmsSuccess(res.success);
    } catch {
      setSmsSuccess(false);
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
          <HiUserPlus className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-slate-900">
            {t.issueTicketTitle}
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            {t.issueTicketSub}
          </p>
        </div>
      </div>

      {/* SUCCESS TICKET POPUP / MODAL BANNER */}
      {latestCustomer && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 text-slate-900 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                <HiCheckCircle className="h-5 w-5" />
              </span>
              <span className="font-sans text-xs font-bold text-emerald-900">
                {t.ticketGeneratedSuccess}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLatestCustomer(null)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Dismiss ticket preview"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-emerald-200">
            <div>
              <span className="text-[11px] font-sans font-semibold text-slate-500">
                {latestCustomer.name} ({latestCustomer.phone})
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-widest bg-slate-900 text-amber-300 px-3 py-1 rounded-lg shadow-xs">
                  {latestCustomer.code}
                </span>
              </div>
              <span className="text-xs text-slate-600 font-sans mt-1 block">
                {latestCustomer.product}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleManualSms}
                disabled={smsSending || smsSuccess === true}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-sans font-bold shadow-xs transition-all ${
                  smsSuccess
                    ? "bg-emerald-700 text-white cursor-default"
                    : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                }`}
              >
                <HiPaperAirplane className="h-4 w-4" />
                <span>
                  {smsSending
                    ? t.sendingSms
                    : smsSuccess
                    ? t.smsDispatched
                    : t.sendSmsBtn}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM INPUTS */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-sans font-bold text-slate-700"
            >
              <HiUser className="h-4 w-4 text-indigo-600" />
              {t.customerNameLabel}
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-sans font-bold text-slate-700"
            >
              <HiPhone className="h-4 w-4 text-indigo-600" />
              {t.phoneLabel}
            </label>
            <input
              id="customerPhone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 font-mono placeholder-slate-400 transition focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="customerProduct"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-sans font-bold text-slate-700"
            >
              <HiShoppingBag className="h-4 w-4 text-indigo-600" />
              {t.productLabel}
            </label>
            <input
              id="customerProduct"
              type="text"
              required
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder={t.productPlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="customerAddress"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-sans font-bold text-slate-700"
            >
              <HiMapPin className="h-4 w-4 text-indigo-600" />
              {t.addressLabel}
            </label>
            <input
              id="customerAddress"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.addressPlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50"
          >
            <HiTicket className="h-5 w-5" />
            <span>{isSubmitting ? "..." : t.createTicketBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
