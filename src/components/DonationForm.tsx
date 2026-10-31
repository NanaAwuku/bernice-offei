"use client";

import { useState } from "react";

const PRESETS = [100, 500, 1000];

export type DonationDetails = {
  amount: number;
  fullName: string;
  email: string;
  msisdn: string;
  paymentMethod: "mobile_money" | "card";
  anonymous: boolean;
};

const field =
  "w-full rounded-xl bg-white px-4 py-3.5 text-base text-foreground ring-1 ring-line placeholder:text-muted/60 focus:outline-2 focus:outline-accent";

const money = new Intl.NumberFormat("en-GH");

// Takes whatever was typed (0201234567, 201234567, +233 20 123 4567) and returns
// 233201234567, or undefined if it isn't a full Ghana number.
function toMsisdn(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("233")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === 9 ? `233${digits}` : undefined;
}

export default function DonationForm({
  busy,
  error,
  onSubmit,
}: {
  busy: boolean;
  error: string | null;
  onSubmit: (details: DonationDetails) => void;
}) {
  const [preset, setPreset] = useState<number | null>(500);
  const [custom, setCustom] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<DonationDetails["paymentMethod"]>("mobile_money");
  const [anonymous, setAnonymous] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const amount = custom ? Number(custom) : (preset ?? 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msisdn = toMsisdn(phone);
    if (!(amount >= 1)) return setProblem("Choose or enter an amount.");
    if (!msisdn) return setProblem("Enter a valid Ghana phone number.");
    setProblem(null);
    onSubmit({ amount, fullName: fullName.trim(), email: email.trim(), msisdn, paymentMethod: method, anonymous });
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-3xl bg-white/80 p-5 text-left shadow-xl ring-1 ring-line sm:p-8">
      <h2 className="font-serif text-2xl font-medium sm:text-3xl">Make a donation</h2>

      <div className="mt-6 grid grid-cols-3 gap-3" role="group" aria-label="Amount">
        {PRESETS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={!custom && preset === value}
            onClick={() => {
              setPreset(value);
              setCustom("");
            }}
            className={`cursor-pointer rounded-xl px-2 py-3 text-base font-medium ring-1 transition ${
              !custom && preset === value ? "bg-accent text-white ring-accent" : "bg-white text-foreground ring-line hover:ring-accent/40"
            }`}
          >
            GH₵{money.format(value)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-4 ring-1 ring-line focus-within:outline-2 focus-within:outline-accent">
        <span className="text-base font-medium text-muted">GH₵</span>
        <input
          inputMode="decimal"
          value={custom}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, "");
            setCustom(v);
            if (v) setPreset(null);
          }}
          placeholder="Custom amount"
          aria-label="Custom amount"
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-muted/60"
        />
      </div>

      <div className="mt-7 space-y-3.5">
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" autoComplete="name" maxLength={100} className={field} />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address (for receipt)" autoComplete="email" maxLength={120} className={field} />
        <div className="flex overflow-hidden rounded-xl bg-white ring-1 ring-line focus-within:outline-2 focus-within:outline-accent">
          <span className="flex items-center whitespace-nowrap bg-lavender-soft px-4 text-base text-muted">🇬🇭 +233</span>
          <input required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" autoComplete="tel-national" className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted/60" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3" role="group" aria-label="Payment method">
        {(
          [
            ["mobile_money", "Mobile Money"],
            ["card", "Card"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={method === value}
            onClick={() => setMethod(value)}
            className={`cursor-pointer rounded-xl px-3 py-3 text-sm font-medium ring-1 transition ${
              method === value ? "bg-lavender text-accent ring-accent" : "bg-white text-muted ring-line hover:ring-accent/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-4 w-4 cursor-pointer accent-(--plum)" />
        Give anonymously
      </label>

      {(problem ?? error) && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {problem ?? error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-lg font-medium text-white shadow-sm transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Preparing checkout…
          </>
        ) : (
          `Donate${amount >= 1 ? ` GH₵${money.format(amount)}` : ""}`
        )}
      </button>
    </form>
  );
}
