import Link from "next/link";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { SAMPLE_PATIENT_CASE as p } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const FIELDS: [string, string | number][] = [
  ["Patient Index", p.patientIndex],
  ["Age", p.age],
  ["Gender", p.gender],
  ["Country", p.country],
  ["Ethnicity", p.ethnicity],
  ["Family History", p.familyHistory],
  ["Radiation Exposure", p.radiationExposure],
  ["Iodine Deficiency", p.iodineDeficiency],
  ["Smoking", p.smoking],
  ["Obesity", p.obesity],
  ["Diabetes", p.diabetes],
  ["TSH Level", `${p.tsh} mIU/L`],
  ["T3 Level", `${p.t3} nmol/L`],
  ["T4 Level", `${p.t4} µg/dL`],
  ["Nodule Size", `${p.noduleSize} cm`],
  ["Thyroid Cancer Risk", p.risk],
];

export function RagSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="06 — RAG-Based Case Retrieval"
        title="Every prediction comes with evidence"
        subtitle="For a query patient, RAG retrieves the k most clinically similar historical cases in feature space, plus relevant domain knowledge, so a physician can see why (Eq. 6–8, Fig. 8–9)."
      />

      <div className="grid lg:grid-cols-5 gap-5 mt-10">
        <Reveal className="lg:col-span-3">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-ink-dim uppercase tracking-wide">
                Re-Test Case 1 · Sample Patient Index {p.patientIndex}
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal/15 text-teal-soft border border-teal/30">
                Prediction: {p.prediction}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
              {FIELDS.map(([k, v]) => (
                <div key={k}>
                  <div className="text-ink-faint">{k}</div>
                  <div className="text-ink mono">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-line text-sm text-ink-dim leading-relaxed">
              Based on {p.similarCases} similar historical cases: all {p.similarCases} similar
              patients had a <strong className="text-ink">Benign</strong> diagnosis. Average
              similar-case TSH was <strong className="text-ink">{p.similarAvgTsh} mIU/L</strong>{" "}
              and nodule size <strong className="text-ink">{p.similarAvgNodule} cm</strong> — close
              to this patient's own values, which is why the retrieval is used as supporting
              evidence for the model's prediction.
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-2">
          <div className="card p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm text-ink-dim mb-3 uppercase tracking-wide">
                PCA Projection of Retrieval (Fig. 8)
              </h3>
              <p className="text-sm text-ink-dim leading-relaxed">
                Two-dimensional PCA of the feature space visually separates benign and malignant
                clusters. The new patient and its five nearest neighbours land close together —
                evidence that the retrieval is finding clinically similar records, not noise.
              </p>
            </div>
            <Link
              href="/predict"
              className="mt-6 inline-flex items-center gap-2 text-sm text-teal-soft hover:text-teal transition-colors"
            >
              Run this retrieval yourself on the live demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
