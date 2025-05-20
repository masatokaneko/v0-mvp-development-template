// データベースをクリアするスクリプト
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log("データベースのクリアを開始します...")

    // 削除順序を依存関係に合わせて調整
    // 1. 月次按分売上を最初に削除（契約アイテムに依存）
    const deleteMonthlySales = await prisma.monthlySales.deleteMany()
    console.log(`月次按分売上データを削除しました: ${deleteMonthlySales.count}件`)

    // 2. 契約アイテムを削除（商談に依存）
    const deleteDealItems = await prisma.dealItem.deleteMany()
    console.log(`契約アイテムデータを削除しました: ${deleteDealItems.count}件`)

    // 3. 商談を削除（顧客に依存）
    const deleteDeals = await prisma.deal.deleteMany()
    console.log(`商談データを削除しました: ${deleteDeals.count}件`)

    // 4. その他のデータを削除
    const deleteCosts = await prisma.cost.deleteMany()
    console.log(`費用データを削除しました: ${deleteCosts.count}件`)

    const deleteBudgets = await prisma.budget.deleteMany()
    console.log(`予算データを削除しました: ${deleteBudgets.count}件`)

    // 5. マスターデータを最後に削除
    const deleteCustomers = await prisma.customer.deleteMany()
    console.log(`顧客データを削除しました: ${deleteCustomers.count}件`)

    const deleteProducts = await prisma.product.deleteMany()
    console.log(`商品データを削除しました: ${deleteProducts.count}件`)

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
    await prisma.$disconnect()
  }
}

clearDatabase()
