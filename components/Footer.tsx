"use client";

import { useState } from "react";
import { REFERENCES_PREVIEW } from "@/lib/constants";
import { ChevronDown, ExternalLink, Mail } from "lucide-react";

export function Footer() {
  const [open, setOpen] = useState(false);
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="card">
          <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-6 py-4">
            <span className="text-sm text-ink uppercase tracking-wide">References (selected)</span>
            <ChevronDown className={`w-4 h-4 text-ink-dim transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <ol className="border-t border-line px-6 py-4 space-y-2 text-xs text-ink-faint list-decimal list-inside">
              {REFERENCES_PREVIEW.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-10 text-sm text-ink-faint">
          <div>ThyroXAI · SRM Institute of Science and Technology, Kattankulathur</div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/tulasiram2005/ThyroXAI---DTC-" target="_blank" rel="noreferrer" className="hover:text-teal-soft flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/tulasi-ram-bc-6787a1287" target="_blank" rel="noreferrer" className="hover:text-teal-soft flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4" /> LinkedIn
            </a>
            <a href="mailto:ramtulasi2005@gmail.com" className="hover:text-teal-soft flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
