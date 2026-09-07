"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { useGetNextDrawDateQuery, useGetActiveCustomersQuery, useGetPrizesQuery } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import CountdownCard from "@/components/CountdownCard";
import Link from "next/link";
import {
  HiShoppingBag,
  HiChatBubbleLeftRight,
  HiTrophy,
  HiArrowRight,
  HiShieldCheck,
  HiGift,
  HiCheckBadge,
  HiCheckCircle,
  HiDevicePhoneMobile,
  HiTv,
} from "react-icons/hi2";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { data: dateData } = useGetNextDrawDateQuery(undefined);
  const { data: activeData } = useGetActiveCustomersQuery(undefined);
  const { data: prizeData } = useGetPrizesQuery(undefined);

  const nextDrawDate = dateData?.date || new Date().toISOString();
  const activeCount = activeData?.length || 0;

  const toBnNum = (n: number | string) => {
    if (language !== "bn") return String(n);
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(n)
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const steps = [
    {
      step: language === "bn" ? "১" : "1",
      title: t.step1Title,
      desc: t.step1Desc,
      icon: HiShoppingBag,
    },
    {
      step: language === "bn" ? "২" : "2",
      title: t.step2Title,
      desc: t.step2Desc,
      icon: HiChatBubbleLeftRight,
    },
    {
      step: language === "bn" ? "৩" : "3",
      title: t.step3Title,
      desc: t.step3Desc,
      icon: HiTrophy,
    },
  ];

  const prizes = [
    {
      place: t.firstPrizeBadge,
      title: prizeData?.first.title || t.firstPrizeTitle,
      highlight: prizeData?.first.highlight || t.firstPrizeHighlight,
      badgeBg: "bg-[#064E3B] text-white border border-[#D4AF37]",
      tag: language === "bn" ? "১ম পুরস্কার" : "1st Prize",
      icon: HiTv,
      color: "text-[#D4AF37]",
      cardBorder: "border-[#D4AF37] gold-glow bg-white",
    },
    {
      place: t.secondPrizeBadge,
      title: prizeData?.second.title || t.secondPrizeTitle,
      highlight: prizeData?.second.highlight || t.secondPrizeHighlight,
      badgeBg: "bg-[#044333] text-white border border-[#D4AF37]/60",
      tag: language === "bn" ? "২য় পুরস্কার" : "2nd Prize",
      icon: HiGift,
      color: "text-[#064E3B]",
      cardBorder: "border-[#064E3B]/30 bg-white shadow-[#064E3B]/10",
    },
    {
      place: t.thirdPrizeBadge,
      title: prizeData?.third.title || t.thirdPrizeTitle,
      highlight: prizeData?.third.highlight || t.thirdPrizeHighlight,
      badgeBg: "bg-[#022C22] text-white border border-[#D4AF37]/40",
      tag: language === "bn" ? "৩য় পুরস্কার" : "3rd Prize",
      icon: HiDevicePhoneMobile,
      color: "text-[#064E3B]",
      cardBorder: "border-slate-200 bg-white shadow-[#022C22]/10",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-12 sm:space-y-16">
      
      {/* ================= HERO SECTION ================= */}
      <section className="luxury-card p-6 sm:p-10 relative overflow-hidden">
        {/* Ambient subtle glow inside hero */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#064E3B]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Retail Campaign Info */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Official Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B]/10 border border-[#D4AF37]/50 px-3.5 py-1.5 text-xs font-bold text-[#064E3B] shadow-xs">
              <HiShieldCheck className="h-4 w-4 text-[#D4AF37]" />
              <span>{t.rewardSchemeBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#022C22] leading-tight">
              {language === "bn" ? (
                <>
                  <span className="text-[#064E3B]">
                    {siteConfig.shopName}
                  </span>{" "}
                  মেগা র‌্যাফেল ড্র ও পুরস্কার অফার!
                </>
              ) : (
                <>
                  Shop at{" "}
                  <span className="text-[#064E3B]">
                    {siteConfig.shopName}
                  </span>{" "}
                  & Win Grand Electronics!
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#065F46] leading-relaxed font-sans font-medium">
              {language === "bn" 
                ? "আমাদের যেকোনো পণ্য কেনাকাটা করলেই স্বয়ংক্রিয়ভাবে একটি অফিসিয়াল ডিজিটাল র‌্যাফেল কোড আপনার মোবাইলে এসএমএস আকারে চলে যাবে। লাইভ ড্র-তে জিতে নিন ৫৫\" স্মার্ট ৪কে টিভি সহ দারুণ সব পুরস্কার!"
                : "Every purchase at IDK automatically enrolls you with an official digital raffle code sent via SMS. Participate in our live scheduled draw to win premium 55\" Smart TVs and home appliances!"}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#043c2e] text-white px-6 py-3.5 text-sm font-bold transition-all shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] hover:scale-102"
              >
                <HiTrophy className="h-4.5 w-4.5 text-[#D4AF37]" />
                <span>{t.browseWinnersBtn}</span>
                <HiArrowRight className="h-4 w-4 text-[#D4AF37]" />
              </Link>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#D4AF37]/20 text-xs text-[#022C22] font-sans">
              <div className="flex items-center gap-2 font-semibold">
                <HiCheckBadge className="h-4.5 w-4.5 text-[#D4AF37] shrink-0" />
                <span>{t.fairDraw}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <HiChatBubbleLeftRight className="h-4.5 w-4.5 text-[#064E3B] shrink-0" />
                <span>{language === "bn" ? "তাৎক্ষণিক SMS কোড" : "Instant SMS Code"}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <HiShieldCheck className="h-4.5 w-4.5 text-[#D4AF37] shrink-0" />
                <span>{t.genuineProduct}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Countdown Box */}
          <div className="lg:col-span-5">
            <CountdownCard targetDate={nextDrawDate} />
          </div>

        </div>
      </section>

      {/* ================= GRAND PRIZES SHOWCASE ================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D4AF37]/30 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#064E3B] flex items-center gap-1.5">
              <HiGift className="h-4 w-4 text-[#D4AF37]" />
              {t.prizesHeading}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#022C22] mt-1">
              {t.prizesSubheading}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#065F46]">
            {t.activePool}: <strong className="text-[#064E3B] font-bold font-mono">{toBnNum(activeCount)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {prizes.map((prize, idx) => {
            const Icon = prize.icon;

            return (
              <div
                key={idx}
                className={`luxury-card p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${prize.cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${prize.badgeBg} shadow-sm`}>
                      {prize.tag}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B]/10 border border-[#D4AF37]/40 shadow-inner">
                      <Icon className={`h-7 w-7 ${prize.color}`} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-[11px] font-bold text-[#065F46] uppercase tracking-widest block">
                      {prize.highlight}
                    </span>
                    <h3 className="text-xl font-bold text-[#022C22] mt-1.5 leading-snug">
                      {prize.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#065F46] font-medium">
                  <div className="flex items-center gap-1.5">
                    <HiShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                    <span>{t.brandWarranty}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-[#064E3B]">
                    <HiCheckBadge className="h-4 w-4 text-[#D4AF37]" />
                    <span>{t.genuineProduct}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW TO PARTICIPATE ================= */}
      <section className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#064E3B]">
            {t.howItWorksHeading}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#022C22] mt-1">
            {t.howItWorksSubheading}
          </h2>
          <p className="text-xs sm:text-sm text-[#065F46] mt-1">
            {t.howItWorksDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="rounded-2xl border border-[#D4AF37]/30 bg-[#fafdfb] hover:bg-[#064E3B]/5 p-6 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-[#D4AF37] shadow-md shadow-[#064E3B]/30 border border-[#D4AF37]">
                    <Icon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#064E3B] px-3.5 py-1 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-xs">
                    0{st.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#022C22]">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#065F46] mt-1.5 leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/20 text-xs text-[#065F46] font-medium flex items-center gap-1.5">
                  <HiCheckCircle className="h-4 w-4 text-[#D4AF37]" />
                  <span>{t.automatedSystem}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="rounded-3xl bg-[#022C22] border border-[#D4AF37]/50 text-white p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none" />
        <div className="space-y-1.5 max-w-lg relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t.ctaTitle}
          </h2>
          <p className="text-white/80 text-sm font-sans">
            {t.ctaDesc}
          </p>
        </div>

        <Link
          href="/results"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#D4AF37] hover:bg-[#c49e2e] text-[#022C22] px-6 py-3.5 text-sm font-black transition-all shrink-0 shadow-lg shadow-[#D4AF37]/30 hover:scale-102 relative z-10 border border-[#D4AF37]"
        >
          <HiTrophy className="h-4.5 w-4.5 text-[#022C22]" />
          <span>{t.browseWinnersBtn}</span>
          <HiArrowRight className="h-4 w-4 text-[#022C22]" />
        </Link>
      </section>

    </div>
  );
}
