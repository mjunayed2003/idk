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
}

export default function AddCustomerForm({
  onCustomerAdded,
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

      setSmsSending(true);
      const sent = await sendTicketSmsNotification(newCust.phone, newCust.code, newCust.name);
      setSmsSuccess(sent);
      setSmsSending(false);
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
      <div className="flex items-center gap-3 border-b border-[#950101]/30 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-black shadow-lg shadow-[#FF0000]/40 border border-[#FF0000]">
          <HiTicket className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#140000] tracking-tight">
            {t.issueTicketTitle}
          </h3>
          <p className="text-xs text-[#950101] font-sans">
            {t.issueTicketSub}
          </p>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {lastCreatedCustomer && (
        <div className="rounded-2xl border border-[#FF0000]/40 bg-[#FF0000]/15 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#FF0000]">
                <HiOutlineCheckCircle className="h-4 w-4" />
                {t.ticketGeneratedSuccess}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-[#FF0000]">
                {lastCreatedCustomer.code}
              </div>
              <p className="text-xs text-[#140000] font-sans">
                Assigned to: <strong className="text-[#140000] ">{lastCreatedCustomer.name}</strong> ({lastCreatedCustomer.phone})
              </p>
            </div>

            {/* Manual SMS Dispatch Button */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleManualSms}
                disabled={smsSending || smsSuccess === true}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-sans font-bold shadow-xs transition-all ${
                  smsSuccess
                    ? "bg-[#3D0000] text-white cursor-default"
                    : "bg-[#FF0000] hover:bg-[#d60000] text-white shadow-[#FF0000]/30 border border-[#FF0000]"
                }`}
              >
                <HiPaperAirplane className="h-4.5 w-4.5" />
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
              className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#140000] "
            >
              <HiUser className="h-4.5 w-4.5 text-[#FF0000]" />
              {t.customerNameLabel}
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className="w-full rounded-2xl border border-[#950101]/30 bg-[#faf8f8] px-4 py-3 text-sm text-[#140000] placeholder-[#950101]/60 transition focus:border-[#FF0000] focus:outline-none shadow-inner"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#140000] "
            >
              <HiPhone className="h-4.5 w-4.5 text-[#FF0000]" />
              {t.phoneLabel}
            </label>
            <input
              id="customerPhone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full rounded-2xl border border-[#950101]/30 bg-[#faf8f8] px-4 py-3 text-sm font-mono text-[#140000] placeholder-[#950101]/60 transition focus:border-[#FF0000] focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Product Purchased */}
        <div>
          <label
            htmlFor="productPurchased"
            className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#140000] "
          >
            <HiShoppingBag className="h-4.5 w-4.5 text-[#FF0000]" />
            {t.productLabel}
          </label>
          <input
            id="productPurchased"
            type="text"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder={t.productPlaceholder}
            className="w-full rounded-2xl border border-[#950101]/30 bg-[#faf8f8] px-4 py-3 text-sm text-[#140000] placeholder-[#950101]/60 transition focus:border-[#FF0000] focus:outline-none shadow-inner"
          />
        </div>

        {/* Customer Address */}
        <div>
          <label
            htmlFor="customerAddress"
            className="mb-1.5 flex items-center gap-2 text-xs font-sans font-bold text-[#140000] "
          >
            <HiMapPin className="h-4.5 w-4.5 text-[#FF0000]" />
            {t.addressLabel}
          </label>
          <input
            id="customerAddress"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t.addressPlaceholder}
            className="w-full rounded-2xl border border-[#950101]/30 bg-[#faf8f8] px-4 py-3 text-sm text-[#140000] placeholder-[#950101]/60 transition focus:border-[#FF0000] focus:outline-none shadow-inner"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF0000] hover:bg-[#d60000] active:scale-[0.99] py-3.5 text-sm font-black font-sans uppercase tracking-wider text-white shadow-lg shadow-[#FF0000]/40 transition-all disabled:opacity-50 border border-[#FF0000]"
          >
            <HiTicket className="h-5 w-5 text-white" />
            <span>{isSubmitting ? "Generating Ticket..." : t.createTicketBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
