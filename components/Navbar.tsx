"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  HiOutlineTicket, 
  HiOutlineTrophy, 
  HiOutlineBars3, 
  HiOutlineXMark, 
  HiOutlineLanguage,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: t.navRaffleArena, icon: HiOutlineTicket },
    { href: "/results", label: t.navPastWinners, icon: HiOutlineTrophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-[#3D0000] bg-white/95 dark:bg-[#000000]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000] text-white font-black text-sm tracking-wider shadow-lg shadow-[#FF0000]/30 border border-[#FF0000] group-hover:scale-105 transition-transform">
            IDK
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#140000] dark:text-[#ffffff] tracking-tight leading-tight group-hover:text-[#FF0000] dark:group-hover:text-[#FF0000] transition-colors">
              {siteConfig.shopName}
            </span>
            <span className="text-[11px] font-semibold text-[#950101] dark:text-[#ffffff]/70">
              {language === "bn" ? "কাস্টমার লয়ালটি র‌্যাফেল" : "Customer Reward Raffle"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-[#3D0000]/60 border border-slate-200 dark:border-[#950101]/30" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 border border-[#FF0000]"
                      : "text-[#140000] dark:text-[#ffffff]/80 hover:text-[#FF0000] dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#FF0000]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Switcher */}
          <div className="ml-1 pl-2 border-l border-slate-200 dark:border-[#3D0000] flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#950101]/30 bg-white dark:bg-[#3D0000]/50 hover:bg-slate-50 dark:hover:bg-[#3D0000] px-3 py-2 text-xs font-bold text-[#140000] dark:text-[#ffffff] transition-all shadow-xs"
              title={theme === "dark" ? "Switch to White (Light) Theme" : "Switch to Dark Theme"}
            >
              {theme === "dark" ? (
                <>
                  <HiOutlineSun className="h-4 w-4 text-[#FF0000]" />
                  <span className="hidden lg:inline text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <HiOutlineMoon className="h-4 w-4 text-[#950101]" />
                  <span className="hidden lg:inline text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
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

        {/* Mobile Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-[#950101]/30 bg-white dark:bg-[#3D0000]/50 text-[#140000] dark:text-[#ffffff]"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <HiOutlineSun className="h-4 w-4 text-[#FF0000]" /> : <HiOutlineMoon className="h-4 w-4 text-[#950101]" />}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-[#950101]/30 bg-white dark:bg-[#3D0000]/50 px-2.5 py-1.5 text-xs font-bold text-[#140000] dark:text-[#ffffff]"
          >
            <HiOutlineLanguage className="h-4 w-4 text-[#FF0000]" />
            <span>{language === "bn" ? "EN" : "বাং"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-[#950101]/30 bg-white dark:bg-[#3D0000]/50 text-[#140000] dark:text-[#ffffff]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiOutlineBars3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 dark:border-[#3D0000] bg-white/95 dark:bg-[#000000]/95 backdrop-blur-2xl px-4 pt-2 pb-4 md:hidden">
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
                      ? "bg-[#FF0000] text-white border border-[#FF0000]"
                      : "text-[#140000] dark:text-[#ffffff]/80 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#FF0000]"}`} />
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
