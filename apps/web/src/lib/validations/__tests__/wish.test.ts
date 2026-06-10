import { describe, it, expect } from "vitest";
import { createWishSchema, updateWishSchema } from "../wish";

describe("createWishSchema", () => {
  it("accepts valid wish", () => {
    const result = createWishSchema.safeParse({
      category: "FUNERAL_PREFERENCE",
      title: "My funeral wishes",
      body: "Please keep it simple.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createWishSchema.safeParse({
      category: "OTHER",
      body: "Something",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = createWishSchema.safeParse({
      category: "FLYING",
      title: "Test",
      body: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty body", () => {
    const result = createWishSchema.safeParse({
      category: "OTHER",
      title: "Test",
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateWishSchema", () => {
  it("accepts partial update", () => {
    const result = updateWishSchema.safeParse({ title: "New title" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category in partial update", () => {
    const result = updateWishSchema.safeParse({ category: "NOPE" });
    expect(result.success).toBe(false);
  });
});
