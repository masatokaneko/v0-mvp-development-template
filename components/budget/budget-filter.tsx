"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar } from "lucide-react"
import { BudgetType, ProductType } from "@prisma/client"

export function BudgetFilter() {
  const [year, setYear] = useState("2024")
  const [period, setPeriod] = useState("monthly")
  const [quarter, setQuarter] = useState("all")
  const [month, setMonth] = useState("all")
  const [budgetType, setBudgetType] = useState("all")
  const [salesType, setSalesType] = useState("all")

  const handleReset = () => {
    setYear("2024")
    setPeriod("monthly")
    setQuarter("all")
    setMonth("all")
    setBudgetType("all")
    setSalesType("all")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-2">
            <Label htmlFor="year">年度</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="年度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022年</SelectItem>
                <SelectItem value="2023">2023年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">期間</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="期間を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">月次</SelectItem>
                <SelectItem value="quarterly">四半期</SelectItem>
                <SelectItem value="yearly">年次</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "quarterly" && (
            <div className="space-y-2">
              <Label htmlFor="quarter">四半期</Label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger id="quarter">
                  <SelectValue placeholder="四半期を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="1">Q1 (12月-2月)</SelectItem>
                  <SelectItem value="2">Q2 (3月-5月)</SelectItem>
                  <SelectItem value="3">Q3 (6月-8月)</SelectItem>
                  <SelectItem value="4">Q4 (9月-11月)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {period === "monthly" && (
            <div className="space-y-2">
              <Label htmlFor="month">月</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="月を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="1">1月</SelectItem>
                  <SelectItem value="2">2月</SelectItem>
                  <SelectItem value="3">3月</SelectItem>
                  <SelectItem value="4">4月</SelectItem>
                  <SelectItem value="5">5月</SelectItem>
                  <SelectItem value="6">6月</SelectItem>
                  <SelectItem value="7">7月</SelectItem>
                  <SelectItem value="8">8月</SelectItem>
                  <SelectItem value="9">9月</SelectItem>
                  <SelectItem value="10">10月</SelectItem>
                  <SelectItem value="11">11月</SelectItem>
                  <SelectItem value="12">12月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="budgetType">予算種別</Label>
            <Select value={budgetType} onValueChange={setBudgetType}>
              <SelectTrigger id="budgetType">
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全種別</SelectItem>
                <SelectItem value={BudgetType.SALES}>売上</SelectItem>
                <SelectItem value={BudgetType.COST_OF_SALES}>売上原価</SelectItem>
                <SelectItem value={BudgetType.SG_AND_A}>販管費</SelectItem>
                <SelectItem value={BudgetType.OPERATING_PROFIT}>営業利益</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesType">売上種別</Label>
            <Select value={salesType} onValueChange={setSalesType}>
              <SelectTrigger id="salesType">
                <SelectValue placeholder="売上種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全種別</SelectItem>
                <SelectItem value={ProductType.LICENSE}>ライセンス</SelectItem>
                <SelectItem value={ProductType.SERVICE}>サービス</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            リセット
          </Button>
          <div className="space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              期間比較
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              詳細フィルター
            </Button>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              検索
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
