"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@vixi/ui";
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
  type CreateBeneficiaryInput,
  type UpdateBeneficiaryInput,
} from "@/lib/validations";

type BeneficiaryFormProps =
  | { mode: "create"; defaultValues?: Partial<CreateBeneficiaryInput> }
  | {
      mode: "edit";
      beneficiaryId: string;
      defaultValues: Partial<CreateBeneficiaryInput>;
    };

export function BeneficiaryForm(props: BeneficiaryFormProps) {
  const { mode, defaultValues } = props;
  const beneficiaryId = mode === "edit" ? props.beneficiaryId : undefined;
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema =
    mode === "create" ? createBeneficiarySchema : updateBeneficiarySchema;
  type FormValues = CreateBeneficiaryInput | UpdateBeneficiaryInput;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      relationship: "",
      trusted: false,
      role: "BENEFICIARY",
      accessLevel: "NONE",
      inviteStatus: "NOT_INVITED",
      ...defaultValues,
    } as FormValues,
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const url =
      mode === "create"
        ? "/api/beneficiaries"
        : `/api/beneficiaries/${beneficiaryId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const payload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      trusted: data.trusted ?? false,
    };
    if (typeof data.phone === "string" && data.phone.length > 0) {
      payload.phone = data.phone;
    }
    if (typeof data.relationship === "string" && data.relationship.length > 0) {
      payload.relationship = data.relationship;
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
    const target =
      mode === "create" ? `/beneficiaries/${result.id}` : "/beneficiaries";
    router.push(target);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-vixi-dark"
        >
          Full name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="Jane Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-vixi-dark"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-vixi-dark"
        >
          Phone (optional)
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="+1-555-0123"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phone.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="relationship"
          className="block text-sm font-medium text-vixi-dark"
        >
          Relationship (optional)
        </label>
        <input
          id="relationship"
          type="text"
          {...register("relationship")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="Spouse, sibling, friend…"
        />
        {errors.relationship && (
          <p className="mt-1 text-sm text-red-600">
            {errors.relationship.message as string}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="trusted"
          type="checkbox"
          {...register("trusted")}
          className="h-4 w-4 rounded border-stone-300 text-vixi-teal focus:ring-vixi-teal"
        />
        <label htmlFor="trusted" className="text-sm text-vixi-dark">
          Mark as trusted beneficiary
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-vixi-dark">Role</label>
        <select
          {...register("role")}
          className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
        >
          <option value="BENEFICIARY">Beneficiary</option>
          <option value="EXECUTOR">Executor</option>
          <option value="EMERGENCY_CONTACT">Emergency Contact</option>
          <option value="MEMORY_RECIPIENT">Memory Recipient</option>
          <option value="PET_CARETAKER">Pet Caretaker</option>
          <option value="FUNERAL_CONTACT">Funeral Contact</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-vixi-dark">Access Level</label>
        <select
          {...register("accessLevel")}
          className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
        >
          <option value="NONE">None</option>
          <option value="SUMMARY">Summary</option>
          <option value="SPECIFIC_ITEMS">Specific Items</option>
          <option value="FULL_AFTER_RELEASE">Full After Release</option>
        </select>
        <p className="mt-1 text-xs text-vixi-stone">
          Notifications and access grants are not automatic — these settings take effect when release rules are configured.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Add beneficiary"
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
