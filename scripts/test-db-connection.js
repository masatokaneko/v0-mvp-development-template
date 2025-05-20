const { PrismaClient } = require("@prisma/client")

async function testConnection() {
  const prisma = new PrismaClient()

  try {
    console.log("Testing database connection...")
    await prisma.$connect()
    console.log("Database connection successful!")

    // 簡単なクエリを実行してテスト
    const count = await prisma.budget.count()
    console.log(`Budget count: ${count}`)

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Database connection failed:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()
