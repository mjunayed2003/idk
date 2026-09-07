"use client";

import { useState, useEffect } from "react";
import { DrawWinner } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import WinnerTicket from "@/components/WinnerTicket";
import CasinoWheel from "@/components/CasinoWheel";

export default function LiveDrawPage() {
  const { language, t } = useLanguage();
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState<DrawWinner[]>([]);
  
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "idk_live_event" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          
          if (data.action === "SPIN") {
            setIsDrawing(true);
            
            // Wait 3 seconds for wheel animation to match admin side
            setTimeout(() => {
              setIsDrawing(false);
              setSelectedWinners(prev => {
                // Prevent duplicate inserts if event fires multiple times somehow
                if (prev.some(w => w.position === data.position)) return prev;
                
                const newWinners = [...prev, data.winner];
                return newWinners.sort((a, b) => a.position - b.position);
              });
            }, 3000);
          } else if (data.action === "RESET") {
            setSelectedWinners([]);
            setIsDrawing(false);
          }
        } catch (err) {
          console.error("Live event parse error", err);
        }
      }
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-12 sm:space-y-16 flex flex-col items-center">
      {/* Title */}
      <div className="text-center space-y-4 mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-[#064E3B]/15 to-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#064E3B] text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          {language === "bn" ? "লাইভ কাস্টমার ড্র" : "Live Customer Draw"}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl">
          <span className="text-[#022C22]">
            {language === "bn" ? "গ্র্যান্ড মেগা" : "GRAND MEGA"}{" "}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#D4AF37] filter drop-shadow-[0_2px_15px_rgba(6,78,59,0.3)]">
            {language === "bn" ? "লটারি ড্র" : "LOTTERY DRAW"}
          </span>
        </h1>
        <p className="text-[#065F46] font-medium text-lg sm:text-xl tracking-wide max-w-2xl mx-auto">
          {language === "bn" 
            ? "আপনার টিকিটের দিকে চোখ রাখুন, বিজয়ী হতে পারেন আপনিও!"
            : "Keep an eye on your ticket, you could be the next winner!"}
        </p>
      </div>

      <div className="w-full max-w-5xl luxury-card bg-white/90 backdrop-blur-md p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_4px_30px_rgba(6,78,59,0.08)] border border-[#D4AF37]/30 min-h-[600px]">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-[#064E3B]/10 blur-[120px] rounded-[100%] pointer-events-none"></div>
        
        {/* Wheel Display */}
        <div className="flex flex-col items-center justify-center relative z-10 scale-100 sm:scale-125 origin-top mb-32 mt-8">
          <CasinoWheel
            isSpinning={isDrawing}
            winner={selectedWinners.length > 0 && !isDrawing ? { name: selectedWinners[selectedWinners.length - 1].name, code: selectedWinners[selectedWinners.length - 1].code } : null}
          />
        </div>

        {/* Winner Reveal Area */}
        {selectedWinners.length > 0 && (
          <div className="mt-32 pt-12 border-t-2 border-dashed border-[#D4AF37]/40 space-y-8 animate-in fade-in slide-in-from-top-8 duration-500 relative z-10 text-center">
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#D4AF37] to-[#064E3B] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                {language === "bn" ? "বিজয়ী তালিকা" : "Official Winners"}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedWinners.map((winner) => (
                <WinnerTicket
                  key={winner.position}
                  winner={winner}
                />
              ))}
            </div>
            
          </div>
        )}
        
        {/* Waiting placeholder when no winners yet and not drawing */}
        {selectedWinners.length === 0 && !isDrawing && (
          <div className="mt-16 text-center animate-pulse">
            <p className="text-[#a1a1aa] font-medium tracking-widest uppercase">
              {language === "bn" ? "ড্র এর জন্য অপেক্ষা করা হচ্ছে..." : "Waiting for the draw to begin..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
