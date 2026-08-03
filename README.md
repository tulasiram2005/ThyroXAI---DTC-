# ThyroXAI — Presentation Web App

Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + Recharts
site for the paper *"ThyroXAI: An Explainable AI Framework for Early
Prediction of Differentiated Thyroid Cancer Recurrence."*

## What's real vs. illustrative

- Every chart, table, and stat on the landing page (`/`) is transcribed
  directly from the paper's Tables I–V and Figures 1–9. See `lib/constants.ts`.
- The live demo at `/predict` runs a **real** ExtraTreesClassifier —
  trained with scikit-learn on the exact LabelEncode → Z-score pipeline in
  the paper's Section IV, then exported tree-by-tree to `public/data/forest.json`
  and executed entirely client-side (no backend, no `Math.random()`).
  It is a smaller sibling of the paper's model (trained on a subsample so
  it ships as a ~2MB static file) — its own held-out accuracy is ≈79% vs.
  the paper's 95.87%. This is disclosed on the page itself.
- The SHAP beeswarm plot uses **real** `shap.TreeExplainer` output computed
  against that same demo model (`public/data/shap_beeswarm.json`).
- The "similar cases" RAG retrieval runs real nearest-neighbor search
  against 500 real (bundled) patient records from the dataset
  (`public/data/rag_sample.json`).

## Local development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub (or use the existing
   `tulasiram2005/ThyroXAI---DTC-` repo — put this app in a subfolder or a
   new branch, your call).
2. Go to https://vercel.com/new and import the repo.
3. Framework preset: Next.js (auto-detected). No environment variables
   needed. Click **Deploy**.
4. Vercel will redeploy automatically on every push to the connected branch.

No serverless functions or external APIs are required — the whole app,
including the "live" model, is static + client-side JS.
