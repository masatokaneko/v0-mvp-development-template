"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

// チャートタイプの型定義
type ChartType = "line" | "bar"

// 売上トレンドデータの型定義
type SalesTrendData = {
  period: string
  license: number
  service: number
  total: number
}

// カスタムツールチップの型定義
type CustomTooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
}

// カスタムツールチップコンポーネント
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SalesTrendChart() {
  const [chartType, setChartType] = useState<ChartType>("line")

  // モックデータ
  const data: SalesTrendData[] = [
    { period: "1月", license: 650000, service: 350000, total: 1000000 },
    { period: "2月", license: 680000, service: 370000, total: 1050000 },
    { period: "3月", license: 700000, service: 400000, total: 1100000 },
    { period: "4月", license: 720000, service: 430000, total: 1150000 },
    { period: "5月", license: 750000, service: 450000, total: 1200000 },
    { period: "6月", license: 780000, service: 470000, total: 1250000 },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>売上推移</CardTitle>
        <Tabs defaultValue="line" value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
          <TabsList>
            <TabsTrigger value="line">折れ線</TabsTrigger>
            <TabsTrigger value="bar">棒グラフ</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `${value / 10000}万`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="license" name="ライセンス" stroke="#4f46e5" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="service" name="サービス" stroke="#06b6d4" />
                <Line type="monotone" dataKey="total" name="合計" stroke="#f59e0b" />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `${value / 10000}万`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="license" name="ライセンス" stackId="a" fill="#4f46e5" />
                <Bar dataKey="service" name="サービス" stackId="a" fill="#06b6d4" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
