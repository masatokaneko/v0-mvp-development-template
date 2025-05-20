"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Decimal } from "decimal.js"

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

export function BudgetActualComparisonTable() {
  const [itemType, setItemType] = useState<ComparisonItemType>("sales")
  const [periodType, setPeriodType] = useState<ComparisonPeriodType>("monthly")

  // 売上の予実比較データ（月次）
  const salesMonthlyData: ComparisonItem[] = [
    {
      label: "ライセンス売上",
      actual: new Decimal(1050000),
      budget: new Decimal(1000000),
      variance: new Decimal(50000),
      achievementRate: new Decimal(105),
    },
    {
      label: "サービス売上",
      actual: new Decimal(650000),
      budget: new Decimal(600000),
      variance: new Decimal(50000),
      achievementRate: new Decimal(108.3),
    },
    {
      label: "売上合計",
      actual: new Decimal(1700000),
      budget: new Decimal(1600000),
      variance: new Decimal(100000),
      achievementRate: new Decimal(106.3),
    },
  ]

  // 費用の予実比較データ（月次）
  const costsMonthlyData: ComparisonItem[] = [
    {
      label: "ライセンス原価",
      actual: new Decimal(250000),
      budget: new Decimal(300000),
      variance: new Decimal(-50000),
      achievementRate: new Decimal(83.3),
    },
    {
      label: "サービス原価",
      actual: new Decimal(190000),
      budget: new Decimal(240000),
      variance: new Decimal(-50000),
      achievementRate: new Decimal(79.2),
    },
    {
      label: "販管費",
      actual: new Decimal(720000),
      budget: new Decimal(700000),
      variance: new Decimal(20000),
      achievementRate: new Decimal(102.9),
    },
    {
      label: "費用合計",
      actual: new Decimal(1160000),
      budget: new Decimal(1240000),
      variance: new Decimal(-80000),
      achievementRate: new Decimal(93.5),
    },
  ]

  // 利益の予実比較データ（月次）
  const profitsMonthlyData: ComparisonItem[] = [
    {
      label: "売上総利益",
      actual: new Decimal(540000),
      budget: new Decimal(460000),
      variance: new Decimal(80000),
      achievementRate: new Decimal(117.4),
    },
    {
      label: "営業利益",
      actual: new Decimal(540000),
      budget: new Decimal(460000),
      variance: new Decimal(80000),
      achievementRate: new Decimal(117.4),
    },
  ]

  // 売上の予実比較データ（四半期）
  const salesQuarterlyData: ComparisonItem[] = [
    {
      label: "ライセンス売上",
      actual: new Decimal(3000000),
      budget: new Decimal(2850000),
      variance: new Decimal(150000),
      achievementRate: new Decimal(105.3),
    },
    {
      label: "サービス売上",
      actual: new Decimal(1800000),
      budget: new Decimal(1650000),
      variance: new Decimal(150000),
      achievementRate: new Decimal(109.1),
    },
    {
      label: "売上合計",
      actual: new Decimal(4800000),
      budget: new Decimal(4500000),
      variance: new Decimal(300000),
      achievementRate: new Decimal(106.7),
    },
  ]

  // 売上の予実比較データ（年次）
  const salesYearlyData: ComparisonItem[] = [
    {
      label: "ライセンス売上",
      actual: new Decimal(5700000),
      budget: new Decimal(5400000),
      variance: new Decimal(300000),
      achievementRate: new Decimal(105.6),
    },
    {
      label: "サービス売上",
      actual: new Decimal(3200000),
      budget: new Decimal(3000000),
      variance: new Decimal(200000),
      achievementRate: new Decimal(106.7),
    },
    {
      label: "売上合計",
      actual: new Decimal(8900000),
      budget: new Decimal(8400000),
      variance: new Decimal(500000),
      achievementRate: new Decimal(106.0),
    },
  ]

  // 表示するデータを選択
  const getComparisonData = () => {
    if (itemType === "sales") {
      if (periodType === "monthly") return salesMonthlyData
      if (periodType === "quarterly") return salesQuarterlyData
      return salesYearlyData
    } else if (itemType === "costs") {
      return costsMonthlyData // 簡略化のため月次データのみ
    } else {
      return profitsMonthlyData // 簡略化のため月次データのみ
    }
  }

  const comparisonData = getComparisonData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>予実比較詳細</CardTitle>
        <div className="flex space-x-4">
          <Tabs
            defaultValue="sales"
            value={itemType}
            onValueChange={(value) => setItemType(value as ComparisonItemType)}
          >
            <TabsList>
              <TabsTrigger value="sales">売上</TabsTrigger>
              <TabsTrigger value="costs">費用</TabsTrigger>
              <TabsTrigger value="profits">利益</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs
            defaultValue="monthly"
            value={periodType}
            onValueChange={(value) => setPeriodType(value as ComparisonPeriodType)}
          >
            <TabsList>
              <TabsTrigger value="monthly">月次</TabsTrigger>
              <TabsTrigger value="quarterly">四半期</TabsTrigger>
              <TabsTrigger value="yearly">年次</TabsTrigger>
            </TabsList>
          </Tabs>
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
