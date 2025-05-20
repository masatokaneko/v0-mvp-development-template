import { PrismaClient } from "@prisma/client"

// PrismaClient のグローバルインスタンスを作成
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// エラーハンドリングを追加した初期化
export const prisma =
  globalForPrisma.prisma ||
  (() => {
    try {
      const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })

      // 接続テスト
      if (process.env.NODE_ENV !== "production") {
        client
          .$connect()
          .then(() => console.log("Database connection established"))
          .catch((e) => console.error("Failed to connect to database:", e))
      }

      return client
    } catch (e) {
      console.error("Failed to initialize Prisma Client:", e)
      // フォールバックとして空のモックを返す（ビルド時のエラー回避用）
      if (process.env.NODE_ENV === "production") {
        return {} as PrismaClient
      }
      throw e
    }
  })()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
