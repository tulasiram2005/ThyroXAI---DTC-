import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "ThyroXAI — Explainable AI for Thyroid Cancer Recurrence",
  description:
    "ThyroXAI: An Explainable AI Framework for Early Prediction of Differentiated Thyroid Cancer Recurrence. ExtraTrees + SHAP + RAG, 95.87% accuracy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <Nav />
        {children}
      </body>
    </html>
  );
}
