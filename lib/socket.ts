import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    socket = io(socketUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export interface ChatMessageItem {
  id: string;
  senderRole: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  senderName: string;
  customerId: string;
  text: string;
  createdAt: string;
}

export interface CustomerChatSession {
  id: string;
  name: string;
  phone: string;
  code?: string;
  isBlocked: boolean;
}

export interface ConversationItem {
  id: string;
  name: string;
  phone: string;
  code: string;
  status: string;
  isBlocked: boolean;
  createdAt: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  lastSenderRole: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" | null;
}
