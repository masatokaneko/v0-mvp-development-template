import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("シードスクリプトを実行しています...")
  console.log("注意: このシードスクリプトはデータを作成しません。")
  console.log("データを作成する場合は、このスクリプトを修正してください。")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
