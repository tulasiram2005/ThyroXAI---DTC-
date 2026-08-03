"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadModel, encodeAndScale, predict, localAttributions,
  RawInput, FeatureName,
} from "@/lib/model";
import { loadSample, retrieveSimilar, RetrievedCase } from "@/lib/rag";
import { Loader2, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

const COUNTRIES = ["Brazil", "China", "Germany", "India", "Japan", "Nigeria", "Russia", "South Korea", "UK", "USA"];
const ETHNICITIES = ["African", "Asian", "Caucasian", "Hispanic", "Middle Eastern"];

const DEFAULT_INPUT: RawInput = {
  Age: 52,
  Gender: "Female",
  Country: "India",
  Ethnicity: "Asian",
  Family_History: "No",
  Radiation_Exposure: "No",
  Iodine_Deficiency: "No",
  Smoking: "No",
  Obesity: "No",
  Diabetes: "No",
  TSH_Level: 5.0,
  T3_Level: 2.0,
  T4_Level: 8.2,
  Nodule_Size: 2.5,
};

function YesNoToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
}) {
  return (
    <div>
      <label className="text-xs text-ink-faint block mb-1.5">{label}</label>
      <div className="flex rounded-lg border border-line overflow-hidden">
        {(["No", "Yes"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 text-sm transition-colors ${
              value === opt ? "bg-teal text-[#04141a]" : "bg-bg-raised text-ink-dim hover:text-ink"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs text-ink-faint">{label}</label>
        <span className="mono text-xs text-teal-soft">
          {value.toFixed(2)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-ink-faint block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-raised border border-line rounded-lg px-3 py-2 text-sm text-ink"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

const FEATURE_LABELS: Record<FeatureName, string> = {
  Age: "Age",
  Gender: "Gender",
  Country: "Country",
  Ethnicity: "Ethnicity",
  Family_History: "Family History",
  Radiation_Exposure: "Radiation Exposure",
  Iodine_Deficiency: "Iodine Deficiency",
  Smoking: "Smoking",
  Obesity: "Obesity",
  Diabetes: "Diabetes",
  TSH_Level: "TSH Level",
  T3_Level: "T3 Level",
  T4_Level: "T4 Level",
  Nodule_Size: "Nodule Size",
};

export default function PredictPage() {
  const [input, setInput] = useState<RawInput>(DEFAULT_INPUT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    probability: number;
    diagnosis: "Benign" | "Malignant";
    attributions: { feature: FeatureName; impact: number }[];
    similar: RetrievedCase[];
  }>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof RawInput>(key: K, value: RawInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function runPrediction() {
    setLoading(true);
    setError(null);
    try {
      const [{ meta, model }, sample] = await Promise.all([loadModel(), loadSample()]);
      const x = encodeAndScale(input, meta);
      const pred = predict(x, model);
      const attributions = localAttributions(x, model, meta.feature_order)
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, 5);
      const similar = retrieveSimilar(x, sample, 5);
      setResult({
        probability: pred.probabilityMalignant,
        diagnosis: pred.diagnosis,
        attributions,
        similar,
      });
    } catch (e) {
      setError("Could not load the model files. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto px-6 py-16">
      <div className="section-eyebrow mb-3">Live Prediction Demo</div>
      <h1 className="text-3xl md:text-4xl font-medium text-ink mb-3">Try the ThyroXAI model</h1>
      <p className="text-ink-dim max-w-2xl mb-4 leading-relaxed">
        Enter patient values matching Table I of the paper. This runs a real ExtraTreesClassifier —
        exported tree-by-tree and executed entirely in your browser — through the same
        LabelEncode → Z-score pipeline described in Section IV.
      </p>
      <div className="card border-indigo/30 bg-indigo/5 px-4 py-3 text-xs text-ink-dim leading-relaxed mb-10 max-w-2xl">
        <strong className="text-indigo-soft">Illustrative model, not the paper&apos;s exact numbers.</strong>{" "}
        The published ExtraTrees model (95.87% accuracy, AUC 0.9894) was trained on the full
        2,12,691-row pipeline. This demo instead uses a small, fully transparent logistic
        regression fit on the same LabelEncode → Z-score features, evaluated on a proper
        leakage-free train/test split. Its coefficients line up directionally with the paper&apos;s
        SHAP ranking (Family History, Iodine Deficiency, and Radiation Exposure dominate), and
        every prediction is exactly explainable — no hidden tree interactions to cause
        inconsistent flips on ordinary inputs. Not for clinical use.
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 card p-6 h-fit">
          <h2 className="text-sm text-ink-dim uppercase tracking-wide mb-5">Patient Inputs</h2>
          <div className="space-y-4">
            <Slider label="Age" value={input.Age} min={15} max={89} step={1} unit="yrs" onChange={(v) => update("Age", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Gender" value={input.Gender} options={["Male", "Female"]} onChange={(v) => update("Gender", v as RawInput["Gender"])} />
              <Select label="Country" value={input.Country} options={COUNTRIES} onChange={(v) => update("Country", v)} />
            </div>
            <Select label="Ethnicity" value={input.Ethnicity} options={ETHNICITIES} onChange={(v) => update("Ethnicity", v)} />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <YesNoToggle label="Family History" value={input.Family_History} onChange={(v) => update("Family_History", v)} />
              <YesNoToggle label="Radiation Exposure" value={input.Radiation_Exposure} onChange={(v) => update("Radiation_Exposure", v)} />
              <YesNoToggle label="Iodine Deficiency" value={input.Iodine_Deficiency} onChange={(v) => update("Iodine_Deficiency", v)} />
              <YesNoToggle label="Smoking" value={input.Smoking} onChange={(v) => update("Smoking", v)} />
              <YesNoToggle label="Obesity" value={input.Obesity} onChange={(v) => update("Obesity", v)} />
              <YesNoToggle label="Diabetes" value={input.Diabetes} onChange={(v) => update("Diabetes", v)} />
            </div>

            <div className="pt-2 space-y-4">
              <Slider label="TSH Level" value={input.TSH_Level} min={0.1} max={10} step={0.01} unit="mIU/L" onChange={(v) => update("TSH_Level", v)} />
              <Slider label="T3 Level" value={input.T3_Level} min={0.5} max={3.5} step={0.01} unit="nmol/L" onChange={(v) => update("T3_Level", v)} />
              <Slider label="T4 Level" value={input.T4_Level} min={4.5} max={12} step={0.01} unit="µg/dL" onChange={(v) => update("T4_Level", v)} />
              <Slider label="Nodule Size" value={input.Nodule_Size} min={0} max={5} step={0.01} unit="cm" onChange={(v) => update("Nodule_Size", v)} />
            </div>
          </div>

          <button
            onClick={runPrediction}
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-teal text-[#04141a] font-medium px-6 py-3 hover:bg-teal-soft transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {loading ? "Running model…" : "Run Prediction"}
          </button>
          {error && <p className="text-xs text-malignant mt-3">{error}</p>}
        </div>

        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm text-ink-dim uppercase tracking-wide">Prediction</h2>
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${
                        result.diagnosis === "Malignant"
                          ? "bg-malignant/10 text-malignant border-malignant/30"
                          : "bg-teal/10 text-teal-soft border-teal/30"
                      }`}
                    >
                      {result.diagnosis === "Malignant" ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {result.diagnosis}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-bg-raised overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability * 100}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #14b8a6, #fb7185)",
                        }}
                      />
                    </div>
                    <span className="mono text-sm text-ink w-16 text-right">
                      {(result.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-ink-faint mt-2">Predicted probability of recurrence (Malignant)</p>
                </div>

                <div className="card p-6">
                  <h2 className="text-sm text-ink-dim uppercase tracking-wide mb-4">
                    Top-5 contributing features (local SHAP-style waterfall)
                  </h2>
                  <div className="space-y-3">
                    {result.attributions.map((a) => {
                      const width = Math.min(100, Math.abs(a.impact) * 120);
                      const positive = a.impact > 0;
                      return (
                        <div key={a.feature}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-ink-dim">{FEATURE_LABELS[a.feature]}</span>
                            <span className={`mono ${positive ? "text-malignant" : "text-teal-soft"}`}>
                              {positive ? "+" : ""}
                              {a.impact.toFixed(3)}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-bg-raised overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${width}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-full"
                              style={{ background: positive ? "#fb7185" : "#14b8a6" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-ink-faint mt-4 leading-relaxed">
                    Pink pushes the prediction toward Malignant, teal pushes toward Benign. Each bar
                    is this feature&apos;s exact contribution to the model&apos;s log-odds
                    (coefficient × standardized value) — not an approximation, since the underlying
                    model is linear.
                  </p>
                </div>

                <div className="card p-6">
                  <h2 className="text-sm text-ink-dim uppercase tracking-wide mb-4">
                    RAG · {result.similar.length} similar retrieved cases
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.similar.map((c, i) => (
                      <div key={i} className="rounded-lg border border-line bg-bg-raised p-3 text-xs">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-ink-faint">Similarity {(c.similarity * 100).toFixed(0)}%</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${
                              c.Diagnosis === "Malignant"
                                ? "bg-malignant/10 text-malignant"
                                : "bg-teal/10 text-teal-soft"
                            }`}
                          >
                            {c.Diagnosis}
                          </span>
                        </div>
                        <div className="text-ink-dim space-y-0.5">
                          <div>Age {c.Age} · {c.Gender} · {c.Country}</div>
                          <div>TSH {c.TSH_Level} · Nodule {c.Nodule_Size}cm</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-faint mt-4">
                    Nearest neighbours by Euclidean distance in the standardized feature space —
                    Sim(x_q, x_i) = 1 / (1 + d(x_q, x_i)), same similarity notion as Eq. (6)–(7) in
                    the paper — retrieved from a bundled sample of 500 real dataset records.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-10 h-full flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <Activity className="w-8 h-8 text-ink-faint mb-4" strokeWidth={1.2} />
                <p className="text-ink-dim text-sm max-w-xs">
                  Set the patient values on the left, then run the model to see the prediction,
                  feature attributions, and retrieved similar cases.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
