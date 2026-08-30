"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { HiTicket, HiShieldCheck, HiSparkles } from "react-icons/hi2";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-10 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/20">
            <HiTicket className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl tracking-wider text-slate-900 uppercase">
              {siteConfig.shopName}
            </span>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {t.footerTagline}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <HiShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{t.footerFair}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <HiSparkles className="h-4 w-4 text-amber-500" />
            <span>{t.footerResults}</span>
          </div>
          <Link
            href="/admin"
            className="text-slate-700 hover:text-indigo-600 transition-colors font-semibold underline underline-offset-4"
          >
            {t.footerAdmin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
