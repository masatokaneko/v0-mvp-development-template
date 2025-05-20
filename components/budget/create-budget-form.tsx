"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { BudgetType, ProductType } from "@prisma/client"

export function CreateBudgetForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [budgetType, setBudgetType] = useState<BudgetType | "">("")
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly" | "yearly">("monthly")
  const [showSalesType, setShowSalesType] = useState(false)
  const [showCategory, setShowCategory] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  // 予算種別が変更されたときの処理
  const handleBudgetTypeChange = (value: string) => {
    setBudgetType(value as BudgetType)

    // 売上種別の表示/非表示を設定
    setShowSalesType(value === BudgetType.SALES)

    // カテゴリの表示/非表示とリストを設定
    switch (value) {
      case BudgetType.COST_OF_SALES:
        setShowCategory(true)
        setCategories(["ライセンス原価", "サービス原価"])
        break
      case BudgetType.SG_AND_A:
        setShowCategory(true)
        setCategories(["人件費", "オフィス費", "広告宣伝費", "その他"])
        break
      default:
        setShowCategory(false)
        setCategories([])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const formData = new FormData(event.currentTarget)

      // 期間タイプに応じて月または四半期を設定
      let month = null
      let quarter = null

      if (periodType === "monthly") {
        month = Number(formData.get("month"))
      } else if (periodType === "quarterly") {
        quarter = Number(formData.get("quarter"))
      }

      const data = {
        year: Number(formData.get("year")),
        month,
        quarter,
        type: formData.get("type") as BudgetType,
        category: showCategory ? (formData.get("category") as string) : null,
        salesType: showSalesType ? (formData.get("salesType") as ProductType) : null,
        amount: Number(formData.get("amount")),
      }

      // APIを呼び出して予算を作成
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "予算の作成に失敗しました")
      }

      router.push("/budget-analysis")
      router.refresh()
    } catch (error) {
      console.error("Error creating budget:", error)
      setError(error instanceof Error ? error.message : "予算の作成中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新規予算登録</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="year">
              年度 <span className="text-red-500">*</span>
            </Label>
            <Select name="year" required>
              <SelectTrigger id="year" className={fieldErrors.year ? "border-red-500" : ""}>
                <SelectValue placeholder="年度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022年</SelectItem>
                <SelectItem value="2023">2023年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.year && <p className="text-sm text-red-500">{fieldErrors.year}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              期間タイプ <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              defaultValue="monthly"
              value={periodType}
              onValueChange={(value) => setPeriodType(value as "monthly" | "quarterly" | "yearly")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">月次</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="quarterly" />
                <Label htmlFor="quarterly">四半期</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">年次</Label>
              </div>
            </RadioGroup>
          </div>

          {periodType === "monthly" && (
            <div className="space-y-2">
              <Label htmlFor="month">
                月 <span className="text-red-500">*</span>
              </Label>
              <Select name="month" required>
                <SelectTrigger id="month" className={fieldErrors.month ? "border-red-500" : ""}>
                  <SelectValue placeholder="月を選択" />
                </SelectTrigger>
                <SelectContent>
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
              {fieldErrors.month && <p className="text-sm text-red-500">{fieldErrors.month}</p>}
            </div>
          )}

          {periodType === "quarterly" && (
            <div className="space-y-2">
              <Label htmlFor="quarter">
                四半期 <span className="text-red-500">*</span>
              </Label>
              <Select name="quarter" required>
                <SelectTrigger id="quarter" className={fieldErrors.quarter ? "border-red-500" : ""}>
                  <SelectValue placeholder="四半期を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Q1 (12月-2月)</SelectItem>
                  <SelectItem value="2">Q2 (3月-5月)</SelectItem>
                  <SelectItem value="3">Q3 (6月-8月)</SelectItem>
                  <SelectItem value="4">Q4 (9月-11月)</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.quarter && <p className="text-sm text-red-500">{fieldErrors.quarter}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">
              予算種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" required onValueChange={handleBudgetTypeChange}>
              <SelectTrigger id="type" className={fieldErrors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="予算種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BudgetType.SALES}>売上</SelectItem>
                <SelectItem value={BudgetType.COST_OF_SALES}>売上原価</SelectItem>
                <SelectItem value={BudgetType.SG_AND_A}>販管費</SelectItem>
                <SelectItem value={BudgetType.OPERATING_PROFIT}>営業利益</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.type && <p className="text-sm text-red-500">{fieldErrors.type}</p>}
          </div>

          {showCategory && (
            <div className="space-y-2">
              <Label htmlFor="category">
                カテゴリ <span className="text-red-500">*</span>
              </Label>
              <Select name="category" required>
                <SelectTrigger id="category" className={fieldErrors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.category && <p className="text-sm text-red-500">{fieldErrors.category}</p>}
            </div>
          )}

          {showSalesType && (
            <div className="space-y-2">
              <Label htmlFor="salesType">
                売上種別 <span className="text-red-500">*</span>
              </Label>
              <Select name="salesType" required>
                <SelectTrigger id="salesType" className={fieldErrors.salesType ? "border-red-500" : ""}>
                  <SelectValue placeholder="売上種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductType.LICENSE}>ライセンス</SelectItem>
                  <SelectItem value={ProductType.SERVICE}>サービス</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.salesType && <p className="text-sm text-red-500">{fieldErrors.salesType}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">
              金額 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="金額を入力"
              required
              className={fieldErrors.amount ? "border-red-500" : ""}
            />
            {fieldErrors.amount && <p className="text-sm text-red-500">{fieldErrors.amount}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登録
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
