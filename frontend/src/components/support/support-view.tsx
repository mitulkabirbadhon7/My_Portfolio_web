"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  Heart,
  QrCode,
  Smartphone,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Config constants from docs/CONFIG.md
const BKASH_NUMBER = "+8801610677731";
const BKASH_METHOD = "Send Money";
const BKASH_QR_IMAGE = "/images/bkash-qr.svg";
const GITHUB_SPONSORS_URL = "https://github.com/sponsors/mitulkabirbadhon7";
// BUYMEACOFFEE_URL is "TBD" in docs/CONFIG.md — omitted per Requirement 5

// Requirement 4: Contribution tiers: 100 BDT, 500 BDT, 1000 BDT, Custom
const CONTRIBUTION_TIERS = [
  { id: "100", label: "100 BDT", amount: 100, desc: "A cup of hot tea & warm encouragement" },
  { id: "500", label: "500 BDT", amount: 500, desc: "Coffee & high-bandwidth development juice" },
  { id: "1000", label: "1000 BDT", amount: 1000, desc: "Server runtime & database infrastructure" },
  { id: "custom", label: "Custom", amount: null, desc: "Any custom contribution amount you choose" },
];

export function SupportView() {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("500");
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      toast.success("bKash Number Copied!", {
        description: `${BKASH_NUMBER} copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy. Please manually copy the number.");
    }
  };

  const currentAmountDisplay =
    selectedTier === "custom"
      ? customAmount.trim() ? `${customAmount} BDT` : "Custom Amount"
      : `${selectedTier} BDT`;

  return (
    <div className="space-y-12">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1 text-xs font-mono text-[#5DD62C]">
          <Heart className="size-3.5 fill-[#5DD62C]" />
          <span>Support &amp; Community Sponsorship</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8F8F8]">
          Fueling independent engineering &amp; open-source craft.
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
          If my open-source projects, technical writing, or architecture guides have saved you time or
          inspired your workflow, you can directly fuel future development through manual support.
        </p>
      </div>

      {/* =========================================================================
          MAIN SUPPORT SECTION: 2-COLUMN GRID (bKash & Instructions)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* =======================================================================
            LEFT CARD: BKASH NUMBER, QR & COPY BUTTON (Requirement 2 & 6)
            ======================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Corner Decorative Accent */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#5DD62C]/10 blur-2xl" />

            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#E2136E] shadow-[0_0_10px_rgba(226,19,110,0.6)]" />
                <span className="font-mono text-sm font-bold tracking-wider text-[#F8F8F8]">
                  bKash Personal Transfer
                </span>
              </div>
              <span className="rounded-full bg-[#337418]/40 px-2.5 py-0.5 font-mono text-[11px] text-[#5DD62C] border border-[#337418]">
                {BKASH_METHOD}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F]">
              <div className="relative size-60 sm:size-64 overflow-hidden rounded-lg shadow-md">
                <Image
                  src={BKASH_QR_IMAGE}
                  alt="bKash QR Code for manual transfer"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="mt-3 font-mono text-xs text-[#9E9E9E] flex items-center gap-1.5">
                <QrCode className="size-3.5 text-[#5DD62C]" />
                <span>Scan with your bKash Mobile App</span>
              </p>
            </div>

            {/* Number Display & Copy Button (Requirement 2) */}
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
                bKash Account Number:
              </span>
              <div className="flex items-center justify-between rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-3 sm:p-4">
                <div className="font-mono text-lg sm:text-xl font-bold tracking-wider text-[#F8F8F8]">
                  {BKASH_NUMBER}
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  aria-label="Copy bKash number to clipboard"
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                    copied
                      ? "bg-[#5DD62C] text-[#0F0F0F] shadow-[0_0_12px_rgba(93,214,44,0.4)]"
                      : "border border-[#337418] bg-[#202020] text-[#5DD62C] hover:bg-[#5DD62C]/15"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9E9E9E] font-mono">
              <ShieldCheck className="size-4 text-[#5DD62C]" />
              <span>Verified Developer Account • Direct Transmission</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: TIERS & STEP-BY-STEP INSTRUCTIONS (Requirements 3 & 4)
            ======================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Contribution Tiers Card (Requirement 4: 100, 500, 1000, Custom) */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#F8F8F8]">Contribution Tiers</h2>
              <p className="text-xs text-[#9E9E9E]">
                Select a recommended support tier or specify your own custom amount:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Support Tiers">
              {CONTRIBUTION_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                      isSelected
                        ? "border-2 border-[#5DD62C] bg-[#5DD62C]/10 text-[#5DD62C] shadow-[0_0_12px_rgba(93,214,44,0.2)]"
                        : "border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] hover:border-[#337418]"
                    }`}
                  >
                    <span className="font-mono text-sm font-bold">{tier.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input Field if Custom Tier Selected */}
            {selectedTier === "custom" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label
                  htmlFor="custom-amount-input"
                  className="block font-mono text-xs uppercase tracking-wider text-[#9E9E9E]"
                >
                  Enter Custom Amount (BDT):
                </label>
                <div className="relative">
                  <input
                    id="custom-amount-input"
                    type="number"
                    min="10"
                    max="100000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2.5 font-mono text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/60 outline-hidden focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#9E9E9E]">
                    BDT
                  </span>
                </div>
              </div>
            )}

            {/* Selected Tier Narrative */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 text-xs text-[#9E9E9E] flex items-center justify-between">
              <span>Target Transmission:</span>
              <span className="font-mono text-sm font-bold text-[#5DD62C]">
                {currentAmountDisplay}
              </span>
            </div>
          </div>

          {/* Step-by-Step Instructions (Requirement 3: Exact method "Send Money") */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-[#5DD62C]" />
              <h2 className="text-base font-bold text-[#F8F8F8]">
                How to Complete Manual Transfer ({BKASH_METHOD})
              </h2>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-[#9E9E9E] pl-1 font-mono">
              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#337418] text-[11px] font-bold text-[#5DD62C]">
                  1
                </span>
                <span>
                  Open your <strong className="text-[#F8F8F8]">bKash App</strong> on your phone (or dial <code className="text-[#5DD62C] bg-[#0F0F0F] px-1 py-0.5 rounded border border-[#2A2A2A]">*247#</code>).
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#337418] text-[11px] font-bold text-[#5DD62C]">
                  2
                </span>
                <span>
                  Select the <strong className="text-[#5DD62C]">{BKASH_METHOD}</strong> option on the dashboard.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#337418] text-[11px] font-bold text-[#5DD62C]">
                  3
                </span>
                <span>
                  Scan the QR code above, or enter number <strong className="text-[#F8F8F8]">{BKASH_NUMBER}</strong>.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#337418] text-[11px] font-bold text-[#5DD62C]">
                  4
                </span>
                <span>
                  Specify your desired contribution amount (<span className="text-[#5DD62C]">{currentAmountDisplay}</span>).
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#337418] text-[11px] font-bold text-[#5DD62C]">
                  5
                </span>
                <span>
                  Add reference <code className="text-[#F8F8F8] bg-[#0F0F0F] px-1 py-0.5 rounded border border-[#2A2A2A]">Support</code>, enter your PIN, and confirm.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ALTERNATIVE SUPPORT LINKS (Requirement 5: Only configured, non-TBD links)
          ========================================================================= */}
      {Boolean(GITHUB_SPONSORS_URL) && (
        <section aria-labelledby="alt-support-heading" className="space-y-4 pt-4 border-t border-[#2A2A2A]">
          <div className="space-y-1">
            <h2 id="alt-support-heading" className="text-xl font-bold text-[#F8F8F8]">
              Alternative Sponsorship Channels
            </h2>
            <p className="text-xs text-[#9E9E9E]">
              International and open-source monthly patronage:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {/* GitHub Sponsors Card */}
            <a
              href={GITHUB_SPONSORS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-[#2A2A2A] bg-[#202020] p-4 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_18px_rgba(93,214,44,0.12)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#5DD62C] transition-colors group-hover:border-[#5DD62C]/60">
                  <GithubIcon className="size-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#F8F8F8] group-hover:text-[#5DD62C] transition-colors">
                    GitHub Sponsors
                  </div>
                  <div className="text-xs text-[#9E9E9E]">Monthly / One-time tier</div>
                </div>
              </div>

              <ExternalLink className="size-4 text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors" />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
