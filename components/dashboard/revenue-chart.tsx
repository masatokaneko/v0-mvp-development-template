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

  // モックデータを生成する関数を修正し、データが無い場合のガード処理を追加
  const generateMockData = (type: PeriodType) => {
    // 実際のAPIから取得するように変更する場合はここを修正
    return []
  }

  // useEffectの中にデータが空の場合のガード処理を追加
  useEffect(() => {
    const data = generateMockData(periodType)
    setData(data.length > 0 ? data : [])
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
