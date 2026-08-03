// Retrieval-Augmented "Grounding" for the live demo. This retrieves the
// k nearest real patient records (from a 500-row sample of the actual
// dataset, preprocessed the same way as the model) by Euclidean distance
// in the standardized feature space — the same similarity notion as
// Eq. (6)-(7) in the paper: Sim(xq, xi) = 1 / (1 + d(xq, xi)).

export interface SampleRecord {
  Age: number;
  Gender: string;
  Country: string;
  Ethnicity: string;
  Family_History: string;
  Radiation_Exposure: string;
  Iodine_Deficiency: string;
  Smoking: string;
  Obesity: string;
  Diabetes: string;
  TSH_Level: number;
  T3_Level: number;
  T4_Level: number;
  Nodule_Size: number;
  Diagnosis: "Benign" | "Malignant";
  vec: number[];
}

let sampleCache: SampleRecord[] | null = null;

export async function loadSample(): Promise<SampleRecord[]> {
  if (!sampleCache) {
    const data = await fetch("/data/rag_sample.json").then((r) => r.json());
    sampleCache = data.records as SampleRecord[];
  }
  return sampleCache;
}

function euclidean(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

export interface RetrievedCase extends SampleRecord {
  similarity: number;
  distance: number;
}

export function retrieveSimilar(
  x: number[],
  pool: SampleRecord[],
  k = 5
): RetrievedCase[] {
  const scored = pool.map((r) => {
    const distance = euclidean(x, r.vec);
    return { ...r, distance, similarity: 1 / (1 + distance) };
  });
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, k);
}
