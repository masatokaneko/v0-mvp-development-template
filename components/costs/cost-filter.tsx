"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar } from "lucide-react"
import { CostType } from "@prisma/client"

export function CostFilter() {
  const [year, setYear] = useState("2024")
  const [quarter, setQuarter] = useState("all")
  const [month, setMonth] = useState("all")
  const [costType, setCostType] = useState("all")
  const [category, setCategory] = useState("all")

  const handleReset = () => {
    setYear("2024")
    setQuarter("all")
    setMonth("all")
    setCostType("all")
    setCategory("all")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

          <div className="space-y-2">
            <Label htmlFor="costType">費用種別</Label>
            <Select value={costType} onValueChange={setCostType}>
              <SelectTrigger id="costType">
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全種別</SelectItem>
                <SelectItem value={CostType.COST_OF_SALES_LICENSE}>ライセンス原価</SelectItem>
                <SelectItem value={CostType.COST_OF_SALES_SERVICE}>サービス原価</SelectItem>
                <SelectItem value={CostType.SG_AND_A}>販管費</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全カテゴリ</SelectItem>
                <SelectItem value="ライセンス原価">ライセンス原価</SelectItem>
                <SelectItem value="サービス原価">サービス原価</SelectItem>
                <SelectItem value="人件費">人件費</SelectItem>
                <SelectItem value="オフィス費">オフィス費</SelectItem>
                <SelectItem value="広告宣伝費">広告宣伝費</SelectItem>
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
