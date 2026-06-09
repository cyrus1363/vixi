import type { ZodIssue } from "zod";

export class NotFoundError extends Error {
  readonly entityName: string;

  constructor(entityName: string) {
    super(`${entityName} not found`);
    this.name = "NotFoundError";
    this.entityName = entityName;
  }
}

export class ValidationError extends Error {
  readonly issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    super(`Validation failed: ${issues.length} issue(s)`);
    this.name = "ValidationError";
    this.issues = issues;
  }
}
