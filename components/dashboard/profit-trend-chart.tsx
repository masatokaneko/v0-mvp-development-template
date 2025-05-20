"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatPercent } from "@/lib/utils"

// 利益推移データの型定義
type ProfitTrendData = {
  period: string
  grossProfit: number
  operatingProfit: number
  grossProfitMargin: number
  operatingProfitMargin: number
}

// 期間タイプの型定義
type PeriodType = "monthly" | "quarterly" | "yearly"

// 表示タイプの型定義
type DisplayType = "amount" | "margin"

// カスタムツールチップの型定義
type CustomTooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
  displayType: DisplayType
}

// カスタムツールチップコンポーネント
const CustomTooltip = ({ active, payload, label, displayType }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {displayType === "amount" ? formatCurrency(entry.value) : formatPercent(entry.value / 100)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ProfitTrendChart() {
  const [periodType, setPeriodType] = useState<PeriodType>("monthly")
  const [displayType, setDisplayType] = useState<DisplayType>("amount")

  // モックデータを生成する関数を修正し、データが無い場合のガード処理を追加
  const generateMockData = (type: PeriodType): ProfitTrendData[] => {
    // 実際のAPIから取得するように変更する場合はここを修正
    return []
  }

  // データ取得部分にガード処理を追加
  const data = generateMockData(periodType)
  // データが空の場合は空の配列を使用
  const chartData = data.length > 0 ? data : []

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>利益推移</CardTitle>
          <div className="flex space-x-4">
            <Tabs
              defaultValue="amount"
              value={displayType}
              onValueChange={(value) => setDisplayType(value as DisplayType)}
            >
              <TabsList>
                <TabsTrigger value="amount">金額</TabsTrigger>
                <TabsTrigger value="margin">利益率</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs
              defaultValue="monthly"
              value={periodType}
              onValueChange={(value) => setPeriodType(value as PeriodType)}
            >
              <TabsList>
                <TabsTrigger value="monthly">月次</TabsTrigger>
                <TabsTrigger value="quarterly">四半期</TabsTrigger>
                <TabsTrigger value="yearly">年次</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => (displayType === "amount" ? `${value / 10000}万` : `${value}%`)} />
              <Tooltip content={<CustomTooltip displayType={displayType} />} />
              <Legend />
              {displayType === "amount" ? (
                <>
                  <Line type="monotone" dataKey="grossProfit" name="売上総利益" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="operatingProfit" name="営業利益" stroke="#06b6d4" />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="grossProfitMargin"
                    name="売上総利益率"
                    stroke="#4f46e5"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="operatingProfitMargin" name="営業利益率" stroke="#06b6d4" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
