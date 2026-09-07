"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { 
  HiOutlineTicket, 
  HiOutlineTrophy, 
  HiOutlineBars3, 
  HiOutlineXMark, 
  HiOutlineLanguage,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlinePlay,
} from "react-icons/hi2";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.navRaffleArena, icon: HiOutlineTicket },
    { href: "/results", label: t.navPastWinners, icon: HiOutlineTrophy },
    { href: "/live", label: language === "bn" ? "লাইভ ড্র" : "Live Draw", icon: HiOutlinePlay },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#064E3B] text-[#D4AF37] font-black text-sm tracking-wider shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] group-hover:scale-105 transition-transform">
            IDK
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#022C22] tracking-tight leading-tight group-hover:text-[#064E3B] transition-colors">
              {siteConfig.shopName}
            </span>
            <span className="text-[11px] font-semibold text-[#065F46]">
              {language === "bn" ? "কাস্টমার লয়ালটি র‌্যাফেল" : "Customer Reward Raffle"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/30 border border-[#D4AF37]"
                      : "text-[#022C22] hover:text-[#064E3B] hover:bg-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#D4AF37]" : "text-[#064E3B]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className="ml-1 pl-2 border-l border-slate-200 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/40 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-[#022C22] transition-all shadow-xs"
            >
              <HiOutlineLanguage className="h-4 w-4 text-[#D4AF37]" />
              <span>{language === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#022C22]"
          >
            <HiOutlineLanguage className="h-4 w-4 text-[#D4AF37]" />
            <span>{language === "bn" ? "EN" : "বাং"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#022C22]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiOutlineBars3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#064E3B] text-white border border-[#D4AF37]"
                      : "text-[#022C22] hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#D4AF37]" : "text-[#064E3B]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
