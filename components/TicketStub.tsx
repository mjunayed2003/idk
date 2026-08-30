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
  return (
    <div
      onClick={onClick}
      className={`retail-card relative overflow-hidden transition-all duration-200 ${
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
          className={`flex items-center justify-between bg-slate-50 p-4 border-slate-200 ${
            orientation === "horizontal"
              ? "sm:w-28 sm:border-r border-b sm:border-b-0 sm:flex-col sm:justify-center"
              : "border-b"
          }`}
        >
          {stubBadge ? (
            <div className="w-full flex items-center justify-center">{stubBadge}</div>
          ) : (
            <div className="flex w-full items-center justify-between sm:flex-col sm:space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                TICKET
              </span>
              <div className="font-mono text-xs font-bold text-slate-800 sm:[writing-mode:vertical-rl] sm:rotate-180">
                {serial || "PASS"}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-5 sm:p-6 text-slate-900 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}
