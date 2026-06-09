"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckInStatus } from "@prisma/client";
import { Button } from "@vixi/ui";
import {
  createCheckInSchema,
  updateCheckInSchema,
  type CreateCheckInInput,
  type UpdateCheckInInput,
} from "@/lib/validations";

type CheckInFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateCheckInInput>;
  checkInId?: string;
};

const toLocalInputValue = (d: Date | string | undefined): string => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function CheckInForm({
  mode,
  defaultValues,
  checkInId,
}: CheckInFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema =
    mode === "create" ? createCheckInSchema : updateCheckInSchema;
  type FormValues = CreateCheckInInput | UpdateCheckInInput;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scheduledAt: new Date() as unknown as string,
      status: CheckInStatus.PENDING,
      ...defaultValues,
    } as FormValues,
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const url =
      mode === "create" ? "/api/check-ins" : `/api/check-ins/${checkInId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const payload: Record<string, unknown> = {
      scheduledAt: data.scheduledAt,
    };
    if (data.status) {
      payload.status = data.status;
    }
    if (data.completedAt) {
      payload.completedAt = data.completedAt;
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
      mode === "create" ? `/check-ins/${result.id}` : "/check-ins";
    router.push(target);
    router.refresh();
  }

  const scheduledDefault = toLocalInputValue(
    defaultValues?.scheduledAt as Date | string | undefined
  );
  const completedDefault = toLocalInputValue(
    defaultValues?.completedAt as Date | string | undefined
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="scheduledAt"
          className="block text-sm font-medium text-vixi-dark"
        >
          Scheduled date & time
        </label>
        <input
          id="scheduledAt"
          type="datetime-local"
          defaultValue={scheduledDefault}
          {...register("scheduledAt")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
        />
        {errors.scheduledAt && (
          <p className="mt-1 text-sm text-red-600">
            {errors.scheduledAt.message as string}
          </p>
        )}
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
          <option value="PENDING">Pending</option>
          <option value="RESPONDED">Responded</option>
          <option value="MISSED">Missed</option>
          <option value="ESCALATED">Escalated</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">
            {errors.status.message as string}
          </p>
        )}
      </div>

      {mode === "edit" && (
        <div>
          <label
            htmlFor="completedAt"
            className="block text-sm font-medium text-vixi-dark"
          >
            Completed at (optional)
          </label>
          <input
            id="completedAt"
            type="datetime-local"
            defaultValue={completedDefault}
            {...register("completedAt")}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-vixi-teal focus:ring-1 focus:ring-vixi-teal"
          />
          {errors.completedAt && (
            <p className="mt-1 text-sm text-red-600">
              {errors.completedAt.message as string}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Schedule check-in"
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
