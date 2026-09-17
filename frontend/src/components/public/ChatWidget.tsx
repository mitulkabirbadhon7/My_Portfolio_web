"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
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
  "What tech stack do you use?",
  "Tell me about your projects",
  "How can I contact you?",
];

const INITIAL_WELCOME_TEXT =
  "Hello! I am Mitul's interactive AI assistant. Ask me anything about my projects, tech stack, architecture decisions, or experience!";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: INITIAL_WELCOME_TEXT,
    timestamp: "Online",
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
          throw new Error("No response payload received from AI service");
        }
      } catch (err: unknown) {
        let friendlyError =
          "The AI assistant is temporarily unavailable. Please try again or reach out directly via the Contact page.";

        if (err instanceof ApiError) {
          if (err.status === 400) {
            friendlyError =
              typeof err.data === "object" && err.data !== null && "message" in err.data
                ? String((err.data as { message: unknown }).message)
                : "Please enter a valid message (maximum 1000 characters).";
          } else if (err.status === 401) {
            friendlyError = "Unauthorized chat request. Please refresh the page.";
          } else if (err.status === 429) {
            friendlyError =
              "Rate limit reached. You have sent too many messages recently. Please wait a moment before trying again.";
          } else if (err.status >= 500) {
            friendlyError =
              "AI service is experiencing high traffic. Please try again in a few moments.";
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
      aria-label="Interactive AI Assistant"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans"
    >
      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with AI Assistant"
          className="mb-3 flex flex-col overflow-hidden rounded-2xl border border-[#337418] bg-[#202020] text-[#F8F8F8] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-6rem)]"
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
                <p className="text-[11px] text-[#9E9E9E]">Gemini-Powered Ambassador</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                aria-label="Reset conversation"
                title="Reset conversation"
                className="rounded-lg p-1.5 text-[#9E9E9E] transition-colors hover:bg-[#202020] hover:text-[#F8F8F8] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
              >
                <RotateCcw className="size-3.5" />
              </button>
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
            </div>
          </header>

          {/* Scrollable Messages Area */}
          <div
            tabIndex={0}
            aria-label="Message history"
            aria-live="polite"
            className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]/30"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end gap-2 max-w-[88%]">
                  {msg.sender === "ai" && (
                    <div
                      aria-hidden="true"
                      className={`mb-1 flex size-6 shrink-0 items-center justify-center rounded-lg border ${
                        msg.isError
                          ? "border-red-500/60 bg-red-950/40 text-red-400"
                          : "border-[#337418]/60 bg-[#0F0F0F] text-[#5DD62C]"
                      }`}
                    >
                      {msg.isError ? (
                        <AlertTriangle className="size-3.5" />
                      ) : (
                        <Bot className="size-3.5" />
                      )}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "rounded-tr-xs bg-[#337418] text-[#F8F8F8]"
                        : msg.isError
                        ? "rounded-tl-xs border border-red-500/40 bg-red-950/20 text-red-200"
                        : "rounded-tl-xs border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8]"
                    }`}
                  >
                    {msg.sender === "ai" ? (
                      <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-a:text-[#5DD62C] prose-a:underline hover:prose-a:text-[#5DD62C]/80 prose-strong:text-[#F8F8F8]">
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

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#9E9E9E] px-2 py-1">
                <div className="flex size-6 items-center justify-center rounded-lg border border-[#337418]/60 bg-[#0F0F0F] text-[#5DD62C]">
                  <Bot className="size-3.5 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-1.5">
                  <span className="size-1.5 rounded-full bg-[#5DD62C] animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-[#5DD62C] animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-[#5DD62C] animate-bounce" />
                </div>
              </div>
            )}

            {/* Suggestion Pills (Shown when conversation is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="mt-3 pt-2">
                <p className="mb-2 text-[11px] font-medium text-[#737373]">
                  Suggested questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTION_PILLS.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className="inline-flex items-center justify-start gap-2 rounded-lg border border-[#2A2A2A] bg-[#161616] px-3 py-1.5 text-left text-xs text-[#9E9E9E] transition-all hover:border-[#5DD62C]/60 hover:bg-[#202020] hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                    >
                      <Sparkles className="size-3 text-[#5DD62C]" />
                      <span>{pill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <footer className="border-t border-[#2A2A2A] bg-[#161616] p-3">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                maxLength={1000}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about my skills or work..."
                aria-label="Message for AI Assistant"
                disabled={isLoading}
                className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-3.5 py-2 text-xs sm:text-sm text-[#F8F8F8] placeholder-[#737373] transition-colors outline-hidden focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
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
