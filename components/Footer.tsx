"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { HiOutlineTicket, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/90 dark:border-[#3D0000] bg-white/90 dark:bg-[#000000]/90 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000] text-white font-bold shadow-lg shadow-[#FF0000]/30 border border-[#FF0000]">
            <HiOutlineTicket className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-wider text-[#140000] dark:text-[#ffffff] uppercase">
              {siteConfig.shopName}
            </span>
            <p className="text-xs text-[#950101] dark:text-[#ffffff]/70 font-sans mt-0.5">
              {t.footerTagline}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#950101] dark:text-[#ffffff]/70">
          <div className="flex items-center gap-1.5 font-medium">
            <HiOutlineShieldCheck className="h-4.5 w-4.5 text-[#FF0000]" />
            <span>{t.footerFair}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <HiOutlineSparkles className="h-4.5 w-4.5 text-[#FF0000]" />
            <span>{t.footerResults}</span>
          </div>
          <Link
            href="/admin"
            className="text-[#FF0000] hover:text-[#d60000] transition-colors font-semibold underline underline-offset-4"
          >
            {t.footerAdmin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
