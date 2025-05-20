"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency, formatPercent } from "@/lib/utils"

// 分析タイプの型定義
type BreakdownType = "type" | "category"

// 費用内訳データの型定義
type CostBreakdownData = {
  name: string
  value: number
  color: string
}

// カスタムツールチップの型定義
type CustomTooltipProps = {
  active?: boolean
  payload?: any[]
}

// カスタムツールチップコンポーネント
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>{formatCurrency(payload[0].value)}</p>
        <p>{formatPercent(payload[0].payload.percentage)}</p>
      </div>
    )
  }
  return null
}

export function CostBreakdownChart() {
  const [breakdownType, setBreakdownType] = useState<BreakdownType>("type")

  // 費用種別別データ
  const typeData: CostBreakdownData[] = [
    { name: "ライセンス原価", value: 250000, color: "#f97316" },
    { name: "サービス原価", value: 190000, color: "#f59e0b" },
    { name: "販管費", value: 720000, color: "#84cc16" },
  ]

  // カテゴリ別データ
  const categoryData: CostBreakdownData[] = [
    { name: "ライセンス原価", value: 250000, color: "#f97316" },
    { name: "サービス原価", value: 190000, color: "#f59e0b" },
    { name: "人件費", value: 500000, color: "#84cc16" },
    { name: "オフィス費", value: 100000, color: "#14b8a6" },
    { name: "広告宣伝費", value: 120000, color: "#0ea5e9" },
  ]

  // 表示するデータを選択
  const data = breakdownType === "type" ? typeData : categoryData

  // 合計を計算
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // パーセンテージを追加
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: item.value / total,
  }))

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>費用内訳</CardTitle>
        <Tabs
          defaultValue="type"
          value={breakdownType}
          onValueChange={(value) => setBreakdownType(value as BreakdownType)}
        >
          <TabsList>
            <TabsTrigger value="type">種別別</TabsTrigger>
            <TabsTrigger value="category">カテゴリ別</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span>合計</span>
            <span className="font-medium">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
