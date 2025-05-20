"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

// 分析タイプの型定義
type AnalysisType = "sales" | "costs" | "profits"

// 予算実績比較データの型定義
type BudgetComparisonData = {
  period: string
  actual: number
  budget: number
  variance: number
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
        {payload.length >= 2 && (
          <p style={{ color: "#6b7280" }}>差異: {formatCurrency(payload[0].value - payload[1].value)}</p>
        )}
      </div>
    )
  }
  return null
}

export function BudgetComparisonChart() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("sales")

  // 売上データ
  const salesData: BudgetComparisonData[] = [
    { period: "1月", actual: 1000000, budget: 1200000, variance: -200000 },
    { period: "2月", actual: 1300000, budget: 1250000, variance: 50000 },
    { period: "3月", actual: 1400000, budget: 1300000, variance: 100000 },
    { period: "4月", actual: 1500000, budget: 1350000, variance: 150000 },
    { period: "5月", actual: 1700000, budget: 1600000, variance: 100000 },
  ]

  // 費用データ
  const costsData: BudgetComparisonData[] = [
    { period: "1月", actual: 1030000, budget: 1100000, variance: -70000 },
    { period: "2月", actual: 1070000, budget: 1150000, variance: -80000 },
    { period: "3月", actual: 1100000, budget: 1200000, variance: -100000 },
    { period: "4月", actual: 1130000, budget: 1220000, variance: -90000 },
    { period: "5月", actual: 1160000, budget: 1240000, variance: -80000 },
  ]

  // 利益データ
  const profitsData: BudgetComparisonData[] = [
    { period: "1月", actual: -30000, budget: 100000, variance: -130000 },
    { period: "2月", actual: 230000, budget: 100000, variance: 130000 },
    { period: "3月", actual: 300000, budget: 100000, variance: 200000 },
    { period: "4月", actual: 370000, budget: 130000, variance: 240000 },
    { period: "5月", actual: 540000, budget: 360000, variance: 180000 },
  ]

  // 表示するデータを選択
  const data = analysisType === "sales" ? salesData : analysisType === "costs" ? costsData : profitsData

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>予算実績比較</CardTitle>
        <Tabs
          defaultValue="sales"
          value={analysisType}
          onValueChange={(value) => setAnalysisType(value as AnalysisType)}
        >
          <TabsList>
            <TabsTrigger value="sales">売上</TabsTrigger>
            <TabsTrigger value="costs">費用</TabsTrigger>
            <TabsTrigger value="profits">利益</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
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
              <Bar dataKey="actual" name="実績" fill="#4f46e5" />
              <Bar dataKey="budget" name="予算" fill="#f59e0b" />
              <ReferenceLine y={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
