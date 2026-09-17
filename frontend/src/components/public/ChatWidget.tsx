"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "Hello! I am your interactive AI assistant. Ask me anything about my technical background, projects, architecture decisions, or experience!",
    timestamp: "Online",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Focus management: focus input on open, focus trigger button on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else if (triggerButtonRef.current && document.activeElement !== triggerButtonRef.current) {
      // Return focus gracefully if user just closed the widget
    }
  }, [isOpen]);

  // Keyboard navigation: Escape key closes widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Global event listener and hash listener to allow other components (e.g. Hero CTAs) to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    const handleHash = () => {
      if (window.location.hash === "#chat") {
        setIsOpen(true);
      }
    };

    window.addEventListener("open-ai-chat", handleOpenChat);
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChat);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Phase 32: Local state only — simulate interactive preview
    // In Phase 33, this is wired directly to POST /api/v1/chat
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Thanks for asking about "${trimmed}"! Live Gemini AI agent integration will be activated in Phase 33. Feel free to explore my projects or contact me directly in the meantime!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 750);
  };

  return (
    <aside
      aria-label="Interactive AI Assistant"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans"
    >
      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with AI Assistant"
          className="mb-3 flex flex-col overflow-hidden rounded-2xl border border-[#337418] bg-[#202020] text-[#F8F8F8] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 w-[calc(100vw-2rem)] max-w-[380px] h-[520px] max-h-[calc(100vh-6rem)]"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#161616] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl border border-[#337418] bg-[#0F0F0F] text-[#5DD62C]">
                <Bot className="size-5" />
                <span
                  aria-label="Online status"
                  className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#5DD62C] ring-2 ring-[#161616] animate-pulse"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-[#F8F8F8]">AI Assistant</h2>
                  <Sparkles className="size-3 text-[#5DD62C]" />
                </div>
                <p className="text-[11px] text-[#9E9E9E]">Interactive Portfolio Guide</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerButtonRef.current?.focus();
              }}
              aria-label="Close chat window"
              className="rounded-lg p-1.5 text-[#9E9E9E] transition-colors hover:bg-[#202020] hover:text-[#F8F8F8] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
            >
              <X className="size-4" />
            </button>
          </header>

          {/* Scrollable Messages Area */}
          <div
            tabIndex={0}
            aria-label="Message history"
            className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]/30"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.sender === "ai" && (
                    <div
                      aria-hidden="true"
                      className="mb-1 flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#337418]/60 bg-[#0F0F0F] text-[#5DD62C]"
                    >
                      <Bot className="size-3.5" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "rounded-tr-xs bg-[#337418] text-[#F8F8F8]"
                        : "rounded-tl-xs border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>

                  {msg.sender === "user" && (
                    <div
                      aria-hidden="true"
                      className="mb-1 flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#337418] text-[#F8F8F8]"
                    >
                      <User className="size-3.5" />
                    </div>
                  )}
                </div>

                <span className="mt-1 text-[10px] text-[#737373] px-8">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Local Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#9E9E9E] px-2 py-1">
                <div className="flex size-6 items-center justify-center rounded-lg border border-[#337418]/60 bg-[#0F0F0F] text-[#5DD62C]">
                  <Bot className="size-3.5 animate-spin" />
                </div>
                <span className="animate-pulse">AI is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <footer className="border-t border-[#2A2A2A] bg-[#161616] p-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about my skills or work..."
                aria-label="Message for AI Assistant"
                className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-3.5 py-2 text-xs sm:text-sm text-[#F8F8F8] placeholder-[#737373] transition-colors outline-hidden focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="inline-flex size-9 items-center justify-center rounded-xl bg-[#5DD62C] text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_12px_rgba(93,214,44,0.3)] disabled:cursor-not-allowed disabled:opacity-40 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                <Send className="size-4" />
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="flex justify-end">
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? "Close AI Chat Assistant" : "Open AI Chat Assistant"}
          className="group relative flex size-14 items-center justify-center rounded-full bg-[#5DD62C] text-[#0F0F0F] shadow-[0_0_20px_rgba(93,214,44,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 outline-hidden focus-visible:ring-3 focus-visible:ring-[#5DD62C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F]"
        >
          {isOpen ? (
            <X className="size-6 transition-transform duration-200 rotate-0 group-hover:rotate-90" />
          ) : (
            <>
              <MessageSquare className="size-6 fill-[#0F0F0F]" />
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#5DD62C] text-[9px] font-bold text-[#5DD62C]"
              >
                AI
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
