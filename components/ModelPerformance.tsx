"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { MODEL_METRICS, CONFUSION_MATRIX, PRIOR_WORK_COMPARISON, FEATURE_REDUCTION } from "@/lib/constants";

const LINE_COLORS: Record<string, string> = {
  ExtraTrees: "#14b8a6",
  RandomForest: "#6366f1",
  CatBoost: "#a5b4fc",
  XGBoost: "#5c7079",
  DecisionTree: "#fb7185",
};

function CMCell({ label, value, tone }: { label: string; value: number; tone: "hi" | "lo" }) {
  return (
    <div
      className={`rounded-lg p-5 text-center ${
        tone === "hi" ? "bg-teal/15 border border-teal/40" : "bg-bg-raised border border-line"
      }`}
    >
      <div className={`mono text-2xl ${tone === "hi" ? "text-teal-soft" : "text-ink-dim"}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-ink-faint mt-1">{label}</div>
    </div>
  );
}

export function ModelPerformance() {
  const sortedMetrics = [...MODEL_METRICS].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="04 — Model Performance"
        title="ExtraTrees wins on every axis"
        subtitle="Nine candidate classifiers were compared on accuracy, precision, recall, F1, AUC, log loss, and runtime (Tables II & III)."
      />

      <Reveal className="mt-10">
        <div className="card p-6">
          <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
            Accuracy · Precision · Recall · F1 by classifier
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={sortedMetrics} margin={{ left: -10 }}>
              <CartesianGrid stroke="#1c2c38" vertical={false} />
              <XAxis dataKey="model" stroke="#5c7079" fontSize={11} angle={-25} textAnchor="end" height={70} />
              <YAxis stroke="#5c7079" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#0d1620", border: "1px solid #1c2c38", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "rgba(20,184,166,0.05)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#93a8b2" }} />
              <Bar dataKey="accuracy" name="Accuracy" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="precision" name="Precision" fill="#0b5563" radius={[3, 3, 0, 0]} />
              <Bar dataKey="recall" name="Recall" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="f1" name="F1" fill="#a5b4fc" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <Reveal>
          <div className="card p-6 h-full">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              Feature Reduction vs. Accuracy (Fig. 5)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={FEATURE_REDUCTION}>
                <CartesianGrid stroke="#1c2c38" vertical={false} />
                <XAxis dataKey="features" stroke="#5c7079" fontSize={12} reversed label={{ value: "Features remaining", position: "insideBottom", offset: -5, fill: "#5c7079", fontSize: 11 }} />
                <YAxis stroke="#5c7079" fontSize={12} domain={[50, 100]} />
                <Tooltip contentStyle={{ background: "#0d1620", border: "1px solid #1c2c38", borderRadius: 8, fontSize: 12 }} />
                {Object.entries(LINE_COLORS).map(([key, color]) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={key === "ExtraTrees" ? 3 : 1.5} dot={false} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, color: "#93a8b2" }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-ink-faint mt-2">
              ExtraTrees stays flat as features drop; other classifiers show a sharp cliff around 6–7 features.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card p-6 h-full">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
              Confusion Matrix — ExtraTrees (Fig. 6)
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <CMCell label="True Negative (Not Affected)" value={CONFUSION_MATRIX.trueNegative} tone="hi" />
              <CMCell label="False Positive" value={CONFUSION_MATRIX.falsePositive} tone="lo" />
              <CMCell label="False Negative" value={CONFUSION_MATRIX.falseNegative} tone="lo" />
              <CMCell label="True Positive (Affected)" value={CONFUSION_MATRIX.truePositive} tone="hi" />
            </div>
            <p className="text-xs text-ink-faint mt-4">
              25,565 affected and 13,994 unaffected cases correctly classified; only 625 false positives and 1,021 false negatives.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-5">
        <div className="card p-6 overflow-x-auto">
          <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">
            Comparison with Existing Approaches (Table IV)
          </h3>
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-ink-faint text-xs uppercase text-left border-b border-line">
                <th className="pb-2 font-normal">Author(s)</th>
                <th className="pb-2 font-normal">Model</th>
                <th className="pb-2 font-normal text-right">Accuracy</th>
                <th className="pb-2 font-normal text-right">F1</th>
                <th className="pb-2 font-normal text-right">AUC</th>
              </tr>
            </thead>
            <tbody>
              {PRIOR_WORK_COMPARISON.map((row) => (
                <tr
                  key={row.author}
                  className={`border-b border-line last:border-0 ${
                    row.author.includes("ThyroXAI") ? "bg-teal/5" : ""
                  }`}
                >
                  <td className="py-3 text-ink">{row.author}</td>
                  <td className="py-3 text-ink-dim">{row.model}</td>
                  <td className={`py-3 text-right mono ${row.author.includes("ThyroXAI") ? "text-teal-soft" : "text-ink-dim"}`}>
                    {row.accuracy}%
                  </td>
                  <td className="py-3 text-right mono text-ink-dim">{row.f1}%</td>
                  <td className="py-3 text-right mono text-ink-dim">{row.auc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
