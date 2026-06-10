import { describe, it, expect } from "vitest";
import { createBeneficiarySchema, updateBeneficiarySchema } from "../beneficiary";

describe("createBeneficiarySchema", () => {
  it("accepts a valid beneficiary with required fields only", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a beneficiary with all optional fields", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-555-0123",
      relationship: "Spouse",
      trusted: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createBeneficiarySchema.safeParse({
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = createBeneficiarySchema.safeParse({ name: "Jane" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Jane",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "x".repeat(101),
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects relationship over 50 chars", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      relationship: "x".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict mode)", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      hackerField: "evil",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateBeneficiarySchema", () => {
  it("accepts an empty object", () => {
    const result = updateBeneficiarySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a partial update with trusted flag only", () => {
    const result = updateBeneficiarySchema.safeParse({ trusted: true });
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields in update", () => {
    const result = updateBeneficiarySchema.safeParse({ hackerField: "evil" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email in update", () => {
    const result = updateBeneficiarySchema.safeParse({
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("role / accessLevel / inviteStatus fields", () => {
  it("accepts valid role", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      role: "EXECUTOR",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid role", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      role: "RANDOM_ROLE",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid accessLevel", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      accessLevel: "FULL_AFTER_RELEASE",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid inviteStatus", () => {
    const result = createBeneficiarySchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      inviteStatus: "INVITED",
    });
    expect(result.success).toBe(true);
  });
});
