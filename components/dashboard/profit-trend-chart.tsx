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

  // モックデータを生成する関数
  const generateMockData = (type: PeriodType): ProfitTrendData[] => {
    if (type === "monthly") {
      // 月次データ（直近6ヶ月）
      return [
        {
          period: "12月",
          grossProfit: 450000,
          operatingProfit: 150000,
          grossProfitMargin: 37.5,
          operatingProfitMargin: 12.5,
        },
        {
          period: "1月",
          grossProfit: 470000,
          operatingProfit: 170000,
          grossProfitMargin: 36.2,
          operatingProfitMargin: 13.1,
        },
        {
          period: "2月",
          grossProfit: 500000,
          operatingProfit: 200000,
          grossProfitMargin: 35.7,
          operatingProfitMargin: 14.3,
        },
        {
          period: "3月",
          grossProfit: 530000,
          operatingProfit: 230000,
          grossProfitMargin: 35.3,
          operatingProfitMargin: 15.3,
        },
        {
          period: "4月",
          grossProfit: 560000,
          operatingProfit: 260000,
          grossProfitMargin: 35.0,
          operatingProfitMargin: 16.3,
        },
        {
          period: "5月",
          grossProfit: 590000,
          operatingProfit: 290000,
          grossProfitMargin: 34.7,
          operatingProfitMargin: 17.1,
        },
      ]
    } else if (type === "quarterly") {
      // 四半期データ（直近4四半期）
      return [
        {
          period: "Q2 FY2023",
          grossProfit: 1350000,
          operatingProfit: 450000,
          grossProfitMargin: 37.5,
          operatingProfitMargin: 12.5,
        },
        {
          period: "Q3 FY2023",
          grossProfit: 1450000,
          operatingProfit: 550000,
          grossProfitMargin: 37.2,
          operatingProfitMargin: 14.1,
        },
        {
          period: "Q4 FY2023",
          grossProfit: 1550000,
          operatingProfit: 650000,
          grossProfitMargin: 36.9,
          operatingProfitMargin: 15.5,
        },
        {
          period: "Q1 FY2024",
          grossProfit: 1650000,
          operatingProfit: 750000,
          grossProfitMargin: 36.7,
          operatingProfitMargin: 16.7,
        },
      ]
    } else {
      // 年次データ（直近3年）
      return [
        {
          period: "FY2022",
          grossProfit: 4500000,
          operatingProfit: 1500000,
          grossProfitMargin: 33.3,
          operatingProfitMargin: 11.1,
        },
        {
          period: "FY2023",
          grossProfit: 5400000,
          operatingProfit: 2100000,
          grossProfitMargin: 36.0,
          operatingProfitMargin: 14.0,
        },
        {
          period: "FY2024",
          grossProfit: 6300000,
          operatingProfit: 2700000,
          grossProfitMargin: 38.2,
          operatingProfitMargin: 16.4,
        },
      ]
    }
  }

  const data = generateMockData(periodType)

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
