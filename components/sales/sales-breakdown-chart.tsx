"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency, formatPercent } from "@/lib/utils"

// 分析タイプの型定義
type BreakdownType = "customer" | "product"

// 売上内訳データの型定義
type SalesBreakdownData = {
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

export function SalesBreakdownChart() {
  const [breakdownType, setBreakdownType] = useState<BreakdownType>("customer")

  // 顧客別売上データ
  const customerData: SalesBreakdownData[] = [
    { name: "株式会社テクノロジー", value: 1650000, color: "#4f46e5" },
    { name: "株式会社イノベーション", value: 1300000, color: "#06b6d4" },
    { name: "株式会社デジタルソリューション", value: 880000, color: "#f59e0b" },
    { name: "株式会社クラウドサービス", value: 1320000, color: "#84cc16" },
    { name: "株式会社データアナリティクス", value: 550000, color: "#ec4899" },
  ]

  // 商品別売上データ
  const productData: SalesBreakdownData[] = [
    { name: "エンタープライズライセンス", value: 2420000, color: "#4f46e5" },
    { name: "プレミアムライセンス", value: 1080000, color: "#06b6d4" },
    { name: "コンサルティングサービス", value: 550000, color: "#f59e0b" },
    { name: "カスタマイズ開発", value: 880000, color: "#84cc16" },
    { name: "トレーニングサービス", value: 770000, color: "#ec4899" },
  ]

  // 表示するデータを選択
  const data = breakdownType === "customer" ? customerData : productData

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
        <CardTitle>売上内訳</CardTitle>
        <Tabs
          defaultValue="customer"
          value={breakdownType}
          onValueChange={(value) => setBreakdownType(value as BreakdownType)}
        >
          <TabsList>
            <TabsTrigger value="customer">顧客別</TabsTrigger>
            <TabsTrigger value="product">商品別</TabsTrigger>
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
