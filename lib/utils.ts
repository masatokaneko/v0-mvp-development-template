import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Decimal } from "decimal.js"

// クラス名を結合するユーティリティ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 数値をフォーマットする
export function formatNumber(value: number | Decimal, options: Intl.NumberFormatOptions = {}) {
  const numValue = value instanceof Decimal ? value.toNumber() : value
  return new Intl.NumberFormat("ja-JP", options).format(numValue)
}

// 金額をフォーマットする
export function formatCurrency(value: number | Decimal) {
  return formatNumber(value, { style: "currency", currency: "JPY" })
}

// パーセンテージをフォーマットする
export function formatPercent(value: number | Decimal, fractionDigits = 1) {
  const numValue = value instanceof Decimal ? value.toNumber() : value
  return formatNumber(numValue, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

// 日付をフォーマットする
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ja-JP", { ...options }).format(dateObj)
}

// 年月から会計四半期を取得する（当社の会計年度は12月開始）
export function getFiscalQuarter(year: number, month: number): { fiscalYear: number; fiscalQuarter: number } {
  // 12月は次の年度の第1四半期
  if (month === 12) {
    return { fiscalYear: year + 1, fiscalQuarter: 1 }
  }

  // 1-2月は同じ年度の第1四半期
  if (month <= 2) {
    return { fiscalYear: year, fiscalQuarter: 1 }
  }

  // 3-5月は第2四半期
  if (month <= 5) {
    return { fiscalYear: year, fiscalQuarter: 2 }
  }

  // 6-8月は第3四半期
  if (month <= 8) {
    return { fiscalYear: year, fiscalQuarter: 3 }
  }

  // 9-11月は第4四半期
  return { fiscalYear: year, fiscalQuarter: 4 }
}

// 四半期から月の範囲を取得する
export function getMonthsInQuarter(quarter: number): number[] {
  switch (quarter) {
    case 1:
      return [12, 1, 2]
    case 2:
      return [3, 4, 5]
    case 3:
      return [6, 7, 8]
    case 4:
      return [9, 10, 11]
    default:
      return []
  }
}

// 四半期の表示名を取得する
export function getQuarterDisplayName(quarter: number): string {
  return `Q${quarter}`
}

// 月の表示名を取得する
export function getMonthDisplayName(month: number): string {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  return months[month - 1]
}
