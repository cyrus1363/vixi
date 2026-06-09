import { describe, it, expect } from "vitest";
import { createCheckInSchema, updateCheckInSchema } from "../check-in";
import { CheckInStatus } from "@prisma/client";

describe("createCheckInSchema", () => {
  it("accepts a valid check-in with required field only", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "2026-12-31T00:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a check-in with all fields", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "2026-12-31T00:00:00Z",
      status: CheckInStatus.PENDING,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing scheduledAt", () => {
    const result = createCheckInSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid date string", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status enum", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "2026-12-31T00:00:00Z",
      status: "INVALID_STATUS",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict mode)", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "2026-12-31T00:00:00Z",
      hackerField: "evil",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to PENDING when omitted", () => {
    const result = createCheckInSchema.safeParse({
      scheduledAt: "2026-12-31T00:00:00Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe(CheckInStatus.PENDING);
    }
  });
});

describe("updateCheckInSchema", () => {
  it("accepts an empty object", () => {
    const result = updateCheckInSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a status-only update", () => {
    const result = updateCheckInSchema.safeParse({
      status: CheckInStatus.RESPONDED,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a completedAt update", () => {
    const result = updateCheckInSchema.safeParse({
      completedAt: "2026-12-31T00:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields in update", () => {
    const result = updateCheckInSchema.safeParse({ hackerField: "evil" });
    expect(result.success).toBe(false);
  });
});
