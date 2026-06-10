import "server-only";

import { prisma } from "@vixi/db";
import type { AuditAction } from "@prisma/client";

export interface LogAuditEventInput {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(input: LogAuditEventInput) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata as object | undefined,
    },
  });
}

export async function getAuditLogs(userId: string) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
