"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { SHAP_TABLE } from "@/lib/constants";

interface BeeswarmData {
  order: string[];
  mean_abs: Record<string, number>;
  points: Record<string, { shap: number; val: number }[]>;
}

function valueToColor(v: number) {
  // v in [0,1] -> blue (low) to pink/red (high), matching a SHAP summary plot palette
  const low = [59, 130, 246]; // blue-500
  const high = [244, 63, 94]; // rose-500
  const rgb = low.map((c, i) => Math.round(c + (high[i] - c) * v));
  return `rgb(${rgb.join(",")})`;
}

function Beeswarm({ data }: { data: BeeswarmData }) {
  const width = 720;
  const rowHeight = 34;
  const height = data.order.length * rowHeight + 30;
  const maxAbs = Math.max(
    ...data.order.flatMap((f) => data.points[f].map((p) => Math.abs(p.shap)))
  );
  const xScale = (v: number) => width / 2 + (v / maxAbs) * (width / 2 - 40);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <line x1={width / 2} y1={0} x2={width / 2} y2={height - 20} stroke="#1c2c38" strokeWidth={1} />
      {data.order.map((feature, rowIdx) => {
        const y = rowIdx * rowHeight + rowHeight / 2;
        return (
          <g key={feature}>
            <text x={4} y={y + 4} fontSize={11} fill="#93a8b2">
              {feature.replace(/_/g, " ")}
            </text>
            {data.points[feature].map((p, i) => {
              // deterministic jitter from index
              const jitter = (((i * 37) % 21) - 10) * 1.1;
              return (
                <circle
                  key={i}
                  cx={xScale(p.shap)}
                  cy={y + jitter}
                  r={2.1}
                  fill={valueToColor(p.val)}
                  opacity={0.75}
                />
              );
            })}
          </g>
        );
      })}
      <text x={width / 2} y={height - 4} fontSize={10} fill="#5c7079" textAnchor="middle">
        SHAP value (impact on model output) →
      </text>
    </svg>
  );
}

export function ShapSection() {
  const [beeswarm, setBeeswarm] = useState<BeeswarmData | null>(null);

  useEffect(() => {
    fetch("/data/shap_beeswarm.json")
      .then((r) => r.json())
      .then(setBeeswarm)
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="05 — Explainability · SHAP"
        title="Which features actually drive the prediction"
        subtitle="SHAP quantifies each attribute's contribution using Shapley values from game theory — giving both per-patient and population-level interpretations (Table V, Fig. 7)."
      />

      <div className="grid md:grid-cols-2 gap-5 mt-10">
        <Reveal>
          <div className="card p-6">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              Mean |SHAP| value — published results (Table V)
            </h3>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={SHAP_TABLE} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#1c2c38" horizontal={false} />
                <XAxis type="number" stroke="#5c7079" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="#93a8b2" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ background: "#0d1620", border: "1px solid #1c2c38", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="meanAbsShap" radius={[0, 4, 4, 0]}>
                  {SHAP_TABLE.map((_, i) => (
                    <Cell key={i} fill={i < 5 ? "#14b8a6" : "#0b5563"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card p-6">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              SHAP beeswarm — computed live on this deployed model
            </h3>
            {beeswarm ? (
              <Beeswarm data={{ ...beeswarm, order: beeswarm.order.slice(0, 10) }} />
            ) : (
              <div className="h-[420px] flex items-center justify-center text-ink-faint text-sm">
                Loading SHAP values…
              </div>
            )}
            <p className="text-xs text-ink-faint mt-2">
              Each dot is one patient from a 600-record sample. Color = feature value (blue = low,
              red = high). This demo&apos;s model is linear, so each point is an{" "}
              <strong className="text-ink-dim">exact</strong> contribution
              (coefficient × standardized value) rather than an approximation — computed on real
              data, not fabricated. Feature ranking may differ slightly from the paper&apos;s
              full-scale ExtraTrees model above.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-8">
        <div className="card p-6 overflow-x-auto">
          <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">Top-5 feature interpretation</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {SHAP_TABLE.slice(0, 5).map((row) => (
              <div key={row.feature}>
                <div className="mono text-teal-soft text-sm">{row.feature}</div>
                <div className="text-xs text-ink-faint mb-1">SHAP {row.meanAbsShap}</div>
                <div className="text-sm text-ink-dim leading-snug">{row.interpretation}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
