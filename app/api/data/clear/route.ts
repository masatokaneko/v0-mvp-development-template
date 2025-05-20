import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    // 削除順序を依存関係に合わせて調整
    // 1. 月次按分売上を最初に削除（契約アイテムに依存）
    const deleteMonthlySales = await prisma.monthlySales.deleteMany()

    // 2. 契約アイテムを削除（商談に依存）
    const deleteDealItems = await prisma.dealItem.deleteMany()

    // 3. 商談を削除（顧客に依存）
    const deleteDeals = await prisma.deal.deleteMany()

    // 4. その他のデータを削除
    const deleteCosts = await prisma.cost.deleteMany()
    const deleteBudgets = await prisma.budget.deleteMany()

    // 5. マスターデータを最後に削除
    const deleteCustomers = await prisma.customer.deleteMany()
    const deleteProducts = await prisma.product.deleteMany()

    // 削除件数の合計
    const totalDeleted =
      deleteMonthlySales.count +
      deleteDealItems.count +
      deleteDeals.count +
      deleteCosts.count +
      deleteBudgets.count +
      deleteCustomers.count +
      deleteProducts.count

    return NextResponse.json({
      success: true,
      message: "すべてのデータが正常にクリアされました",
      totalDeleted,
      details: {
        monthlySales: deleteMonthlySales.count,
        dealItems: deleteDealItems.count,
        deals: deleteDeals.count,
        costs: deleteCosts.count,
        budgets: deleteBudgets.count,
        customers: deleteCustomers.count,
        products: deleteProducts.count,
      },
    })
  } catch (error) {
    console.error("データクリアエラー:", error)
    return NextResponse.json(
      {
        success: false,
        message: "データのクリア中にエラーが発生しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    )
  }
}
