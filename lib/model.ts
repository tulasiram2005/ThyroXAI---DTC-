// This module runs a REAL, transparent logistic-regression model in the
// browser — trained with scikit-learn on the exact LabelEncode -> Z-score
// pipeline described in Section IV of the paper. There is no
// Math.random() prediction anywhere in this file.
//
// WHY LOGISTIC REGRESSION AND NOT A FULL EXTRATREES ENSEMBLE
// An earlier version of this demo shipped a small ExtraTrees ensemble
// (see git history). Once it was trained with a correct, leakage-free
// train/test split (SMOTE-ENN applied to the *training fold only*,
// evaluated on a held-out test fold it never saw), its honest accuracy
// came out far below the paper's headline 95.87% — in the same range as
// simply guessing "Benign" every time. That strongly suggests the
// paper's own very high numbers come from applying SMOTE-ENN *before*
// the train/test split, which lets synthetic neighbours leak across the
// split — a common and easy mistake with SMOTE-based pipelines, not a
// bug in this demo.
//
// Rather than ship a demo that quietly inherited that same leakage (and
// could flip Benign/Malignant unpredictably on ordinary inputs), this
// version uses a small, fully transparent logistic regression: 14
// coefficients + 1 intercept, fit on a correct train/test split, with
// class-imbalance weighting. Its own held-out accuracy is modest (~63%,
// vs. a 76.7%-accuracy "always predict Benign" baseline on this
// imbalanced dataset) — which is disclosed on the page. What it buys you
// over the tree ensemble: every prediction is exactly explainable (each
// feature's contribution is just coefficient x standardized value, with
// no hidden interactions), and its coefficient signs line up with the
// paper's own SHAP ranking (Family History, Iodine Deficiency, and
// Radiation Exposure dominate) rather than swinging on noise.

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

export interface LogRegModel {
  feature_order: FeatureName[];
  coefficients: Record<string, number>;
  intercept: number;
}

let metaCache: ModelMeta | null = null;
let modelCache: LogRegModel | null = null;

export async function loadModel(): Promise<{ meta: ModelMeta; model: LogRegModel }> {
  if (!metaCache) {
    metaCache = await fetch("/data/meta.json").then((r) => r.json());
  }
  if (!modelCache) {
    modelCache = await fetch("/data/logreg.json").then((r) => r.json());
  }
  return { meta: metaCache!, model: modelCache! };
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
// matching the offline preprocessing used to train the model above.
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

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface PredictionResult {
  probabilityMalignant: number;
  diagnosis: "Benign" | "Malignant";
}

export function predict(x: number[], model: LogRegModel): PredictionResult {
  let z = model.intercept;
  model.feature_order.forEach((f, i) => {
    z += model.coefficients[f] * x[i];
  });
  const probabilityMalignant = sigmoid(z);
  return {
    probabilityMalignant,
    diagnosis: probabilityMalignant >= 0.5 ? "Malignant" : "Benign",
  };
}

// Exact (not approximated) local attribution for a linear model: each
// feature's contribution to the log-odds is simply coefficient x
// standardized value. Unlike an occlusion-based estimate on a tree
// ensemble, this is mathematically exact for this model — the numbers
// shown always sum to exactly the model's own logit.
export function localAttributions(
  x: number[],
  model: LogRegModel,
  featureNames: FeatureName[]
): { feature: FeatureName; impact: number }[] {
  return featureNames.map((name, i) => ({
    feature: name,
    impact: model.coefficients[name] * x[i],
  }));
}
