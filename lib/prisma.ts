import { PrismaClient } from "@prisma/client"

// PrismaClientのグローバルインスタンスを作成
// これにより、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
