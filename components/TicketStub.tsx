"use client";

import React, { ReactNode } from "react";

interface TicketStubProps {
  serial?: string;
  stubBadge?: string | ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  orientation?: "horizontal" | "vertical";
  rotation?: "none" | "left" | "right" | "left-lg" | "right-lg";
  pinBadge?: boolean;
  pinColor?: string;
}

export default function TicketStub({
  serial,
  stubBadge,
  children,
  className = "",
  onClick,
  orientation = "horizontal",
}: TicketStubProps) {
  const isLive = serial === "LIVE";

  return (
    <div
      onClick={onClick}
      className={`luxury-card relative overflow-hidden transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div
        className={`flex ${
          orientation === "horizontal"
            ? "flex-col sm:flex-row"
            : "flex-col"
        }`}
      >
        {/* Left / Top Identifier Stub */}
        <div
          className={`flex items-center justify-between bg-[#3D0000]/40 dark:bg-[#000000]/70 p-4 border-[#950101]/30 dark:border-[#950101]/40 ${
            orientation === "horizontal"
              ? "sm:w-28 sm:border-r border-b sm:border-b-0 sm:flex-col sm:justify-center"
              : "border-b"
          }`}
        >
          {stubBadge ? (
            <div className="w-full flex items-center justify-center">{stubBadge}</div>
          ) : (
            <div className="flex w-full items-center justify-between sm:flex-col sm:space-y-2.5">
              <span className="text-[10px] font-black text-[#FF0000] uppercase tracking-wider font-mono">
                TICKET
              </span>
              
              {isLive ? (
                <div className="flex items-center gap-1.5 rounded-full bg-[#FF0000]/15 border border-[#FF0000]/40 px-2.5 py-1 text-[#FF0000] font-mono text-[11px] font-black sm:[writing-mode:vertical-rl] sm:rotate-180">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0000]"></span>
                  </span>
                  <span>LIVE</span>
                </div>
              ) : (
                <div className="font-mono text-xs font-bold text-[#140000] dark:text-[#ffffff] sm:[writing-mode:vertical-rl] sm:rotate-180">
                  {serial || "PASS"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-5 sm:p-6 text-[#140000] dark:text-[#ffffff] flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}
