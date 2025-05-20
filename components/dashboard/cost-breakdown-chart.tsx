"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency, formatPercent } from "@/lib/utils"

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
  // モックデータ
  const data: CostBreakdownData[] = [
    { name: "ライセンス原価", value: 250000, color: "#f97316" },
    { name: "サービス原価", value: 190000, color: "#f59e0b" },
    { name: "人件費", value: 500000, color: "#84cc16" },
    { name: "オフィス費", value: 100000, color: "#14b8a6" },
    { name: "広告宣伝費", value: 120000, color: "#0ea5e9" },
  ]

  // 合計を計算
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // パーセンテージを追加
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: item.value / total,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>費用内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
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
