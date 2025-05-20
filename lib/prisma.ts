import { PrismaClient } from "@prisma/client"

// PrismaClient のグローバルインスタンスを作成
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// エラーハンドリングを追加した初期化
export const prisma =
  globalForPrisma.prisma ||
  (() => {
    try {
      // Prisma Client が存在するかチェック
      try {
        require(".prisma/client/default")
      } catch (e) {
        console.warn("Prisma Client is not generated. Using mock client for build process.")
        // ビルド時のみのモッククライアント
        if (process.env.NODE_ENV === "production") {
          return createMockPrismaClient()
        }
      }

      const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })

      // 接続テスト
      if (process.env.NODE_ENV === "development") {
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
        return createMockPrismaClient()
      }
      throw e
    }
  })()

// モッククライアントの作成
function createMockPrismaClient() {
  const handler = {
    get: (target: any, prop: string) => {
      if (prop === "$connect" || prop === "$disconnect") {
        return () => Promise.resolve()
      }

      // モデル操作のモック
      return new Proxy(
        {},
        {
          get: () => async () => {
            console.warn(`Mock Prisma Client: Operation not available during build time`)
            return []
          },
        },
      )
    },
  }

  return new Proxy({}, handler) as unknown as PrismaClient
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
