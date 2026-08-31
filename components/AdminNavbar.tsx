"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { 
  HiOutlineLanguage,
  HiOutlineUserPlus
} from "react-icons/hi2";

export default function AdminNavbar() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-[#3D0000] bg-white/95 dark:bg-[#000000]/90 backdrop-blur-xl transition-all shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Brand Logo & Name */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000] text-white font-black text-sm tracking-wider shadow-lg shadow-[#FF0000]/30 border border-[#FF0000] group-hover:scale-105 transition-transform">
            IDK
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#140000] dark:text-[#ffffff] tracking-tight leading-tight group-hover:text-[#FF0000] dark:group-hover:text-[#FF0000] transition-colors">
              {siteConfig.shopName}
            </span>
            <span className="text-[11px] font-semibold text-[#950101] dark:text-[#ffffff]/70">
              Admin Portal (Data Entry)
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 border border-[#FF0000] text-xs font-bold">
            <HiOutlineUserPlus className="h-4 w-4" />
            <span>Add Contacts</span>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#950101]/30 bg-white dark:bg-[#3D0000]/50 hover:bg-slate-50 dark:hover:bg-[#3D0000] px-3 py-2 text-xs font-bold text-[#140000] dark:text-[#ffffff] transition-all shadow-xs"
          >
            <HiOutlineLanguage className="h-4 w-4 text-[#FF0000]" />
            <span>{language === "bn" ? "English" : "বাংলা"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
