"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

// 売上データの型定義
type RevenueSummary = {
  period: string
  license: number
  service: number
  total: number
  budget?: number
}

// 期間タイプの型定義
type PeriodType = "monthly" | "quarterly" | "yearly"

// カスタムツールチップの型定義
type CustomTooltipProps = TooltipProps<number, string> & {
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

// 売上チャートコンポーネント
export function RevenueChart() {
  const [periodType, setPeriodType] = useState<PeriodType>("monthly")
  const [data, setData] = useState<RevenueSummary[]>([])

  // モックデータを生成する関数
  const generateMockData = (type: PeriodType) => {
    if (type === "monthly") {
      // 月次データ（直近6ヶ月）
      return [
        { period: "12月", license: 800000, service: 400000, total: 1200000, budget: 1200000 },
        { period: "1月", license: 850000, service: 450000, total: 1300000, budget: 1250000 },
        { period: "2月", license: 900000, service: 500000, total: 1400000, budget: 1300000 },
        { period: "3月", license: 950000, service: 550000, total: 1500000, budget: 1350000 },
        { period: "4月", license: 1000000, service: 600000, total: 1600000, budget: 1400000 },
        { period: "5月", license: 1050000, service: 650000, total: 1700000, budget: 1450000 },
      ]
    } else if (type === "quarterly") {
      // 四半期データ（直近4四半期）
      return [
        { period: "Q2 FY2023", license: 2400000, service: 1200000, total: 3600000, budget: 3500000 },
        { period: "Q3 FY2023", license: 2600000, service: 1300000, total: 3900000, budget: 3700000 },
        { period: "Q4 FY2023", license: 2800000, service: 1400000, total: 4200000, budget: 4000000 },
        { period: "Q1 FY2024", license: 3000000, service: 1500000, total: 4500000, budget: 4300000 },
      ]
    } else {
      // 年次データ（直近3年）
      return [
        { period: "FY2022", license: 9000000, service: 4500000, total: 13500000, budget: 13000000 },
        { period: "FY2023", license: 10000000, service: 5000000, total: 15000000, budget: 14500000 },
        { period: "FY2024", license: 11000000, service: 5500000, total: 16500000, budget: 16000000 },
      ]
    }
  }

  // 期間タイプが変更されたときにデータを更新
  useEffect(() => {
    setData(generateMockData(periodType))
  }, [periodType])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>売上推移</CardTitle>
          <Tabs defaultValue="monthly" value={periodType} onValueChange={(value) => setPeriodType(value as PeriodType)}>
            <TabsList>
              <TabsTrigger value="monthly">月次</TabsTrigger>
              <TabsTrigger value="quarterly">四半期</TabsTrigger>
              <TabsTrigger value="yearly">年次</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
              <Bar dataKey="license" name="ライセンス" stackId="a" fill="#4f46e5" />
              <Bar dataKey="service" name="サービス" stackId="a" fill="#06b6d4" />
              <Bar dataKey="budget" name="予算" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
