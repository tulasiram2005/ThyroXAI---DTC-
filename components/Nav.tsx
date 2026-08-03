"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-bg/70 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-ink tracking-tight">
          Thyro<span className="text-teal">XAI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`hidden sm:inline transition-colors ${pathname === "/" ? "text-ink" : "text-ink-faint hover:text-ink-dim"}`}
          >
            Overview
          </Link>
          <Link
            href="/predict"
            className={`transition-colors ${pathname === "/predict" ? "text-teal-soft" : "text-ink-faint hover:text-ink-dim"}`}
          >
            Live Prediction
          </Link>
          <a
            href="#publication"
            className="hidden sm:inline text-ink-faint hover:text-ink-dim transition-colors"
          >
            Paper
          </a>
        </div>
      </div>
    </div>
  );
}
