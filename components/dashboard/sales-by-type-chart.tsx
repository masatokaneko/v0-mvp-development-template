"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency, formatPercent } from "@/lib/utils"

// 売上種別データの型定義
type SalesByTypeData = {
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

export function SalesByTypeChart() {
  // モックデータ
  const data: SalesByTypeData[] = [
    { name: "ライセンス", value: 1050000, color: "#4f46e5" },
    { name: "サービス", value: 650000, color: "#06b6d4" },
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
        <CardTitle>売上種別内訳</CardTitle>
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
