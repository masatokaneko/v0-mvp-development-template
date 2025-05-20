import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    // トランザクションを使用してデータを削除
    const result = await prisma.$transaction(async (tx) => {
      // 1. 月次按分売上を最初に削除（契約アイテムに依存）
      const deleteMonthlySales = await tx.monthlySales.deleteMany()
      console.log(`月次按分売上データを削除しました: ${deleteMonthlySales.count}件`)

      // 2. 契約アイテムを削除（商談に依存）
      const deleteDealItems = await tx.dealItem.deleteMany()
      console.log(`契約アイテムデータを削除しました: ${deleteDealItems.count}件`)

      // 3. 商談を削除（顧客に依存）
      const deleteDeals = await tx.deal.deleteMany()
      console.log(`商談データを削除しました: ${deleteDeals.count}件`)

      // 4. その他のデータを削除
      const deleteCosts = await tx.cost.deleteMany()
      console.log(`費用データを削除しました: ${deleteCosts.count}件`)

      const deleteBudgets = await tx.budget.deleteMany()
      console.log(`予算データを削除しました: ${deleteBudgets.count}件`)

      // 5. マスターデータを最後に削除
      const deleteCustomers = await tx.customer.deleteMany()
      console.log(`顧客データを削除しました: ${deleteCustomers.count}件`)

      const deleteProducts = await tx.product.deleteMany()
      console.log(`商品データを削除しました: ${deleteProducts.count}件`)

      return {
        monthlySales: deleteMonthlySales.count,
        dealItems: deleteDealItems.count,
        deals: deleteDeals.count,
        costs: deleteCosts.count,
        budgets: deleteBudgets.count,
        customers: deleteCustomers.count,
        products: deleteProducts.count,
      }
    })

    // 削除件数の合計
    const totalDeleted = Object.values(result).reduce((sum, count) => sum + count, 0)

    return NextResponse.json({
      success: true,
      message: "すべてのデータが正常にクリアされました",
      totalDeleted,
      details: result,
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
