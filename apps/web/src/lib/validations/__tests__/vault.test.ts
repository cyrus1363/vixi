import { describe, it, expect } from "vitest";
import { createVaultSchema, updateVaultSchema } from "../vault";

describe("createVaultSchema", () => {
  it("accepts a valid vault with required fields only", () => {
    const result = createVaultSchema.safeParse({ name: "My Vault" });
    expect(result.success).toBe(true);
  });

  it("accepts a vault with all optional fields", () => {
    const result = createVaultSchema.safeParse({
      name: "My Vault",
      description: "Important documents",
      type: "WILL",
      status: "ACTIVE",
      unlockDate: "2026-12-31T00:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createVaultSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    const result = createVaultSchema.safeParse({ name: "x".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects name under 1 char", () => {
    const result = createVaultSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects description over 500 chars", () => {
    const result = createVaultSchema.safeParse({
      name: "X",
      description: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict mode)", () => {
    const result = createVaultSchema.safeParse({
      name: "X",
      hackerField: "evil",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid enum type", () => {
    const result = createVaultSchema.safeParse({
      name: "X",
      type: "INVALID_TYPE",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateVaultSchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    const result = updateVaultSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a partial update", () => {
    const result = updateVaultSchema.safeParse({ name: "Updated" });
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields in update", () => {
    const result = updateVaultSchema.safeParse({ hackerField: "evil" });
    expect(result.success).toBe(false);
  });

  it("still validates field constraints in update", () => {
    const result = updateVaultSchema.safeParse({ name: "x".repeat(101) });
    expect(result.success).toBe(false);
  });
});
