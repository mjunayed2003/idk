"use client";

import React, { useState, useEffect, useRef } from "react";
import { getSocket, ChatMessageItem, ConversationItem } from "@/lib/socket";
import { useLanguage } from "@/context/LanguageContext";
import {
  HiMagnifyingGlass,
  HiOutlineUser,
  HiOutlinePhone,
  HiPaperAirplane,
  HiShieldExclamation,
  HiCheckCircle,
  HiOutlineNoSymbol,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineTicket,
  HiArrowPath,
} from "react-icons/hi2";

interface AdminChatManagerProps {
  adminRole: "ADMIN" | "SUPER_ADMIN";
  adminName?: string;
}

export default function AdminChatManager({
  adminRole = "ADMIN",
  adminName = "Support Team",
}: AdminChatManagerProps) {
  const { language } = useLanguage();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUpdatingBlock, setIsUpdatingBlock] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef(getSocket());

  // Fetch initial conversations list via REST & connect to socket
  const fetchConversations = async () => {
    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      const res = await fetch(`${socketUrl}/chat/conversations`);
      if (res.ok) {
        const data: ConversationItem[] = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();

    const socket = socketRef.current;

    const onConnect = () => {
      socket.emit("admin_join", { adminRole });
    };

    const onConversationsList = (list: ConversationItem[]) => {
      setConversations(list);
    };

    const onNewMessage = (newMsg: ChatMessageItem) => {
      // If message belongs to active customer, append
      setSelectedCustomerId((currentId) => {
        if (currentId === newMsg.customerId) {
          setActiveMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
        return currentId;
      });

      // Update conversation list preview
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === newMsg.customerId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: newMsg.text,
            lastMessageTime: newMsg.createdAt,
            lastSenderRole: newMsg.senderRole,
          };
          // Move to top
          const [item] = updated.splice(index, 1);
          return [item, ...updated];
        } else {
          // New conversation appeared, re-fetch
          fetchConversations();
          return prev;
        }
      });
    };

    const onConversationUpdated = (data: {
      customerId: string;
      lastMessage: string;
      lastSenderRole: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
      lastMessageTime: string;
    }) => {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === data.customerId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: data.lastMessage,
            lastMessageTime: data.lastMessageTime,
            lastSenderRole: data.lastSenderRole,
          };
          const [item] = updated.splice(index, 1);
          return [item, ...updated];
        }
        return prev;
      });
    };

    const onCustomerStatusUpdated = (data: { customerId: string; isBlocked: boolean }) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === data.customerId ? { ...c, isBlocked: data.isBlocked } : c))
      );
    };

    socket.on("connect", onConnect);
    socket.on("conversations_list", onConversationsList);
    socket.on("new_message", onNewMessage);
    socket.on("conversation_updated", onConversationUpdated);
    socket.on("customer_status_updated", onCustomerStatusUpdated);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("conversations_list", onConversationsList);
      socket.off("new_message", onNewMessage);
      socket.off("conversation_updated", onConversationUpdated);
      socket.off("customer_status_updated", onCustomerStatusUpdated);
    };
  }, [adminRole]);

  // Load messages when selecting a customer
  const handleSelectCustomer = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsLoadingMessages(true);

    const socket = socketRef.current;
    socket.emit("admin_join_customer_room", { customerId });

    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      const res = await fetch(`${socketUrl}/chat/history/${customerId}`);
      if (res.ok) {
        const history: ChatMessageItem[] = await res.json();
        setActiveMessages(history);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Send reply as Admin
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCustomerId) return;

    const socket = socketRef.current;
    socket.emit("send_message", {
      customerId: selectedCustomerId,
      senderRole: adminRole,
      senderName: adminName || (adminRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"),
      text: replyText.trim(),
    });

    setReplyText("");
  };

  // Toggle Block Customer
  const handleToggleBlock = async () => {
    if (!selectedCustomerId) return;
    const currentCustomer = conversations.find((c) => c.id === selectedCustomerId);
    if (!currentCustomer) return;

    const targetBlockedStatus = !currentCustomer.isBlocked;
    setIsUpdatingBlock(true);

    try {
      const socket = socketRef.current;
      socket.emit("block_customer", {
        customerId: selectedCustomerId,
        isBlocked: targetBlockedStatus,
        adminName,
      });

      // Also invoke REST fallback for persistence guarantee
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      await fetch(`${socketUrl}/chat/block/${selectedCustomerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: targetBlockedStatus }),
      });

      // Update local state
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedCustomerId ? { ...c, isBlocked: targetBlockedStatus } : c
        )
      );
    } catch (err) {
      console.error("Failed to update block state:", err);
    } finally {
      setIsUpdatingBlock(false);
    }
  };

  const selectedCustomer = conversations.find((c) => c.id === selectedCustomerId);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.code && c.code.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-[720px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
      <div className="flex w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 bg-slate-50/70">
        {/* Header & Search */}
        <div className="border-b border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#064E3B] text-[#D4AF37] shadow-sm">
                <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {language === "bn" ? "কাস্টমার লাইভ চ্যাট" : "Live Customer Chats"}
              </h2>
            </div>
            <button
              type="button"
              onClick={fetchConversations}
              title="Refresh conversations"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              <HiArrowPath className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === "bn" ? "নাম বা ফোন দিয়ে খুঁজুন..." : "Search customer or phone..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
              <HiOutlineUser className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-xs font-semibold">
                {language === "bn" ? "কোনো চ্যাট পাওয়া যায়নি" : "No conversations found"}
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.id === selectedCustomerId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCustomer(c.id)}
                  className={`w-full text-left p-3.5 transition flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-white border-l-4 border-l-[#064E3B] shadow-xs"
                      : "hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 truncate">
                      <span>{c.name}</span>
                      {c.isBlocked && (
                        <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-700">
                          {language === "bn" ? "ব্লকড" : "Blocked"}
                        </span>
                      )}
                    </div>
                    {c.lastMessageTime && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(c.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-slate-500 text-[10px]">{c.phone}</span>
                    {c.code && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[9px] text-slate-600">
                        {c.code}
                      </span>
                    )}
                  </div>

                  {c.lastMessage && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                      {c.lastSenderRole === "CUSTOMER" ? "" : "You: "}
                      {c.lastMessage}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: ACTIVE CHAT CONSOLE ================= */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {selectedCustomer ? (
          <>
            {/* Active Customer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#064E3B]/10 text-[#064E3B] font-black text-sm">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{selectedCustomer.name}</h3>
                    {selectedCustomer.isBlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-700 border border-rose-200">
                        <HiOutlineNoSymbol className="h-3 w-3" />
                        {language === "bn" ? "ব্লকড কাস্টমার" : "Blocked"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 border border-emerald-200">
                        <HiCheckCircle className="h-3 w-3" />
                        {language === "bn" ? "সক্রিয়" : "Active"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <HiOutlinePhone className="h-3 w-3 text-slate-400" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.code && (
                      <span className="flex items-center gap-1">
                        <HiOutlineTicket className="h-3 w-3 text-[#D4AF37]" />
                        {selectedCustomer.code}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* BLOCK / UNBLOCK ACTION BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleToggleBlock}
                  disabled={isUpdatingBlock}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition shadow-sm ${
                    selectedCustomer.isBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200"
                  }`}
                >
                  {selectedCustomer.isBlocked ? (
                    <>
                      <HiCheckCircle className="h-4 w-4" />
                      <span>{language === "bn" ? "কাস্টমার আনব্লক করুন" : "Unblock Customer"}</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineNoSymbol className="h-4 w-4" />
                      <span>{language === "bn" ? "কাস্টমার ব্লক করুন" : "Block Customer"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Block Warning Notice in Admin */}
            {selectedCustomer.isBlocked && (
              <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <HiShieldExclamation className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  {language === "bn"
                    ? "এই কাস্টমারকে ব্লক করা হয়েছে। তিনি নতুন মেসেজ পাঠাতে পারবেন না।"
                    : "This customer is currently blocked from sending messages."}
                </span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-slate-50/50">
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  {language === "bn" ? "মেসেজ লোড হচ্ছে..." : "Loading messages..."}
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <HiOutlineChatBubbleLeftRight className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">
                    {language === "bn" ? "কোনো মেসেজ নেই" : "No messages yet"}
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isFromCustomer = msg.senderRole === "CUSTOMER";
                  const isSuper = msg.senderRole === "SUPER_ADMIN";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isFromCustomer ? "items-start" : "items-end"}`}
                    >
                      {/* Sender Tag */}
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                            isFromCustomer
                              ? "bg-slate-200 text-slate-700"
                              : isSuper
                              ? "bg-amber-600 text-white"
                              : "bg-[#064E3B] text-[#D4AF37]"
                          }`}
                        >
                          {isFromCustomer
                            ? msg.senderName || "Customer"
                            : isSuper
                            ? "Super Admin"
                            : "Admin"}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isFromCustomer
                            ? "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                            : "bg-gradient-to-r from-[#022C22] to-[#064E3B] text-white border border-[#D4AF37]/30 rounded-tr-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="border-t border-slate-200 bg-white p-4">
              <form onSubmit={handleSendReply} className="flex items-center gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? `${selectedCustomer.name}-কে উত্তর লিখুন...`
                      : `Reply to ${selectedCustomer.name}...`
                  }
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#022C22] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#D4AF37] shadow-md shadow-[#064E3B]/25 transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 border border-[#D4AF37]/40"
                >
                  <span>{language === "bn" ? "পাঠান" : "Send"}</span>
                  <HiPaperAirplane className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty selection state */
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <HiOutlineChatBubbleLeftRight className="h-8 w-8 text-[#064E3B]" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">
              {language === "bn" ? "কথোপকথন নির্বাচন করুন" : "Select a Customer Conversation"}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              {language === "bn"
                ? "বামের তালিকা থেকে যেকোনো কাস্টমার সিলেক্ট করে লাইভ চ্যাট করুন অথবা ব্লক পরিচালনা করুন।"
                : "Choose a customer from the left list to view their message history, reply in real-time, or manage their block status."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
