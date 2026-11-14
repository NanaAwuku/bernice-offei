"use client";

import type { ReactNode } from "react";
import { useLiveEnded } from "@/lib/live-state";

// Shows the live version (children) until the broadcast is known to have ended,
// then the regular version (fallback).
export default function LiveSwitch({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  return useLiveEnded() ? fallback : children;
}
