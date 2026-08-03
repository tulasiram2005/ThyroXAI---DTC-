// All figures below are transcribed directly from the ThyroXAI paper
// (Tables I-V, Figs. 1-9). Nothing here is invented.

export const HEADLINE_STATS = [
  { label: "Accuracy", value: "95.87%" },
  { label: "F1 Score", value: "95.52%" },
  { label: "AUC", value: "0.9894" },
  { label: "Patient Records", value: "2,12,691" },
];

export const AUTHORS = [
  { name: "Bajantri Chikulaguri Tulasi Ram", dept: "Dept. of Computing Technologies, SRMIST Kattankulathur" },
  { name: "Saravanan Parthasarathy", dept: "Dept. of Computing Technologies, SRMIST Kattankulathur" },
  { name: "Venkata Sai Siddardh Seera", dept: "Dept. of Computing Technologies, SRMIST Kattankulathur" },
  { name: "M.I. Glad Mohesh", dept: "Dept. of Physiology, Sri Balaji Vidyapeeth (SBV), Chennai" },
  { name: "Vaishnavi Jayaraman", dept: "Dept. of Computing Technologies, SRMIST Kattankulathur" },
];

export const DATASET_STATS = {
  totalRecords: 212691,
  features: 17,
  malignant: 49495,
  malignantPct: 23.3,
  benign: 163196,
  benignPct: 76.7,
  source: "Kaggle — Thyroid Cancer Risk Dataset (Chirumamilla, 2021)",
};

export const RISK_DISTRIBUTION = [
  { risk: "Low", count: 106000 },
  { risk: "Medium", count: 73000 },
  { risk: "High", count: 33691 },
];

export const COUNTRY_DISTRIBUTION = [
  { country: "India", pct: 20 },
  { country: "China", pct: 15 },
  { country: "Nigeria", pct: 15 },
  { country: "Brazil", pct: 10 },
  { country: "Russia", pct: 10 },
  { country: "Japan", pct: 7.5 },
  { country: "South Korea", pct: 7.5 },
  { country: "Germany", pct: 5 },
  { country: "USA", pct: 5 },
  { country: "UK", pct: 5 },
];

export const DATASET_ATTRIBUTES = [
  { attr: "Patient_ID", desc: "Unique patient identifier" },
  { attr: "Age", desc: "Age of the patient (range: 15–89 years)" },
  { attr: "Gender", desc: "Sex of the patient [Male, Female]" },
  { attr: "Country", desc: "Country of patient origin [10 countries]" },
  { attr: "Ethnicity", desc: "Patient ethnicity [African, Asian, Caucasian, Hispanic, Middle Eastern]" },
  { attr: "Family_History", desc: "Family history of thyroid disease [Yes, No]" },
  { attr: "Radiation_Exposure", desc: "Radiation exposure history [Yes, No]" },
  { attr: "Iodine_Deficiency", desc: "Presence of iodine deficiency [Yes, No]" },
  { attr: "Smoking", desc: "Smoking status of the patient [Yes, No]" },
  { attr: "Obesity", desc: "Obesity status of the patient [Yes, No]" },
  { attr: "Diabetes", desc: "Diabetes status of the patient [Yes, No]" },
  { attr: "TSH_Level", desc: "Thyroid-stimulating hormone level (0.10–10.00 mIU/L)" },
  { attr: "T3_Level", desc: "Triiodothyronine hormone level (0.50–3.50 nmol/L)" },
  { attr: "T4_Level", desc: "Thyroxine hormone level (4.50–12.00 µg/dL)" },
  { attr: "Nodule_Size", desc: "Size of thyroid nodule (0.00–5.00 cm)" },
  { attr: "Thyroid_Cancer_Risk", desc: "Clinical risk classification [Low, Medium, High]" },
  { attr: "Diagnosis", desc: "Target variable: [Benign, Malignant]" },
];

export const PIPELINE_STEPS = [
  {
    title: "Data Preprocessing",
    detail: "Missing-value handling, label encoding of categorical fields, Z-score normalization of hormone levels and nodule size.",
  },
  {
    title: "Train / Test Split",
    detail: "80% training / 20% held-out testing, stratified on the Diagnosis label.",
  },
  {
    title: "SMOTE-ENN Balancing",
    detail: "SMOTE synthesizes minority-class (Malignant) samples; Edited Nearest Neighbours removes noisy borderline samples to leave a clean, balanced training set.",
  },
  {
    title: "Two-Stage Feature Selection",
    detail: "Mutual Information ranks features, then Recursive Feature Elimination searches for the subset F* maximizing α·AUC + β·F1.",
  },
  {
    title: "9 Candidate Models",
    detail: "Decision Tree, Random Forest, AdaBoost, XGBoost, HistGradientBoosting, CatBoost, ExtraTrees, TabNet, and a Keras ANN are trained and compared.",
  },
  {
    title: "ExtraTrees Selected",
    detail: "ExtraTrees wins on accuracy, AUC, stability across feature subsets, and runtime — the extreme randomization of features and thresholds reduces variance.",
  },
  {
    title: "SHAP Explainability",
    detail: "TreeExplainer computes per-feature Shapley contributions for every prediction, both locally (per patient) and globally (population-level).",
  },
  {
    title: "RAG Module",
    detail: "Retrieves the k most similar historical cases in feature space, plus relevant medical knowledge, to support the prediction with evidence.",
  },
  {
    title: "Final Output",
    detail: "Recurrence risk score, SHAP-based feature attributions, and retrieved similar cases are returned together as clinical decision support.",
  },
];

export const MODEL_METRICS = [
  { model: "ExtraTrees", accuracy: 95.87, precision: 95.26, recall: 95.8, f1: 95.52, auc: 0.9894, logLoss: 0.2223, runTime: 24.8 },
  { model: "RandomForest", accuracy: 93.05, precision: 91.81, recall: 93.9, f1: 92.61, auc: 0.9758, logLoss: 0.247, runTime: 67.59 },
  { model: "CatBoost", accuracy: 92.06, precision: 90.8, recall: 93.54, f1: 91.65, auc: 0.9508, logLoss: 0.2217, runTime: 54.42 },
  { model: "XGBoost", accuracy: 89.77, precision: 88.65, recall: 91.72, f1: 89.35, auc: 0.941, logLoss: 0.2548, runTime: 3.54 },
  { model: "HistGradientBoosting", accuracy: 88.05, precision: 87.2, recall: 90.42, f1: 87.64, auc: 0.935, logLoss: 0.2764, runTime: 4.52 },
  { model: "Decision Tree", accuracy: 85.51, precision: 84.34, recall: 83.79, f1: 84.05, auc: 0.8379, logLoss: 5.2231, runTime: 3.83 },
  { model: "Keras ANN", accuracy: 77.73, precision: 75.96, recall: 77.43, f1: 76.42, auc: 0.8607, logLoss: 0.4111, runTime: 712.7 },
  { model: "TabNet", accuracy: 75.82, precision: 78.41, recall: 80.42, f1: 75.68, auc: 0.8488, logLoss: 0.4108, runTime: 390.08 },
  { model: "AdaBoost", accuracy: 71.63, precision: 68.89, recall: 66.68, f1: 67.29, auc: 0.7992, logLoss: 0.6044, runTime: 12.83 },
];

export const CONFUSION_MATRIX = {
  trueNegative: 13994,
  falsePositive: 625,
  falseNegative: 1021,
  truePositive: 25565,
};

export const PRIOR_WORK_COMPARISON = [
  { author: "Amelia et al.", model: "XGBoost", accuracy: 69.85, f1: 69, auc: 0.8597 },
  { author: "Manda et al.", model: "CatBoost", accuracy: 88, f1: 85, auc: 0.9 },
  { author: "ThyroXAI (Proposed)", model: "SMOTEENN + MI/RFE + ExtraTrees + SHAP + RAG", accuracy: 95.87, f1: 95.52, auc: 0.9894 },
];

export const SHAP_TABLE = [
  { feature: "Ethnicity", meanAbsShap: 0.1012, interpretation: "Most influential feature affecting recurrence prediction" },
  { feature: "Family History", meanAbsShap: 0.0929, interpretation: "Strong contributor indicating genetic predisposition" },
  { feature: "Iodine Deficiency", meanAbsShap: 0.0739, interpretation: "Significant clinical factor associated with recurrence" },
  { feature: "Country", meanAbsShap: 0.0583, interpretation: "Geographic and demographic influence on prediction" },
  { feature: "Radiation Exposure", meanAbsShap: 0.0468, interpretation: "Important environmental risk factor" },
  { feature: "Age", meanAbsShap: 0.0156, interpretation: "Moderate contribution toward recurrence risk" },
  { feature: "Nodule Size", meanAbsShap: 0.0145, interpretation: "Larger nodules slightly increase recurrence probability" },
  { feature: "T3 Level", meanAbsShap: 0.0144, interpretation: "Hormonal level contributes to prediction outcome" },
  { feature: "TSH Level", meanAbsShap: 0.0142, interpretation: "Thyroid-stimulating hormone influences recurrence" },
  { feature: "T4 Level", meanAbsShap: 0.0139, interpretation: "Moderate biochemical contribution" },
  { feature: "Obesity", meanAbsShap: 0.011, interpretation: "Minor influence on recurrence prediction" },
  { feature: "Gender", meanAbsShap: 0.0107, interpretation: "Slight contribution to model decisions" },
  { feature: "Diabetes", meanAbsShap: 0.009, interpretation: "Low but noticeable impact on prediction" },
  { feature: "Smoking", meanAbsShap: 0.0073, interpretation: "Least influential feature among selected attributes" },
];

export const FEATURE_REDUCTION = [
  { features: 14, ExtraTrees: 95.9, RandomForest: 93.1, CatBoost: 92.1, XGBoost: 89.8, DecisionTree: 85.5 },
  { features: 12, ExtraTrees: 95.7, RandomForest: 92.6, CatBoost: 91.6, XGBoost: 89.1, DecisionTree: 84.6 },
  { features: 10, ExtraTrees: 95.4, RandomForest: 91.8, CatBoost: 90.7, XGBoost: 87.9, DecisionTree: 82.9 },
  { features: 8, ExtraTrees: 95.0, RandomForest: 90.5, CatBoost: 89.1, XGBoost: 85.6, DecisionTree: 79.8 },
  { features: 7, ExtraTrees: 94.6, RandomForest: 88.2, CatBoost: 86.4, XGBoost: 81.2, DecisionTree: 74.1 },
  { features: 6, ExtraTrees: 88.9, RandomForest: 76.4, CatBoost: 74.8, XGBoost: 70.5, DecisionTree: 63.2 },
  { features: 4, ExtraTrees: 84.1, RandomForest: 68.7, CatBoost: 67.3, XGBoost: 62.9, DecisionTree: 57.0 },
];

export const SAMPLE_PATIENT_CASE = {
  patientIndex: 100,
  age: 62,
  gender: "Female",
  country: "Nigeria",
  ethnicity: "Hispanic",
  familyHistory: "No",
  radiationExposure: "No",
  iodineDeficiency: "No",
  smoking: "No",
  obesity: "No",
  diabetes: "No",
  tsh: 9.29,
  t3: 1.84,
  t4: 6.26,
  noduleSize: 3.91,
  risk: "Medium",
  prediction: "Benign",
  similarCases: 5,
  similarAvgTsh: 8.91,
  similarAvgNodule: 3.6,
};

export const REFERENCES_PREVIEW = [
  "Hall, J. E. (2021). Guyton and Hall Textbook of Medical Physiology (14th ed.). Elsevier.",
  "Siegel, R. L., Miller, K. D., & Jemal, A. (2020). Cancer statistics, 2020. CA: A Cancer Journal for Clinicians, 70(1), 7–30.",
  "Schlumberger, M., & Leboulleux, S. (2021). Current practice in patients with differentiated thyroid cancer. Nature Reviews Endocrinology, 17(3), 176–188.",
  "Cooper, D. S., et al. (2009). Revised ATA management guidelines for patients with thyroid nodules and DTC. Thyroid, 19(11), 1167–1214.",
  "Senyer Yapici, I., & Uzun Arslan, R. (2025). Predictive analytics for thyroid cancer recurrence. EPJ Special Topics, 234, 4751–4771.",
  "Chirumamilla, B. (2021). Thyroid Cancer Risk Dataset. Kaggle.",
];
