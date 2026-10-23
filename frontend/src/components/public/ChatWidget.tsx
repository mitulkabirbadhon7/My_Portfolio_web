"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Send,
  Terminal,
  User,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { ApiResponse } from "@/types";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface BackendHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTION_PILLS = [
  "query --stack (Tech stack & system architecture)",
  "query --projects (Production systems & case studies)",
  "query --contact (Engineering roles & inquiries)",
];

const INITIAL_WELCOME_TEXT =
  "Interactive Engineering Console initialized. Query technical stack, backend architectures, system design decisions, or project case studies.";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: INITIAL_WELCOME_TEXT,
    timestamp: "READY",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  }, [messages, isOpen, isLoading, scrollToBottom]);

  // Focus management: focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
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

    if (window.location.hash === "#chat") {
      setIsOpen(true);
    }

    window.addEventListener("open-ai-chat", handleOpenChat);
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChat);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const idCounterRef = useRef(0);

  const sendMessageToBackend = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      idCounterRef.current += 1;
      const userMsg: ChatMessage = {
        id: `user-${idCounterRef.current}`,
        sender: "user",
        text: trimmed,
        timestamp: "Sent",
      };

      // Format previous conversation history for backend validation contract:
      // array of { role: 'user' | 'assistant', content: string }
      const formattedHistory: BackendHistoryItem[] = messages
        .filter((m) => !m.isError && m.id !== "welcome-1")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);

      try {
        // POST to backend chat endpoint via shared API client (uses NEXT_PUBLIC_API_URL /api/v1)
        const res = await api.post<ApiResponse<{ reply: string }>>("/ai/chat", {
          message: trimmed,
          history: formattedHistory,
        });

        if (res?.data?.reply) {
          idCounterRef.current += 1;
          const aiResponse: ChatMessage = {
            id: `ai-${idCounterRef.current}`,
            sender: "ai",
            text: res.data.reply,
            timestamp: "Replied",
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          throw new Error("No response payload received from console service");
        }
      } catch (err: unknown) {
        let friendlyError =
          "The interactive console is temporarily offline. Please try again or reach out directly via the Contact page.";

        if (err instanceof ApiError) {
          if (err.status === 400) {
            friendlyError =
              typeof err.data === "object" && err.data !== null && "message" in err.data
                ? String((err.data as { message: unknown }).message)
                : "Please enter a valid message (maximum 1000 characters).";
          } else if (err.status === 401) {
            friendlyError = "Unauthorized request. Please refresh the page.";
          } else if (err.status === 429) {
            friendlyError =
              "Rate limit reached. You have sent too many queries recently. Please wait a moment before trying again.";
          } else if (err.status >= 500) {
            friendlyError =
              "Console service is experiencing high load. Please try again in a few moments.";
          }
        } else if (err instanceof Error && err.message) {
          friendlyError = err.message;
        }

        idCounterRef.current += 1;
        const errorMsg: ChatMessage = {
          id: `err-${idCounterRef.current}`,
          sender: "ai",
          isError: true,
          text: friendlyError,
          timestamp: "Notice",
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToBackend(inputValue);
  };

  const handlePillClick = (pillQuery: string) => {
    sendMessageToBackend(pillQuery);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputValue("");
  };

  return (
    <aside
      aria-label="Interactive Console"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans"
    >
      {/* Floating Chat Window (Engineered Terminal Console) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Interactive Engineering Console"
          className="mb-3 flex flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[calc(100vh-6rem)]"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#141414] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-8 items-center justify-center rounded-md border border-[#337418] bg-[#0F0F0F] text-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.25)]">
                <Terminal className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F8F8F8]">CLI Console</h2>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#202020] text-[#5DD62C] border border-[#2A2A2A]">
                    v2.4
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#9E9E9E]">Interactive Knowledge Base</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                aria-label="Reset console buffer"
                title="Reset buffer"
                className="rounded p-1.5 text-[#9E9E9E] transition-colors hover:bg-[#202020] hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerButtonRef.current?.focus();
                }}
                aria-label="Close console window"
                className="rounded p-1.5 text-[#9E9E9E] transition-colors hover:bg-[#202020] hover:text-[#EF4444] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          {/* Scrollable Messages Area */}
          <div
            tabIndex={0}
            aria-label="Message history"
            aria-live="polite"
            className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]/30 bg-[#0F0F0F]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end gap-2 max-w-[90%]">
                  {msg.sender === "ai" && (
                    <div
                      aria-hidden="true"
                      className={`mb-1 flex size-6 shrink-0 items-center justify-center rounded-md border ${
                        msg.isError
                          ? "border-red-500/40 bg-red-950/30 text-red-400"
                          : "border-[#337418] bg-[#141414] text-[#5DD62C]"
                      }`}
                    >
                      {msg.isError ? (
                        <AlertTriangle className="size-3.5" />
                      ) : (
                        <Terminal className="size-3.5" />
                      )}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-[#202020] text-[#F8F8F8] border border-[#337418]/60"
                        : msg.isError
                        ? "rounded-tl-none border border-red-500/40 bg-red-950/20 text-red-300"
                        : "rounded-tl-none border border-[#2A2A2A] bg-[#141414] text-[#E0E0E0]"
                    }`}
                  >
                    {msg.sender === "ai" ? (
                      <div className="prose prose-xs max-w-none text-[#E0E0E0] prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-a:text-[#5DD62C] prose-a:underline hover:prose-a:text-[#5DD62C]/80 prose-strong:text-[#F8F8F8]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#5DD62C] underline hover:text-[#5DD62C]/80"
                              />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div
                      aria-hidden="true"
                      className="mb-1 flex size-6 shrink-0 items-center justify-center rounded-md border border-[#2A2A2A] bg-[#141414] text-[#9E9E9E]"
                    >
                      <User className="size-3.5" />
                    </div>
                  )}
                </div>

                <span className="mt-1 text-[9px] font-mono text-[#9E9E9E]/70 px-8">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#9E9E9E] px-2 py-1 font-mono">
                <div className="flex size-6 items-center justify-center rounded-md border border-[#337418] bg-[#0F0F0F] text-[#5DD62C]">
                  <Terminal className="size-3.5" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-1.5">
                  <span className="text-[11px] text-[#5DD62C] animate-pulse">&gt; EXECUTING QUERY...</span>
                </div>
              </div>
            )}

            {/* Suggestion Pills (Shown when conversation is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="mt-3 pt-2">
                <p className="mb-2 text-[10px] font-mono text-[#9E9E9E] uppercase tracking-wider">
                  Preset CLI queries:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTION_PILLS.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className="inline-flex items-center justify-start gap-2 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 py-1.5 text-left text-xs font-mono text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:bg-[#1A1A1A] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                    >
                      <span className="text-[#5DD62C]">$</span>
                      <span>{pill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <footer className="border-t border-[#2A2A2A] bg-[#141414] p-3">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3 text-xs font-mono text-[#5DD62C] select-none">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={1000}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask architecture, stack, or projects..."
                  aria-label="Message for Interactive Console"
                  disabled={isLoading}
                  className="w-full rounded-md border border-[#2A2A2A] bg-[#0F0F0F] pl-7 pr-3 py-2 text-xs font-mono text-[#F8F8F8] placeholder-[#9E9E9E]/50 transition-colors outline-hidden focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="inline-flex size-9 items-center justify-center rounded-md bg-[#5DD62C] text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_12px_rgba(93,214,44,0.3)] disabled:cursor-not-allowed disabled:opacity-30 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                <Send className="size-4" />
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* Floating Trigger Button (Clean Terminal Console Trigger) */}
      <div className="flex justify-end">
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? "Close Interactive Console" : "Open Interactive Console"}
          className="group relative flex size-12 items-center justify-center rounded-full bg-[#111110] text-[#F8F8F8] border border-[#2A2A2A] shadow-md transition-all duration-200 hover:border-[#5DD62C] hover:text-[#5DD62C] hover:scale-105 active:scale-95 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
        >
          {isOpen ? (
            <X className="size-5 transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <Terminal className="size-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
