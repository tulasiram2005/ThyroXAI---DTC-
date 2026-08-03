import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { DatasetOverview } from "@/components/DatasetOverview";
import { Methodology } from "@/components/Methodology";
import { ModelPerformance } from "@/components/ModelPerformance";
import { ShapSection } from "@/components/ShapSection";
import { RagSection } from "@/components/RagSection";
import { ClinicalInsights } from "@/components/ClinicalInsights";
import { Publication } from "@/components/Publication";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ProblemStatement />
      <DatasetOverview />
      <Methodology />
      <ModelPerformance />
      <ShapSection />
      <RagSection />
      <ClinicalInsights />
      <Publication />
      <Footer />
    </main>
  );
}
