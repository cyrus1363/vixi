import { describe, it, expect } from "vitest";
import { createMemorySchema, updateMemorySchema } from "../memory";

describe("createMemorySchema", () => {
  it("accepts a valid memory with required fields only", () => {
    const result = createMemorySchema.safeParse({
      title: "A cherished moment",
      body: "The day we went to the lake...",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a memory with all optional fields", () => {
    const result = createMemorySchema.safeParse({
      title: "Family dinner",
      body: "Everyone was there.",
      mediaUrl: "https://example.com/photo.jpg",
      tags: ["family", "2020"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createMemorySchema.safeParse({ body: "Just a body" });
    expect(result.success).toBe(false);
  });

  it("rejects missing body", () => {
    const result = createMemorySchema.safeParse({ title: "Just a title" });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    const result = createMemorySchema.safeParse({
      title: "x".repeat(201),
      body: "body",
    });
    expect(result.success).toBe(false);
  });

  it("rejects body over 10000 chars", () => {
    const result = createMemorySchema.safeParse({
      title: "title",
      body: "x".repeat(10001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects tags that are not strings", () => {
    const result = createMemorySchema.safeParse({
      title: "title",
      body: "body",
      tags: [123, 456],
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict mode)", () => {
    const result = createMemorySchema.safeParse({
      title: "t",
      body: "b",
      hackerField: "evil",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mediaUrl", () => {
    const result = createMemorySchema.safeParse({
      title: "t",
      body: "b",
      mediaUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateMemorySchema", () => {
  it("accepts an empty object", () => {
    const result = updateMemorySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a partial update", () => {
    const result = updateMemorySchema.safeParse({ title: "Updated" });
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields in update", () => {
    const result = updateMemorySchema.safeParse({ hackerField: "evil" });
    expect(result.success).toBe(false);
  });
});
