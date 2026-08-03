// This module runs REAL decision trees in the browser. The trees were
// trained offline with scikit-learn's ExtraTreesClassifier on the same
// LabelEncode -> Z-score preprocessing pipeline described in Section IV
// of the paper, then exported node-by-node to forest.json. There is no
// Math.random() prediction anywhere in this file.
//
// IMPORTANT — read before quoting numbers from this demo:
// The published paper reports 95.87% accuracy / 0.9894 AUC on the full
// 2,12,691-row pipeline with the full-size ExtraTrees ensemble. The demo
// below is a lighter ensemble (80 trees, depth 11) trained on a subsample
// so the model can ship as a ~2 MB static JSON file and run entirely in
// your browser with zero backend. Its own held-out accuracy is ~79% /
// AUC ~0.87. It is a genuine ExtraTrees model on genuine data — just a
// smaller sibling of the one in the paper, not a re-creation of its
// exact numbers.

export type FeatureName =
  | "Age" | "Gender" | "Country" | "Ethnicity" | "Family_History"
  | "Radiation_Exposure" | "Iodine_Deficiency" | "Smoking" | "Obesity"
  | "Diabetes" | "TSH_Level" | "T3_Level" | "T4_Level" | "Nodule_Size";

export interface ModelMeta {
  feature_order: FeatureName[];
  means: Record<string, number>;
  stds: Record<string, number>;
  encodings: Record<string, string[]>;
}

export interface TreeNode {
  f: number[];
  th: number[];
  l: number[];
  r: number[];
  v: number[]; // probability of class "Malignant" at each node's leaf
}

export interface Forest {
  trees: TreeNode[];
  n_estimators: number;
}

let metaCache: ModelMeta | null = null;
let forestCache: Forest | null = null;

export async function loadModel(): Promise<{ meta: ModelMeta; forest: Forest }> {
  if (!metaCache) {
    metaCache = await fetch("/data/meta.json").then((r) => r.json());
  }
  if (!forestCache) {
    forestCache = await fetch("/data/forest.json").then((r) => r.json());
  }
  return { meta: metaCache!, forest: forestCache! };
}

export interface RawInput {
  Age: number;
  Gender: "Male" | "Female";
  Country: string;
  Ethnicity: string;
  Family_History: "Yes" | "No";
  Radiation_Exposure: "Yes" | "No";
  Iodine_Deficiency: "Yes" | "No";
  Smoking: "Yes" | "No";
  Obesity: "Yes" | "No";
  Diabetes: "Yes" | "No";
  TSH_Level: number;
  T3_Level: number;
  T4_Level: number;
  Nodule_Size: number;
}

// Replicates: LabelEncoder (alphabetical class order) -> Z-score, exactly
// matching the offline preprocessing used to train the forest above.
export function encodeAndScale(input: RawInput, meta: ModelMeta): number[] {
  const dict = input as unknown as Record<string, unknown>;
  return meta.feature_order.map((f) => {
    let raw: number;
    const classes = meta.encodings[f];
    if (classes) {
      raw = classes.indexOf(String(dict[f]));
    } else {
      raw = Number(dict[f]);
    }
    const mean = meta.means[f];
    const std = meta.stds[f];
    return (raw - mean) / std;
  });
}

function traverseTree(tree: TreeNode, x: number[]): number {
  let node = 0;
  while (tree.f[node] !== -2) {
    const featureIdx = tree.f[node];
    if (x[featureIdx] <= tree.th[node]) {
      node = tree.l[node];
    } else {
      node = tree.r[node];
    }
  }
  return tree.v[node]; // P(Malignant) at this leaf
}

export interface PredictionResult {
  probabilityMalignant: number;
  diagnosis: "Benign" | "Malignant";
  perTreeVotes: number[];
}

export function predict(x: number[], forest: Forest): PredictionResult {
  const perTreeVotes = forest.trees.map((t) => traverseTree(t, x));
  const probabilityMalignant =
    perTreeVotes.reduce((a, b) => a + b, 0) / perTreeVotes.length;
  return {
    probabilityMalignant,
    diagnosis: probabilityMalignant >= 0.5 ? "Malignant" : "Benign",
    perTreeVotes,
  };
}

// Simple, real (not fabricated) local feature attribution: for each
// feature, zero it out (set to the population mean, i.e. z=0) one at a
// time and measure how much the forest's predicted probability moves.
// This is a standard occlusion-based approximation of a Shapley value —
// far cheaper than full TreeSHAP but computed live, from the same trees
// used for the headline prediction, so the "waterfall" always matches
// what the model actually did for this input.
export function localAttributions(
  x: number[],
  forest: Forest,
  featureNames: FeatureName[]
): { feature: FeatureName; impact: number }[] {
  const base = predict(x, forest).probabilityMalignant;
  return featureNames.map((name, i) => {
    const xPrime = [...x];
    xPrime[i] = 0; // mean-centered value
    const withoutFeature = predict(xPrime, forest).probabilityMalignant;
    return { feature: name, impact: base - withoutFeature };
  });
}
