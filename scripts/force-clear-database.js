// データベースを強制的にクリアするスクリプト
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function forceClearDatabase() {
  try {
    console.log("データベースの強制クリアを開始します...")

    // 外部キー制約を一時的に無効化（PostgreSQL）
    await prisma.$executeRaw`SET session_replication_role = 'replica';`

    // すべてのテーブルを削除
    const deleteMonthlySales = await prisma.monthlySales.deleteMany()
    console.log(`月次按分売上データを削除しました: ${deleteMonthlySales.count}件`)

    const deleteDealItems = await prisma.dealItem.deleteMany()
    console.log(`契約アイテムデータを削除しました: ${deleteDealItems.count}件`)

    const deleteDeals = await prisma.deal.deleteMany()
    console.log(`商談データを削除しました: ${deleteDeals.count}件`)

    const deleteCosts = await prisma.cost.deleteMany()
    console.log(`費用データを削除しました: ${deleteCosts.count}件`)

    const deleteBudgets = await prisma.budget.deleteMany()
    console.log(`予算データを削除しました: ${deleteBudgets.count}件`)

    const deleteCustomers = await prisma.customer.deleteMany()
    console.log(`顧客データを削除しました: ${deleteCustomers.count}件`)

    const deleteProducts = await prisma.product.deleteMany()
    console.log(`商品データを削除しました: ${deleteProducts.count}件`)

    // 外部キー制約を再度有効化
    await prisma.$executeRaw`SET session_replication_role = 'origin';`

    // 削除件数の合計
    const totalDeleted =
      deleteMonthlySales.count +
      deleteDealItems.count +
      deleteDeals.count +
      deleteCosts.count +
      deleteBudgets.count +
      deleteCustomers.count +
      deleteProducts.count

    console.log(`データベースのクリアが完了しました。合計 ${totalDeleted} 件のレコードを削除しました。`)
  } catch (error) {
    console.error("データベースのクリア中にエラーが発生しました:", error)
  } finally {
    // 外部キー制約を確実に再度有効化
    try {
      await prisma.$executeRaw`SET session_replication_role = 'origin';`
    } catch (e) {
      console.error("外部キー制約の再有効化に失敗しました:", e)
    }
    await prisma.$disconnect()
  }
}

forceClearDatabase()
