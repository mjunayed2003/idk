"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/context/LanguageContext";
import { 
  HiOutlineLanguage,
  HiOutlineWrenchScrewdriver,
  HiOutlinePlay
} from "react-icons/hi2";

export default function SuperAdminNavbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-xl transition-all shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#064E3B] text-[#D4AF37] font-black text-sm tracking-wider shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] group-hover:scale-105 transition-transform">
            IDK
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#022C22] tracking-tight leading-tight group-hover:text-[#064E3B] transition-colors">
              {siteConfig.shopName}
            </span>
            <span className="text-[11px] font-semibold text-[#065F46]">
              Super Admin Console
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              href="/super-admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/super-admin" 
                  ? "bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/30 border border-[#D4AF37]" 
                  : "bg-slate-100/90 text-[#022C22] border border-slate-200 hover:text-[#064E3B] hover:bg-white"
              }`}
            >
              <HiOutlineWrenchScrewdriver className={`h-4 w-4 ${pathname === "/super-admin" ? "text-[#D4AF37]" : "text-[#064E3B]"}`} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/super-admin/draw"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/super-admin/draw" 
                  ? "bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/30 border border-[#D4AF37]" 
                  : "bg-slate-100/90 text-[#022C22] border border-slate-200 hover:text-[#064E3B] hover:bg-white"
              }`}
            >
              <HiOutlinePlay className={`h-4 w-4 ${pathname === "/super-admin/draw" ? "text-[#D4AF37]" : "text-[#064E3B]"}`} />
              <span>Live Draw</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/40 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-[#022C22] transition-all shadow-xs"
          >
            <HiOutlineLanguage className="h-4 w-4 text-[#D4AF37]" />
            <span>{language === "bn" ? "English" : "বাংলা"}</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("idk_super_admin_auth");
                window.location.reload();
              }
            }}
            className="text-xs text-[#064E3B] hover:text-[#D4AF37] border border-[#D4AF37]/40 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl transition font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
