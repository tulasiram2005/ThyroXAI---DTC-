"use client";

import { useState } from "react";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { AUTHORS } from "@/lib/constants";
import { Copy, Check, ExternalLink } from "lucide-react";

const ABSTRACT =
  "Differentiated Thyroid Cancer (DTC) recurrence is a concern for doctors. Traditional staging systems do not fully capture the relationships between clinical and pathological factors. Artificial Intelligence overcomes this challenge by identifying the DTC recurrence at the earliest. In this study, the proposed ThyroXAI framework integrates the classification model along with interpretability using SHAP and a Retrieval Augmented Generation (RAG). An array of machine learning and deep learning methods were employed, among them ExtraTrees model outperformed with 95.87% of accuracy, 95.26% of precision, 95.8% of recall and 95.52% of F1-score. To enhance the trust and transparency SHAP was integrated along with the classifier. SHAP would list the top features based on which the model classifies. SHAP output was provided as input to the RAG to enable end users to understand the prediction of the model and categorize the features that drove the decision. Therefore, the physicians could make transparent clinical decision-making by employing explainable ThyroXAI framework.";

const KEYWORDS = ["thyroid cancer", "recurrence", "ExtraTrees", "SHAP", "RAG", "clinical decision support"];

const CITATION = `B. C. Tulasi Ram, S. Parthasarathy, V. S. S. Seera, M. I. Glad Mohesh, and V. Jayaraman, "ThyroXAI: An Explainable AI Framework for Early Prediction of Differentiated Thyroid Cancer Recurrence," IEEE, 20XX.`;

export function Publication() {
  const [copied, setCopied] = useState(false);

  return (
    <section id="publication" className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading eyebrow="08 — Publication & Team" title="ThyroXAI: An Explainable AI Framework" />

      <div className="grid lg:grid-cols-5 gap-8 mt-10">
        <Reveal className="lg:col-span-3">
          <div className="card p-6">
            <h3 className="text-sm text-ink-dim mb-3 uppercase tracking-wide">Abstract</h3>
            <p className="text-sm text-ink-dim leading-relaxed">{ABSTRACT}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {KEYWORDS.map((k) => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-bg-raised border border-line text-ink-dim">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-6 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-ink-dim uppercase tracking-wide">Cite this work</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(CITATION);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="text-xs flex items-center gap-1.5 text-teal-soft hover:text-teal"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy IEEE citation"}
              </button>
            </div>
            <p className="mono text-xs text-ink-dim leading-relaxed">{CITATION}</p>
            <a
              href="https://github.com/tulasiram2005/ThyroXAI---DTC-"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-ink-dim hover:text-teal-soft"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View source repository
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-2">
          <div className="card p-6 h-full">
            <h3 className="text-sm text-ink-dim mb-4 uppercase tracking-wide">Authors</h3>
            <ul className="space-y-4">
              {AUTHORS.map((a) => (
                <li key={a.name}>
                  <div className="text-ink text-sm">{a.name}</div>
                  <div className="text-xs text-ink-faint mt-0.5">{a.dept}</div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
