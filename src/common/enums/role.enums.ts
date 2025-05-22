import { Role as PrismaRole } from "generated/prisma";

export const Role = {
  Admin: PrismaRole.ADMIN,
  Agent: PrismaRole.AGENT,
  Viewer: PrismaRole.VIEWER,
} as const;

// Type for when you need it
export type Role = (typeof Role)[keyof typeof Role];
