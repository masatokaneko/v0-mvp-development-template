import { Decimal } from "decimal.js"
import type { ProductType } from "@prisma/client"

type MonthlySalesInput = {
  dealItemId: string
  year: number
  month: number
  totalDays: number
  appliedDays: number
  dailyRate: Decimal
  amount: Decimal
  type: ProductType
}

/**
 * 契約アイテムの月次按分売上データを生成する
 * @param dealItemId 契約アイテムID
 * @param startDate 契約開始日
 * @param endDate 契約終了日
 * @param totalAmount 契約総額（税後）
 * @param type 商品種別（ライセンス/サービス）
 * @returns 月次按分売上データの配列
 */
export function generateMonthlySales(
  dealItemId: string,
  startDate: Date,
  endDate: Date,
  totalAmount: Decimal,
  type: ProductType,
): MonthlySalesInput[] {
  const monthlySales: MonthlySalesInput[] = []

  // 契約期間の総日数を計算
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // 日割り単価
  const dailyRate = totalAmount.dividedBy(totalDays)

  // 開始年月と終了年月
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1 // JavaScriptの月は0始まり
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth() + 1

  // 各月の按分額を計算
  let currentYear = startYear
  let currentMonth = startMonth

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    // 月の日数
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

    // 適用日数を計算
    let appliedDays: number

    if (currentYear === startYear && currentMonth === startMonth) {
      // 開始月
      const startDay = startDate.getDate()
      appliedDays = daysInMonth - startDay + 1
    } else if (currentYear === endYear && currentMonth === endMonth) {
      // 終了月
      appliedDays = endDate.getDate()
    } else {
      // 中間の月
      appliedDays = daysInMonth
    }

    // 月の按分額
    const amount = dailyRate.times(appliedDays)

    monthlySales.push({
      dealItemId,
      year: currentYear,
      month: currentMonth,
      totalDays: daysInMonth,
      appliedDays,
      dailyRate,
      amount,
      type,
    })

    // 次の月へ
    if (currentMonth === 12) {
      currentYear++
      currentMonth = 1
    } else {
      currentMonth++
    }
  }

  return monthlySales
}

/**
 * 月次按分売上の合計を計算する
 * @param monthlySales 月次按分売上データの配列
 * @returns 合計金額
 */
export function calculateTotalAmount(monthlySales: MonthlySalesInput[]): Decimal {
  return monthlySales.reduce((sum, sale) => sum.plus(sale.amount), new Decimal(0))
}

/**
 * 指定された年月の月次按分売上を抽出する
 * @param monthlySales 月次按分売上データの配列
 * @param year 年
 * @param month 月
 * @returns 指定された年月の月次按分売上データの配列
 */
export function filterByYearMonth(monthlySales: MonthlySalesInput[], year: number, month: number): MonthlySalesInput[] {
  return monthlySales.filter((sale) => sale.year === year && sale.month === month)
}

/**
 * 指定された種別の月次按分売上を抽出する
 * @param monthlySales 月次按分売上データの配列
 * @param type 商品種別（ライセンス/サービス）
 * @returns 指定された種別の月次按分売上データの配列
 */
export function filterByType(monthlySales: MonthlySalesInput[], type: ProductType): MonthlySalesInput[] {
  return monthlySales.filter((sale) => sale.type === type)
}
