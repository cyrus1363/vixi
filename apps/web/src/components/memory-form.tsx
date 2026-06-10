"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@vixi/ui";
import {
  createMemorySchema,
  updateMemorySchema,
  type CreateMemoryInput,
  type UpdateMemoryInput,
} from "@/lib/validations";

type MemoryFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateMemoryInput>;
  memoryId?: string;
};

export function MemoryForm({
  mode,
  defaultValues,
  memoryId,
}: MemoryFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = mode === "create" ? createMemorySchema : updateMemorySchema;
  type FormValues = CreateMemoryInput | UpdateMemoryInput;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      body: "",
      mediaUrl: "",
      tags: [],
      ...defaultValues,
    } as FormValues,
  });

  const tagsArray = Array.isArray(watch("tags")) ? (watch("tags") as string[]) : [];
  const tagsString = tagsArray.join(", ");

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const url =
      mode === "create" ? "/api/memories" : `/api/memories/${memoryId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const payload: Record<string, unknown> = {
      title: data.title,
      body: data.body,
    };

    const tagsInput = (data as Record<string, unknown>).tags;
    if (Array.isArray(tagsInput)) {
      payload.tags = tagsInput;
    } else if (typeof tagsInput === "string" && tagsInput.length > 0) {
      payload.tags = tagsInput
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    } else {
      payload.tags = [];
    }

    if (typeof data.mediaUrl === "string" && data.mediaUrl.length > 0) {
      payload.mediaUrl = data.mediaUrl;
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
    const target = mode === "create" ? `/memories/${result.id}` : "/memories";
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
          htmlFor="title"
          className="block text-sm font-medium text-vixi-dark"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="A special day at the lake"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-vixi-dark"
        >
          Memory
        </label>
        <textarea
          id="body"
          rows={6}
          {...register("body")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="Tell the story of this moment…"
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">
            {errors.body.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="mediaUrl"
          className="block text-sm font-medium text-vixi-dark"
        >
          Media URL (optional)
        </label>
        <input
          id="mediaUrl"
          type="url"
          {...register("mediaUrl")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="https://example.com/photo.jpg"
        />
        {errors.mediaUrl && (
          <p className="mt-1 text-sm text-red-600">
            {errors.mediaUrl.message as string}
          </p>
        )}
        <p className="mt-1 text-xs text-vixi-stone">
          Media uploads are not enabled yet. Save an external reference link (e.g. a shared Google Photos URL).
        </p>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-vixi-dark"
        >
          Tags (optional, comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          defaultValue={tagsString}
          key={tagsString}
          onChange={(e) => {
            const value = e.target.value;
            const parsed = value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            setValue("tags", parsed as never, { shouldValidate: false });
          }}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          placeholder="family, 2020, summer"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Save memory"
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
