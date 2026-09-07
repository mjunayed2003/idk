"use client";

import { useEffect, useState } from "react";
import { HiOutlinePlay } from "react-icons/hi2";

interface CasinoWheelProps {
  isSpinning: boolean;
  onSpinClick?: () => void;
  disabled?: boolean;
  buttonText?: string;
  winner?: { name: string; code: string } | null;
}

export default function CasinoWheel({
  isSpinning,
  onSpinClick,
  disabled,
  buttonText,
  winner,
}: CasinoWheelProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Add 8 full rotations (2880 deg) plus a random angle for high-energy visual randomness
      setRotation((prev) => prev + 2880 + Math.floor(Math.random() * 360));
    }
  }, [isSpinning]);

  return (
    <div className="flex flex-col items-center justify-center my-12 group perspective-1000">
      
      {/* Container specifically for the wheel and its absolutely positioned overlays */}
      <div className="relative flex items-center justify-center">
        
        {/* Outer Glow behind the wheel */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#064E3B]/35 blur-3xl transition-opacity duration-1000 ${isSpinning ? 'opacity-100 animate-pulse' : 'opacity-60 group-hover:opacity-100'}`}></div>

        {/* The pointer (triangle) */}
        <div className="absolute top-[-25px] z-20 animate-bounce">
          <div className="relative">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[#D4AF37] drop-shadow-[0_8px_8px_rgba(0,0,0,0.7)]"></div>
            {/* Inner highlight for pointer */}
            <div className="absolute top-[-38px] left-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[25px] border-t-[#FFF8DC]"></div>
          </div>
        </div>

        {/* The wheel container */}
        <div
          className="relative w-72 h-72 sm:w-[340px] sm:h-[340px] rounded-full border-[14px] border-[#022C22] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.9)] overflow-hidden transition-transform will-change-transform"
          style={{
            background: "conic-gradient(from 22.5deg, #064E3B 0deg 45deg, #022C22 45deg 90deg, #D4AF37 90deg 135deg, #022C22 135deg 180deg, #064E3B 180deg 225deg, #022C22 225deg 270deg, #D4AF37 270deg 315deg, #022C22 315deg 360deg)",
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "2.5s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.1, 0.9, 0.2, 1)",
          }}
        >
          {/* Luxury Golden Trim inner border */}
          <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/80 shadow-[inset_0_0_20px_rgba(212,175,55,0.4)]"></div>
          
          {/* Decorative inner circle details (Rivets/Lights) */}
          <div className="absolute inset-2 rounded-full border-4 border-[#D4AF37]/50 border-dashed opacity-80"></div>
          <div className="absolute inset-8 rounded-full border-[1px] border-white/20"></div>
          
          {/* Wheel segments separators (Golden lines) */}
          <div className="absolute inset-0">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute top-0 left-1/2 w-1 h-1/2 bg-gradient-to-b from-[#D4AF37]/90 to-transparent origin-bottom shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              ></div>
            ))}
          </div>

          {/* Center glowing reflection */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_60%)]"></div>
        </div>

        {/* The center spin button area (fixed, does not rotate) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center">
          {winner && !isSpinning ? (
            <div className="text-center bg-[#022C22]/90 rounded-xl px-4 py-2 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] min-w-[140px] z-40 relative">
              <span className="block text-[8px] sm:text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                Grand Winner
              </span>
              <span className="block text-[10px] sm:text-xs text-white font-mono font-bold truncate max-w-[120px]">
                {winner.name.split(" ")[0]}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-[#D4AF37] font-mono mt-0.5">
                {winner.code}
              </span>
            </div>
          ) : onSpinClick ? (
            <button
              type="button"
              onClick={onSpinClick}
              disabled={disabled || isSpinning}
              className={`pointer-events-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] border-2 border-[#FFE87C] transition-transform active:scale-95 z-40 relative ${
                disabled || isSpinning ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] cursor-pointer"
              }`}
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#022C22] border-2 border-[#D4AF37] flex items-center justify-center shadow-inner">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#064E3B] to-[#022C22] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"></div>
              </div>
            </button>
          ) : (
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] border-2 border-[#FFE87C] z-40 relative">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#022C22] border-2 border-[#D4AF37] flex items-center justify-center shadow-inner">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#064E3B] to-[#022C22] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"></div>
              </div>
            </div>
          )}

          {/* Text floating below the button */}
          {!winner && onSpinClick && (
            <span className={`absolute -bottom-8 whitespace-nowrap text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center drop-shadow-md ${isSpinning ? "text-[#D4AF37]" : "text-[#022C22]"}`}>
              {buttonText}
            </span>
          )}
        </div>

        {/* Winner Display Overlay on the wheel */}
        {!isSpinning && winner && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in spin-in-12 duration-700 pointer-events-none">
            <div className="bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#B8860B] p-[3px] rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.6)]">
              <div className="bg-[#022C22] px-6 py-3 rounded-[14px] flex flex-col items-center justify-center border border-black/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-0.5">
                  Grand Winner
                </span>
                <span className="text-xl sm:text-2xl font-black text-white whitespace-nowrap">
                  {winner.name}
                </span>
                <span className="text-xs font-mono font-bold text-[#D4AF37]/80 mt-0.5">
                  Ticket: {winner.code}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Base/Stand shadow for realistic 3D depth (outside the relative wheel container) */}
      <div className="w-64 sm:w-80 h-10 mt-6 bg-black/50 blur-2xl rounded-full"></div>
    </div>
  );
}
