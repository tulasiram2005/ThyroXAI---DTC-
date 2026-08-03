"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HEADLINE_STATS, AUTHORS } from "@/lib/constants";
import { NodeGraph } from "@/components/NodeGraph";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 grid-veil opacity-60" />
      <div className="absolute inset-0">
        <NodeGraph />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--bg) 78%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="section-eyebrow mb-6"
        >
          IEEE Research Presentation · Explainable Clinical AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-medium text-ink leading-[1.02] mb-6 max-w-4xl"
        >
          Thyro<span className="text-teal">XAI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-ink-dim max-w-2xl mb-10 leading-snug"
        >
          An explainable AI framework for early prediction of differentiated
          thyroid cancer recurrence — ExtraTrees, SHAP, and Retrieval-Augmented
          Generation working together as clinical decision support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-full bg-teal text-[#04141a] font-medium px-6 py-3 hover:bg-teal-soft transition-colors glow-teal"
          >
            Try Live Prediction
          </Link>
          <a
            href="#publication"
            className="inline-flex items-center gap-2 rounded-full border border-line text-ink px-6 py-3 hover:border-teal/50 hover:text-teal-soft transition-colors"
          >
            View Research Paper
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line rounded-xl overflow-hidden border border-line max-w-3xl"
        >
          {HEADLINE_STATS.map((s) => (
            <div key={s.label} className="bg-bg-card px-5 py-5">
              <div className="mono text-2xl md:text-3xl text-teal-soft">{s.value}</div>
              <div className="text-xs text-ink-faint mt-1 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 text-sm text-ink-faint max-w-3xl"
        >
          {AUTHORS.map((a) => a.name).join(" · ")}
          <div className="mt-1">SRM Institute of Science and Technology, Kattankulathur</div>
        </motion.div>
      </div>
    </section>
  );
}
