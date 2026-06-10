"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vixi/ui";

type DeleteWishButtonProps = {
  wishId: string;
  wishTitle: string;
};

export function DeleteWishButton({ wishId, wishTitle }: DeleteWishButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    setArchiving(true);
    setError(null);
    const res = await fetch(`/api/wishes/${wishId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to archive");
      setArchiving(false);
      return;
    }
    router.push("/wishes");
    router.refresh();
  }

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        Archive wish
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Archive{" "}
        <span className="font-semibold">{wishTitle}</span>? It will no longer
        appear in your wishes list.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <Button
          variant="destructive"
          onClick={handleArchive}
          disabled={archiving}
        >
          {archiving ? "Archiving…" : "Yes, archive"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setConfirming(false)}
          disabled={archiving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
