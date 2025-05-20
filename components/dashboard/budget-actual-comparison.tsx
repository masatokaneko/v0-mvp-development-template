"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatPercent } from "@/lib/utils"
import type { Decimal } from "decimal.js"

// 予実比較の項目タイプ
type ComparisonItemType = "sales" | "costs" | "profits"

// 予実比較の期間タイプ
type ComparisonPeriodType = "monthly" | "quarterly" | "yearly"

// 予実比較の表示項目
type ComparisonItem = {
  label: string
  actual: Decimal
  budget: Decimal
  variance: Decimal
  achievementRate: Decimal
}

export function BudgetActualComparison() {
  const [itemType, setItemType] = useState<ComparisonItemType>("sales")
  const [periodType, setPeriodType] = useState<ComparisonPeriodType>("monthly")
  const [comparisonData, setComparisonData] = useState<ComparisonItem[]>([])

  // モックデータを生成する関数を修正し、データが無い場合のガード処理を追加
  const generateMockData = (itemType: ComparisonItemType, periodType: ComparisonPeriodType) => {
    // 実際のAPIから取得する場合はここで非同期処理
    return []
  }

  // タブ切り替え時にデータを更新
  const handleItemTypeChange = (value: string) => {
    setItemType(value as ComparisonItemType)
    setComparisonData(generateMockData(value as ComparisonItemType, periodType))
  }

  const handlePeriodTypeChange = (value: string) => {
    setPeriodType(value as ComparisonPeriodType)
    setComparisonData(generateMockData(itemType, value as ComparisonPeriodType))
  }

  // 初期データ設定にガード処理を追加
  useState(() => {
    const data = generateMockData(itemType, periodType)
    setComparisonData(data.length > 0 ? data : [])
  })

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>予実比較</CardTitle>
          <div className="flex space-x-4">
            <Tabs defaultValue="sales" value={itemType} onValueChange={handleItemTypeChange}>
              <TabsList>
                <TabsTrigger value="sales">売上</TabsTrigger>
                <TabsTrigger value="costs">費用</TabsTrigger>
                <TabsTrigger value="profits">利益</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="monthly" value={periodType} onValueChange={handlePeriodTypeChange}>
              <TabsList>
                <TabsTrigger value="monthly">月次</TabsTrigger>
                <TabsTrigger value="quarterly">四半期</TabsTrigger>
                <TabsTrigger value="yearly">年次</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">項目</th>
                <th className="text-right py-2 font-medium">実績</th>
                <th className="text-right py-2 font-medium">予算</th>
                <th className="text-right py-2 font-medium">差異</th>
                <th className="text-right py-2 font-medium">達成率</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr key={index} className={index === comparisonData.length - 1 ? "font-medium" : ""}>
                  <td className="py-2">{item.label}</td>
                  <td className="text-right py-2">{formatCurrency(item.actual)}</td>
                  <td className="text-right py-2">{formatCurrency(item.budget)}</td>
                  <td
                    className={`text-right py-2 ${item.variance.greaterThan(0) ? "text-green-600" : item.variance.lessThan(0) ? "text-red-600" : ""}`}
                  >
                    {formatCurrency(item.variance)}
                  </td>
                  <td
                    className={`text-right py-2 ${item.achievementRate.greaterThan(100) ? "text-green-600" : item.achievementRate.lessThan(100) ? "text-red-600" : ""}`}
                  >
                    {formatPercent(item.achievementRate.dividedBy(100))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
