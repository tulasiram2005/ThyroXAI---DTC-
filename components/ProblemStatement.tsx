import { SectionHeading, Reveal } from "@/components/Reveal";
import { AlertTriangle, UserCog, EyeOff } from "lucide-react";

const CARDS = [
  {
    icon: AlertTriangle,
    title: "Late Detection Risk",
    body: "DTC recurrence rates run 10–30%. Early symptoms are mild or absent, so most cases surface incidentally, when imaging is done for unrelated reasons.",
  },
  {
    icon: UserCog,
    title: "Clinician-Dependent Diagnostics",
    body: "Physical exam, serum thyroid function tests, ultrasonography, and fine-needle aspiration cytology remain the standard — but results can be inconsistent across clinicians.",
  },
  {
    icon: EyeOff,
    title: "Lack of Explainability",
    body: "Most existing AI models optimize purely for accuracy, without surfacing why a prediction was made — which limits clinical trust even when the numbers look strong.",
  },
];

export function ProblemStatement() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeading
        eyebrow="01 — The Problem"
        title="Traditional staging can't capture the full picture"
        subtitle="Differentiated thyroid cancer is over 90% of thyroid carcinoma cases and usually carries a good prognosis — but recurrence, when it happens, is hard to see coming with conventional tools."
      />
      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="card p-6 h-full hover:border-teal/40 transition-colors">
              <c.icon className="w-6 h-6 text-teal-soft mb-4" strokeWidth={1.5} />
              <h3 className="text-lg text-ink mb-2 font-medium">{c.title}</h3>
              <p className="text-sm text-ink-dim leading-relaxed">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
