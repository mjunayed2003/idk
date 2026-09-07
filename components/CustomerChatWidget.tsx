"use client";

import React, { useState, useEffect, useRef } from "react";
import { getSocket, ChatMessageItem, CustomerChatSession } from "@/lib/socket";
import { useLanguage } from "@/context/LanguageContext";
import {
  HiChatBubbleLeftRight,
  HiXMark,
  HiPaperAirplane,
  HiOutlineUser,
  HiOutlinePhone,
  HiShieldExclamation,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiArrowPath,
} from "react-icons/hi2";

export default function CustomerChatWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<CustomerChatSession | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("idk_customer_chat_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSession(parsed);
          setIsBlocked(parsed.isBlocked || false);
        } catch {
          localStorage.removeItem("idk_customer_chat_session");
        }
      }
    }
  }, []);

  // Socket connection & event listeners
  useEffect(() => {
    if (!session) return;

    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join_chat", { customerId: session.id });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onChatInit = (data: { customer: CustomerChatSession; messages: ChatMessageItem[] }) => {
      if (data.customer) {
        setIsBlocked(data.customer.isBlocked);
        setSession((prev) => (prev ? { ...prev, ...data.customer } : data.customer));
      }
      if (data.messages) {
        setMessages(data.messages);
      }
    };

    const onNewMessage = (newMsg: ChatMessageItem) => {
      setMessages((prev) => {
        // avoid duplicate if any
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      if (!isOpen && newMsg.senderRole !== "CUSTOMER") {
        setUnreadCount((c) => c + 1);
      }
    };

    const onBlockedStatus = (data: { customerId: string; isBlocked: boolean }) => {
      if (data.customerId === session.id) {
        setIsBlocked(data.isBlocked);
        setSession((prev) => (prev ? { ...prev, isBlocked: data.isBlocked } : prev));
        // Update local storage
        if (typeof window !== "undefined") {
          const current = localStorage.getItem("idk_customer_chat_session");
          if (current) {
            const parsed = JSON.parse(current);
            parsed.isBlocked = data.isBlocked;
            localStorage.setItem("idk_customer_chat_session", JSON.stringify(parsed));
          }
        }
      }
    };

    const onErrorBlocked = (data: { message: string }) => {
      setIsBlocked(true);
      alert(data.message || "You are blocked from sending messages.");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat_init", onChatInit);
    socket.on("new_message", onNewMessage);
    socket.on("customer_blocked_status", onBlockedStatus);
    socket.on("error_blocked", onErrorBlocked);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat_init", onChatInit);
      socket.off("new_message", onNewMessage);
      socket.off("customer_blocked_status", onBlockedStatus);
      socket.off("error_blocked", onErrorBlocked);
    };
  }, [session, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle customer login/identify
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      setAuthError(language === "bn" ? "নাম এবং মোবাইল নম্বর দিন" : "Please enter your name and phone number");
      return;
    }

    setIsSubmittingAuth(true);
    setAuthError("");

    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      const res = await fetch(`${socketUrl}/chat/customer-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim(), phone: phoneInput.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to start chat session");
      }

      const customerData: CustomerChatSession = await res.json();
      setSession(customerData);
      setIsBlocked(customerData.isBlocked || false);

      if (typeof window !== "undefined") {
        localStorage.setItem("idk_customer_chat_session", JSON.stringify(customerData));
      }
    } catch (err: any) {
      setAuthError(err.message || "Error connecting to chat server");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle sending message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session || isBlocked) return;

    const socket = getSocket();
    const payload = {
      customerId: session.id,
      senderRole: "CUSTOMER" as const,
      senderName: session.name,
      text: inputText.trim(),
    };

    socket.emit("send_message", payload);
    setInputText("");
  };

  // Switch session / Reset
  const handleResetSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("idk_customer_chat_session");
    }
    setSession(null);
    setMessages([]);
    setIsBlocked(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#950101] via-[#FF0000] to-[#FF4D4D] text-white shadow-2xl shadow-[#FF0000]/40 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open Chat"
        >
          <HiChatBubbleLeftRight className="h-7 w-7 transition-transform group-hover:scale-110" />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-black text-white ring-2 ring-white animate-bounce">
              {unreadCount}
            </span>
          )}

          {/* Online ripple */}
          <span className="absolute -top-0.5 -left-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Chat Box Container */}
      {isOpen && (
        <div className="flex h-[540px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#140000] via-[#3D0000] to-[#950101] px-5 py-3.5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF0000] text-white font-black text-sm shadow-md">
                <HiOutlineSparkles className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#140000]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight leading-tight">
                  {language === "bn" ? "আইডিকে হেল্প ডেস্ক" : "IDK Support Chat"}
                </span>
                <span className="text-[10px] text-red-200/90 font-medium flex items-center gap-1">
                  <span>{language === "bn" ? "অ্যাডমিন ও সুপার অ্যাডমিন লাইভ" : "Admin & Super Admin Online"}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {session && (
                <button
                  type="button"
                  onClick={handleResetSession}
                  title={language === "bn" ? "সেশন রিসেট করুন" : "Change User"}
                  className="rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                  <HiArrowPath className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!session ? (
            /* Identification Screen */
            <div className="flex flex-1 flex-col justify-center p-6 bg-slate-50/50">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000]/10 text-[#FF0000]">
                  <HiChatBubbleLeftRight className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[#140000]">
                  {language === "bn" ? "লাইভ সাপোর্টে স্বাগতম" : "Start Live Chat"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {language === "bn"
                    ? "আমাদের অ্যাডমিনদের সাথে কথা বলতে আপনার নাম এবং ফোন নম্বর দিন।"
                    : "Connect directly with our Admin and Super Admin team."}
                </p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {language === "bn" ? "আপনার নাম" : "Your Name"}
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={language === "bn" ? "যেমন: তানভীর আহমেদ" : "e.g. John Doe"}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#FF0000] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}
                  </label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#FF0000] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                {authError && (
                  <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full rounded-xl bg-gradient-to-r from-[#950101] to-[#FF0000] py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#FF0000]/25 transition hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmittingAuth
                    ? language === "bn"
                      ? "কানেক্ট হচ্ছে..."
                      : "Connecting..."
                    : language === "bn"
                    ? "চ্যাট শুরু করুন"
                    : "Start Chatting"}
                </button>
              </form>
            </div>
          ) : (
            /* Active Chat Messages Screen */
            <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
              {/* Blocked Warning Banner */}
              {isBlocked && (
                <div className="flex items-center gap-2.5 border-b border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800 animate-pulse">
                  <HiShieldExclamation className="h-5 w-5 shrink-0 text-rose-600" />
                  <span>
                    {language === "bn"
                      ? "অ্যাডমিন আপনাকে ব্লক করেছে। আপনি নতুন মেসেজ পাঠাতে পারবেন না।"
                      : "You have been blocked by the admin. You cannot send messages."}
                  </span>
                </div>
              )}

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                    <HiChatBubbleLeftRight className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-medium">
                      {language === "bn"
                        ? "কথোপকথন শুরু করতে একটি বার্তা পাঠান।"
                        : "Send a message to start conversation with our admin."}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderRole === "CUSTOMER";
                    const isSuperAdmin = msg.senderRole === "SUPER_ADMIN";

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        {/* Sender Label */}
                        {!isMe && (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold">
                            <span
                              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white ${
                                isSuperAdmin ? "bg-amber-600" : "bg-[#FF0000]"
                              }`}
                            >
                              <HiOutlineShieldCheck className="h-3 w-3" />
                              {isSuperAdmin ? "Super Admin" : "Admin Support"}
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-gradient-to-r from-[#950101] to-[#FF0000] text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>

                        {/* Time for user */}
                        {isMe && (
                          <span className="mt-0.5 text-[9px] text-slate-400 font-mono">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-slate-200 bg-white p-3">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    disabled={isBlocked}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isBlocked
                        ? language === "bn"
                          ? "আপনি ব্লক থাকায় মেসেজ পাঠাতে পারছেন না"
                          : "Chatting is blocked by admin"
                        : language === "bn"
                        ? "আপনার মেসেজ লিখুন..."
                        : "Type your message..."
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#FF0000] focus:bg-white focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />

                  <button
                    type="submit"
                    disabled={isBlocked || !inputText.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/25 transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <HiPaperAirplane className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
