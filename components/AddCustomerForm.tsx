"use client";

import { useState } from "react";
import { useAddCustomerMutation } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";

const sendTicketSmsNotification = async (phone: string, code: string, name: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

import {
  HiTicket,
  HiUser,
  HiPhone,
  HiShoppingBag,
  HiMapPin,
  HiPaperAirplane,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

interface AddCustomerFormProps {
  onCustomerAdded?: () => void;
  userRole?: "admin" | "super-admin";
}

export default function AddCustomerForm({
  onCustomerAdded,
  userRole,
}: AddCustomerFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [address, setAddress] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedCustomer, setLastCreatedCustomer] = useState<{
    id: string;
    name: string;
    phone: string;
    code: string;
    product: string;
  } | null>(null);

  const [addCustomer] = useAddCustomerMutation();
  const [smsSending, setSmsSending] = useState(false);
  const [smsSuccess, setSmsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !product) return;

    setIsSubmitting(true);
    setSmsSuccess(null);

    try {
      const newCust = await addCustomer({
        name,
        phone,
        product,
        address,
      }).unwrap();

      setLastCreatedCustomer(newCust);
      setName("");
      setPhone("");
      setProduct("");
      setAddress("");

      if (onCustomerAdded) {
        onCustomerAdded();
      }

      if (userRole !== "admin") {
        setSmsSending(true);
        const sent = await sendTicketSmsNotification(newCust.phone, newCust.code, newCust.name);
        setSmsSuccess(sent);
        setSmsSending(false);
      }
    } catch (err) {
      console.error("Error creating customer ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSms = async () => {
    if (!lastCreatedCustomer) return;
    setSmsSending(true);
    const sent = await sendTicketSmsNotification(
      lastCreatedCustomer.phone,
      lastCreatedCustomer.code,
      lastCreatedCustomer.name
    );
    setSmsSuccess(sent);
    setSmsSending(false);
  };

  return (
    <div className="luxury-card p-6 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] font-black shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37]">
          <HiTicket className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#022C22] tracking-tight">
            {t.issueTicketTitle}
          </h3>
          <p className="text-xs text-[#065F46] font-sans">
            {t.issueTicketSub}
          </p>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {lastCreatedCustomer && (
        <div className="rounded-2xl border border-[#D4AF37] bg-[#F0FDF4] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B]">
                <HiOutlineCheckCircle className="h-4 w-4 text-[#D4AF37]" />
                {t.ticketGeneratedSuccess}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-[#064E3B]">
                {lastCreatedCustomer.code}
              </div>
              <p className="text-xs text-[#022C22] font-sans">
                Assigned to: <strong className="text-[#022C22]">{lastCreatedCustomer.name}</strong> ({lastCreatedCustomer.phone})
              </p>
            </div>

            {/* Manual SMS Dispatch Button */}
            {userRole !== "admin" && (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleManualSms}
                  disabled={smsSending || smsSuccess === true}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-sans font-bold shadow-xs transition-all ${
                    smsSuccess
                      ? "bg-[#022C22] text-white cursor-default"
                      : "bg-[#064E3B] hover:bg-[#043c2e] text-white shadow-[#064E3B]/30 border border-[#D4AF37]"
                  }`}
                >
                  <HiPaperAirplane className="h-4.5 w-4.5 text-[#D4AF37]" />
                  <span>
                    {smsSending
                      ? t.sendingSms
                      : smsSuccess
                      ? t.smsDispatched
                      : t.sendSmsBtn}
                  </span>
                </button>
              </div>
            )}
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
              className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#022C22]"
            >
              <HiUser className="h-4.5 w-4.5 text-[#D4AF37]" />
              {t.customerNameLabel}
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className="w-full rounded-2xl border border-[#D4AF37]/40 bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-[#065F46]/60 transition focus:border-[#064E3B] focus:outline-none shadow-inner"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#022C22]"
            >
              <HiPhone className="h-4.5 w-4.5 text-[#D4AF37]" />
              {t.phoneLabel}
            </label>
            <input
              id="customerPhone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full rounded-2xl border border-[#D4AF37]/40 bg-[#faf8f8] px-4 py-3 text-sm font-mono text-[#022C22] placeholder-[#065F46]/60 transition focus:border-[#064E3B] focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Product Purchased */}
        <div>
          <label
            htmlFor="productPurchased"
            className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#022C22]"
          >
            <HiShoppingBag className="h-4.5 w-4.5 text-[#D4AF37]" />
            {t.productLabel}
          </label>
          <input
            id="productPurchased"
            type="text"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder={t.productPlaceholder}
            className="w-full rounded-2xl border border-[#D4AF37]/40 bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-[#065F46]/60 transition focus:border-[#064E3B] focus:outline-none shadow-inner"
          />
        </div>

        {/* Customer Address */}
        <div>
          <label
            htmlFor="customerAddress"
            className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#022C22]"
          >
            <HiMapPin className="h-4.5 w-4.5 text-[#D4AF37]" />
            {t.addressLabel}
          </label>
          <input
            id="customerAddress"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t.addressPlaceholder}
            className="w-full rounded-2xl border border-[#D4AF37]/40 bg-[#faf8f8] px-4 py-3 text-sm text-[#022C22] placeholder-[#065F46]/60 transition focus:border-[#064E3B] focus:outline-none shadow-inner"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#064E3B] hover:bg-[#043c2e] active:scale-[0.99] py-3.5 text-sm font-black font-sans uppercase tracking-wider text-white shadow-lg shadow-[#064E3B]/30 transition-all disabled:opacity-50 border border-[#D4AF37]"
          >
            <HiTicket className="h-5 w-5 text-[#D4AF37]" />
            <span>{isSubmitting ? "Generating Ticket..." : t.createTicketBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
