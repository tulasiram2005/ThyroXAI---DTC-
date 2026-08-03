"use client";

import { useState } from "react";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { PIPELINE_STEPS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function Methodology() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="03 — Methodology"
        title="The ThyroXAI pipeline"
        subtitle="An end-to-end flow from raw clinical records to an explained, evidence-backed recurrence prediction (Fig. 4)."
      />

      <div className="mt-12 relative">
        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-line md:-translate-x-1/2" />
        <div className="space-y-3">
          {PIPELINE_STEPS.map((step, i) => {
            const isOpen = active === i;
            const leftSide = i % 2 === 0;
            return (
              <Reveal key={step.title} delay={i * 0.03}>
                <div
                  className={`md:grid md:grid-cols-2 md:gap-8 items-center ${
                    leftSide ? "" : ""
                  }`}
                >
                  <div className={`hidden md:block ${leftSide ? "" : "order-2"}`} />
                  <div className={`relative pl-10 md:pl-0 ${leftSide ? "md:pr-10" : "md:pl-10 md:order-2"}`}>
                    <div
                      className={`absolute left-0 md:left-auto ${
                        leftSide ? "md:right-[-5px]" : "md:left-[-5px]"
                      } top-4 w-[11px] h-[11px] rounded-full border-2 border-bg ${
                        isOpen ? "bg-teal" : "bg-ink-faint"
                      }`}
                    />
                    <button
                      onClick={() => setActive(isOpen ? null : i)}
                      className="w-full text-left card p-5 hover:border-teal/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="mono text-xs text-ink-faint">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-ink font-medium">{step.title}</span>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-sm text-ink-dim leading-relaxed mt-3 overflow-hidden"
                          >
                            {step.detail}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
