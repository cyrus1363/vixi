"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vixi/ui";

export default function ConsentPage() {
  const [legalAdvice, setLegalAdvice] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/onboarding/consent", { method: "POST" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vixi-cream p-8">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-vixi-dark">
          Before you continue
        </h1>
        <p className="mt-3 text-sm text-vixi-stone">
          Please read and confirm the following before using Vixi.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={legalAdvice}
              onChange={(e) => setLegalAdvice(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-vixi-teal"
            />
            <span className="text-sm text-vixi-dark">
              I understand that Vixi does <strong>not</strong> provide legal
              advice and does not create a legally binding will or testament.
              I will consult a qualified attorney for legal documents.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-vixi-teal"
            />
            <span className="text-sm text-vixi-dark">
              I accept the Terms of Service and Privacy Policy.
            </span>
          </label>
          <Button
            type="submit"
            disabled={!legalAdvice || !terms || loading}
            className="w-full"
          >
            {loading ? "Saving…" : "Continue to Vixi"}
          </Button>
        </form>
      </div>
    </main>
  );
}
