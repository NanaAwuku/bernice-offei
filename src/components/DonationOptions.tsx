"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import d from "@/content/donations.json";
import { CHECKOUT_URL } from "@/lib/checkout";
import { checkIcon, copyIcon } from "./icons";

// Ways to give, used in the Donate panel and on /donate.
// Values come from src/content/donations.json; the checkout URL from lib/checkout.

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

// On Android, tapping the short code opens the dialler (iPhones don't allow this).
const noSubscribe = () => () => {};
const useIsAndroid = () =>
  useSyncExternalStore(noSubscribe, () => /Android/i.test(navigator.userAgent), () => false);

export default function DonationOptions() {
  const isAndroid = useIsAndroid();
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(label: string, text: string) {
    const ok = await copyText(text);
    setStatus(ok ? "Copied" : "Copy failed. Please select the text instead.");
    if (!ok) return;
    setCopied(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="give" data-give>
      {/* Opens in a new tab, or inside the Donate panel where the provider allows it (DonateDialog). */}
      <a className="give-online" href={CHECKOUT_URL} target="_blank" rel="noopener" data-give-online>
        <span className="give-online-label">
          {d.online.button} <span aria-hidden="true">→</span>
        </span>
        <span className="give-online-note">{d.online.note}</span>
      </a>

      <p className="give-or">
        <span>or send directly</span>
      </p>

      <ul className="give-direct">
        {d.direct.map((o) => (
          <li key={o.label}>
            <span className="give-label">{o.label}</span>
            <span className="give-val">
              {"dial" in o && o.dial && isAndroid ? (
                <a className="give-num" href={`tel:${o.value.replace("#", "%23")}`} aria-label={`Dial ${o.value}`}>
                  {o.value}
                </a>
              ) : (
                <span className="give-num">{o.value}</span>
              )}
              {"detail" in o && o.detail && <span className="give-detail">{o.detail}</span>}
            </span>
            <button
              type="button"
              className={copied === o.label ? "copy-btn copied" : "copy-btn"}
              aria-label={`Copy ${o.label} ${o.value}`}
              onClick={() => copy(o.label, o.copy)}
            >
              <span className="i-copy">{copyIcon}</span>
              <span className="i-done">{checkIcon}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="give-name">
        Other options in the name of <strong>{d.accountName}</strong>
      </p>
      <p className="visually-hidden" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
