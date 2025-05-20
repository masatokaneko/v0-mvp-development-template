import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    // 各テーブルのデータを削除
    const deleteMonthlySales = await prisma.monthlySales.deleteMany()
    const deleteDealItems = await prisma.dealItem.deleteMany()
    const deleteDeals = await prisma.deal.deleteMany()
    const deleteCosts = await prisma.cost.deleteMany()
    const deleteBudgets = await prisma.budget.deleteMany()
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
