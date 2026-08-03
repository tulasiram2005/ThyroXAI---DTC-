import { SectionHeading, Reveal } from "@/components/Reveal";
import { ShieldAlert } from "lucide-react";

const POINTS = [
  "Limit unnecessary radiation exposure, especially childhood neck and head imaging.",
  "Ensure adequate dietary iodine — both deficiency and excess are risk factors.",
  "Routine neck self-exams and thyroid function screening for at-risk groups (family history, prior radiation).",
  "Maintain a healthy weight and avoid smoking.",
  "Regular follow-up ultrasound and thyroglobulin monitoring for post-treatment patients, per ATA guidelines.",
];

export function ClinicalInsights() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 border-t border-line">
      <SectionHeading
        eyebrow="07 — Clinical Insights"
        title="Reducing thyroid cancer risk"
        subtitle="Evidence-based, general prevention and awareness points that complement — not replace — clinical judgment."
      />
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <Reveal>
          <ul className="space-y-4">
            {POINTS.map((pt, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-dim leading-relaxed">
                <span className="mono text-teal-soft shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {pt}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card p-6 border-indigo/30 bg-indigo/5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-indigo-soft" />
              <h3 className="text-ink font-medium">Not a diagnostic device</h3>
            </div>
            <p className="text-sm text-ink-dim leading-relaxed">
              ThyroXAI is a research and educational clinical decision-support tool. It does not
              replace clinical judgment, laboratory confirmation, or a licensed physician's
              diagnosis. Predictions from the live demo on this site are illustrative and must
              never be used to make real medical decisions.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
