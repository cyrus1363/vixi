"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@vixi/ui";
import { createWishSchema, type CreateWishInput } from "@/lib/validations";

const CATEGORY_OPTIONS = [
  { value: "FUNERAL_PREFERENCE", label: "Funeral Preference" },
  { value: "BURIAL_CREMATION", label: "Burial / Cremation" },
  { value: "PEOPLE_TO_NOTIFY", label: "People to Notify" },
  { value: "PET_CARE", label: "Pet Care" },
  { value: "DIGITAL_ACCOUNTS", label: "Digital Accounts" },
  { value: "LEGAL_NOTES", label: "Legal Notes" },
  { value: "OTHER", label: "Other" },
] as const;

type WishFormProps = {
  defaultValues?: Partial<CreateWishInput>;
  wishId?: string;
};

export function WishForm({ defaultValues, wishId }: WishFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWishInput>({
    resolver: zodResolver(createWishSchema),
    defaultValues,
  });

  async function onSubmit(data: CreateWishInput) {
    const url = wishId ? `/api/wishes/${wishId}` : "/api/wishes";
    const method = wishId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const wish = await res.json();
      router.push(`/wishes/${wish.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-vixi-dark">
          Category
        </label>
        <select
          {...register("category")}
          className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
        >
          <option value="">Select a category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-vixi-dark">
          Title
        </label>
        <input
          {...register("title")}
          className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
          placeholder="e.g. Burial instructions"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-vixi-dark">
          Details
        </label>
        <textarea
          {...register("body")}
          rows={6}
          className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixi-teal"
          placeholder="Describe your wishes in detail…"
        />
        {errors.body && (
          <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : wishId ? "Save Changes" : "Add Wish"}
      </Button>
    </form>
  );
}
