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

// 費用トレンドデータの型定義
type CostTrendData = {
  period: string
  licenseCoS: number
  serviceCoS: number
  sgAndA: number
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

export function CostTrendChart() {
  const [chartType, setChartType] = useState<ChartType>("line")

  // モックデータ
  const data: CostTrendData[] = [
    { period: "1月", licenseCoS: 200000, serviceCoS: 150000, sgAndA: 680000, total: 1030000 },
    { period: "2月", licenseCoS: 220000, serviceCoS: 160000, sgAndA: 690000, total: 1070000 },
    { period: "3月", licenseCoS: 230000, serviceCoS: 170000, sgAndA: 700000, total: 1100000 },
    { period: "4月", licenseCoS: 240000, serviceCoS: 180000, sgAndA: 710000, total: 1130000 },
    { period: "5月", licenseCoS: 250000, serviceCoS: 190000, sgAndA: 720000, total: 1160000 },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>費用推移</CardTitle>
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
                <Line
                  type="monotone"
                  dataKey="licenseCoS"
                  name="ライセンス原価"
                  stroke="#f97316"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="serviceCoS" name="サービス原価" stroke="#f59e0b" />
                <Line type="monotone" dataKey="sgAndA" name="販管費" stroke="#84cc16" />
                <Line type="monotone" dataKey="total" name="合計" stroke="#0ea5e9" />
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
                <Bar dataKey="licenseCoS" name="ライセンス原価" stackId="a" fill="#f97316" />
                <Bar dataKey="serviceCoS" name="サービス原価" stackId="a" fill="#f59e0b" />
                <Bar dataKey="sgAndA" name="販管費" stackId="a" fill="#84cc16" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
