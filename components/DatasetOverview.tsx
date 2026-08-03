"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { SectionHeading, Reveal } from "@/components/Reveal";
import {
  DATASET_STATS, RISK_DISTRIBUTION, COUNTRY_DISTRIBUTION, DATASET_ATTRIBUTES,
} from "@/lib/constants";
import { ChevronDown } from "lucide-react";

const DONUT_COLORS = ["#14b8a6", "#0b5563", "#6366f1", "#5eead4", "#a5b4fc", "#0e7490", "#818cf8", "#2dd4bf", "#334155", "#475569"];

function TooltipCard({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-raised border border-line rounded-lg px-3 py-2 text-xs text-ink">
      <div className="text-ink-dim mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="mono">{p.name}: {p.value.toLocaleString()}</div>
      ))}
    </div>
  );
}

export function DatasetOverview() {
  const [open, setOpen] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="02 — Dataset"
        title="2,12,691 patient records, 17 attributes"
        subtitle="Sourced from Kaggle's Thyroid Cancer Risk Dataset: demographic, lifestyle, laboratory, and clinical fields — no personally identifiable information."
      />

      <div className="grid md:grid-cols-4 gap-px bg-line rounded-xl overflow-hidden border border-line mt-10 mb-12">
        {[
          { label: "Records", value: DATASET_STATS.totalRecords.toLocaleString() },
          { label: "Attributes", value: DATASET_STATS.features },
          { label: "Malignant", value: `${DATASET_STATS.malignant.toLocaleString()} (${DATASET_STATS.malignantPct}%)` },
          { label: "Benign", value: `${DATASET_STATS.benign.toLocaleString()} (${DATASET_STATS.benignPct}%)` },
        ].map((s) => (
          <div key={s.label} className="bg-bg-card px-5 py-5">
            <div className="mono text-xl text-teal-soft">{s.value}</div>
            <div className="text-xs text-ink-faint mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Reveal>
          <div className="card p-6">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              Class Distribution — Thyroid Cancer Risk (Fig. 1)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={RISK_DISTRIBUTION}>
                <CartesianGrid stroke="#1c2c38" vertical={false} />
                <XAxis dataKey="risk" stroke="#5c7079" fontSize={12} />
                <YAxis stroke="#5c7079" fontSize={12} />
                <Tooltip content={<TooltipCard />} cursor={{ fill: "rgba(20,184,166,0.06)" }} />
                <Bar dataKey="count" name="Patients" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card p-6">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              Geographic Distribution by Country (Fig. 3)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={COUNTRY_DISTRIBUTION}
                  dataKey="pct"
                  nameKey="country"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={1}
                >
                  {COUNTRY_DISTRIBUTION.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-bg-raised border border-line rounded-lg px-3 py-2 text-xs">
                        {payload[0].name}: {payload[0].value}%
                      </div>
                    ) : null
                  }
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#93a8b2" }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-5">
        <div className="card">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm text-ink uppercase tracking-wide">
              All 17 dataset attributes (Table I)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-ink-dim transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="border-t border-line divide-y divide-line">
              {DATASET_ATTRIBUTES.map((a) => (
                <div key={a.attr} className="grid grid-cols-[1fr_2fr] gap-4 px-6 py-3 text-sm">
                  <span className="mono text-teal-soft">{a.attr}</span>
                  <span className="text-ink-dim">{a.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
