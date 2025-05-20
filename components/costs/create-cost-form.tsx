"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { CostType } from "@prisma/client"

export function CreateCostForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [costType, setCostType] = useState<CostType | "">("")
  const [categories, setCategories] = useState<string[]>([])

  // 費用種別が変更されたときにカテゴリリストを更新
  const handleCostTypeChange = (value: string) => {
    setCostType(value as CostType)

    // 費用種別に基づいてカテゴリリストを設定
    switch (value) {
      case CostType.COST_OF_SALES_LICENSE:
        setCategories(["ライセンス原価"])
        break
      case CostType.COST_OF_SALES_SERVICE:
        setCategories(["サービス原価"])
        break
      case CostType.SG_AND_A:
        setCategories(["人件費", "オフィス費", "広告宣伝費", "その他"])
        break
      default:
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
      const data = {
        year: Number(formData.get("year")),
        month: Number(formData.get("month")),
        type: formData.get("type") as CostType,
        category: formData.get("category") as string,
        amount: Number(formData.get("amount")),
        description: formData.get("description") as string,
      }

      // APIを呼び出して費用を作成
      const response = await fetch("/api/costs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "費用の作成に失敗しました")
      }

      router.push("/costs")
      router.refresh()
    } catch (error) {
      console.error("Error creating cost:", error)
      setError(error instanceof Error ? error.message : "費用の作成中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新規費用登録</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">
                年 <span className="text-red-500">*</span>
              </Label>
              <Select name="year" required>
                <SelectTrigger id="year" className={fieldErrors.year ? "border-red-500" : ""}>
                  <SelectValue placeholder="年を選択" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              費用種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" required onValueChange={handleCostTypeChange}>
              <SelectTrigger id="type" className={fieldErrors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="費用種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CostType.COST_OF_SALES_LICENSE}>ライセンス原価</SelectItem>
                <SelectItem value={CostType.COST_OF_SALES_SERVICE}>サービス原価</SelectItem>
                <SelectItem value={CostType.SG_AND_A}>販管費</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.type && <p className="text-sm text-red-500">{fieldErrors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              カテゴリ <span className="text-red-500">*</span>
            </Label>
            <Select name="category" required disabled={categories.length === 0}>
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

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="説明を入力"
              className={fieldErrors.description ? "border-red-500" : ""}
            />
            {fieldErrors.description && <p className="text-sm text-red-500">{fieldErrors.description}</p>}
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
