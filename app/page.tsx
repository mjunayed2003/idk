"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { getNextDrawDate, getActiveCustomers } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import CountdownCard from "@/components/CountdownCard";
import Link from "next/link";
import {
  HiShoppingBag,
  HiChatBubbleLeftRight,
  HiTrophy,
  HiSparkles,
  HiArrowRight,
  HiShieldCheck,
  HiGift,
  HiCheckBadge,
  HiDevicePhoneMobile,
  HiTv,
} from "react-icons/hi2";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [nextDrawDate, setNextDrawDate] = useState<string>(new Date().toISOString());
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const date = await getNextDrawDate();
      const active = await getActiveCustomers();
      setNextDrawDate(date);
      setActiveCount(active.length);
    };
    load();
  }, []);

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
      title: t.firstPrizeTitle,
      highlight: t.firstPrizeHighlight,
      badgeBg: "bg-amber-500 text-white",
      tag: language === "bn" ? "১ম পুরস্কার" : "1st Prize",
      icon: HiTv,
      color: "text-amber-600",
    },
    {
      place: t.secondPrizeBadge,
      title: t.secondPrizeTitle,
      highlight: t.secondPrizeHighlight,
      badgeBg: "bg-blue-600 text-white",
      tag: language === "bn" ? "২য় পুরস্কার" : "2nd Prize",
      icon: HiGift,
      color: "text-blue-600",
    },
    {
      place: t.thirdPrizeBadge,
      title: t.thirdPrizeTitle,
      highlight: t.thirdPrizeHighlight,
      badgeBg: "bg-emerald-600 text-white",
      tag: language === "bn" ? "৩য় পুরস্কার" : "3rd Prize",
      icon: HiDevicePhoneMobile,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-12 sm:space-y-16">
      
      {/* ================= HERO SECTION (2-COLUMN RETAIL BANNER) ================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Retail Campaign Info */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-semibold text-blue-700">
              <HiSparkles className="h-4 w-4 text-blue-600" />
              <span>{t.rewardSchemeBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              {language === "bn" ? (
                <>
                  <span className="text-blue-600">{siteConfig.shopName}</span> মেগা র‌্যাফেল ড্র ও পুরস্কার অফার!
                </>
              ) : (
                <>
                  Shop at <span className="text-blue-600">{siteConfig.shopName}</span> & Win Grand Electronics!
                </>
              )}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {language === "bn" 
                ? "আমাদের যেকোনো পণ্য কেনাকাটা করলেই স্বয়ংক্রিয়ভাবে একটি অফিসিয়াল ডিজিটাল র‌্যাফেল কোড আপনার মোবাইলে এসএমএস আকারে চলে যাবে। লাইভ ড্র-তে জিতে নিন ৫৫\" স্মার্ট ৪কে টিভি সহ দারুণ সব পুরস্কার!"
                : "Every purchase at IDK automatically enrolls you with an official digital raffle code sent via SMS. Participate in our live scheduled draw to win premium 55\" Smart TVs and home appliances!"}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-sm font-semibold transition-colors shadow-xs"
              >
                <HiTrophy className="h-4 w-4 text-amber-300" />
                <span>{t.browseWinnersBtn}</span>
                <HiArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 text-sm font-semibold transition-colors"
              >
                <span>{t.staffLoginBtn}</span>
              </Link>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <HiCheckBadge className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{t.fairDraw}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <HiChatBubbleLeftRight className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{language === "bn" ? "তাৎক্ষণিক এসএমএস কোড" : "Instant SMS Code"}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <HiShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>{t.genuineProduct}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Countdown Box */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
              <CountdownCard targetDate={nextDrawDate} />
            </div>
          </div>

        </div>
      </section>

      {/* ================= GRAND PRIZES SHOWCASE ================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {t.prizesHeading}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
              {t.prizesSubheading}
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {t.activePool}: <strong className="text-blue-600">{toBnNum(activeCount)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {prizes.map((prize, idx) => {
            const Icon = prize.icon;
            return (
              <div
                key={idx}
                className="retail-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${prize.badgeBg}`}>
                      {prize.tag}
                    </span>
                    <Icon className={`h-6 w-6 ${prize.color}`} />
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-medium text-slate-400">
                      {prize.highlight}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                      {prize.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{t.brandWarranty}</span>
                  <span className="text-emerald-600 font-semibold">{t.genuineProduct}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW TO PARTICIPATE ================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {t.howItWorksHeading}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t.howItWorksSubheading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.howItWorksDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-5 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold font-mono">
                    {st.step}
                  </span>
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-400 font-medium">
                  ✓ {t.automatedSystem}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="rounded-2xl bg-blue-600 text-white p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1 max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t.ctaTitle}
          </h2>
          <p className="text-blue-100 text-sm">
            {t.ctaDesc}
          </p>
        </div>

        <Link
          href="/results"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 text-sm font-bold transition-colors shrink-0 shadow-xs"
        >
          <HiTrophy className="h-4 w-4 text-amber-500" />
          <span>{t.browseWinnersBtn}</span>
          <HiArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </div>
  );
}
