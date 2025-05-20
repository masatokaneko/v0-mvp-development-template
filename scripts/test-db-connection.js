const { PrismaClient } = require("@prisma/client")

async function testConnection() {
  const prisma = new PrismaClient()

  try {
    console.log("Testing database connection...")
    await prisma.$connect()
    console.log("Database connection successful!")

    // 簡単なクエリを実行してテスト
    const customerCount = await prisma.customer.count()
    console.log(`Customer count: ${customerCount}`)

    const dealCount = await prisma.deal.count()
    console.log(`Deal count: ${dealCount}`)

    const dealItemCount = await prisma.dealItem.count()
    console.log(`Deal item count: ${dealItemCount}`)

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Database connection failed:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()
