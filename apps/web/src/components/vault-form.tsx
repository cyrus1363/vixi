"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@vixi/ui";
import {
  createVaultSchema,
  updateVaultSchema,
  type CreateVaultInput,
  type UpdateVaultInput,
} from "@/lib/validations";
import { VaultType, VaultStatus } from "@prisma/client";

type VaultFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateVaultInput>;
  vaultId?: string;
};

const VAULT_TYPE_OPTIONS: { value: VaultType; label: string }[] = [
  { value: VaultType.GENERAL, label: "General" },
  { value: VaultType.WILL, label: "Will" },
  { value: VaultType.INSURANCE, label: "Insurance" },
  { value: VaultType.FINANCIAL, label: "Financial" },
  { value: VaultType.DIGITAL_ASSETS, label: "Digital Assets" },
  { value: VaultType.MESSAGES, label: "Messages" },
];

const VAULT_STATUS_OPTIONS: { value: VaultStatus; label: string }[] = [
  { value: VaultStatus.ACTIVE, label: "Active" },
  { value: VaultStatus.SEALED, label: "Sealed" },
  { value: VaultStatus.UNLOCKED, label: "Unlocked" },
];

export function VaultForm({ mode, defaultValues, vaultId }: VaultFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = mode === "create" ? createVaultSchema : updateVaultSchema;
  type FormValues = CreateVaultInput | UpdateVaultInput;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      type: VaultType.GENERAL,
      status: VaultStatus.ACTIVE,
      ...defaultValues,
    } as FormValues,
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const url =
      mode === "create" ? "/api/vaults" : `/api/vaults/${vaultId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const rawUnlock = data.unlockDate as unknown;
    let unlockDate: Date | undefined;
    if (typeof rawUnlock === "string" && rawUnlock.length > 0) {
      unlockDate = new Date(rawUnlock);
    }

    const payload: Record<string, unknown> = { ...data };
    if (unlockDate) {
      payload.unlockDate = unlockDate;
    } else {
      delete payload.unlockDate;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setServerError(err.error || "Something went wrong");
      return;
    }

    const result = mode === "create" ? await res.json() : null;
    const target = mode === "create" ? `/vaults/${result.id}` : "/vaults";
    router.push(target);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-vixi-dark"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="My important vault"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-vixi-dark"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="What goes in this vault?"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message as string}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-vixi-dark"
          >
            Type
          </label>
          <select
            id="type"
            {...register("type")}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          >
            {VAULT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-vixi-dark"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          >
            {VAULT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="unlockDate"
          className="block text-sm font-medium text-vixi-dark"
        >
          Unlock date (optional)
        </label>
        <input
          id="unlockDate"
          type="datetime-local"
          {...register("unlockDate")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
        />
        {errors.unlockDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.unlockDate.message as string}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create vault"
              : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
