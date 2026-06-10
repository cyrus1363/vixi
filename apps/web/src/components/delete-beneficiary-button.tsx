"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vixi/ui";

type DeleteBeneficiaryButtonProps = {
  beneficiaryId: string;
  beneficiaryName: string;
};

export function DeleteBeneficiaryButton({
  beneficiaryId,
  beneficiaryName,
}: DeleteBeneficiaryButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/beneficiaries/${beneficiaryId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to delete");
      setDeleting(false);
      return;
    }
    router.push("/beneficiaries");
    router.refresh();
  }

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        Delete beneficiary
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Are you sure you want to remove{" "}
        <span className="font-semibold">{beneficiaryName}</span> from your
        beneficiaries? This action cannot be undone.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setConfirming(false)}
          disabled={deleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
