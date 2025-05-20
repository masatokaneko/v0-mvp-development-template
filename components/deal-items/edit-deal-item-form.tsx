"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { ProductType } from "@prisma/client"
import { updateDealItem } from "@/app/actions/deal-item-actions"

type EditDealItemFormProps = {
  id: string
}

export function EditDealItemForm({ id }: EditDealItemFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [dealItem, setDealItem] = useState<any>(null)
  const [products, setProducts] = useState<{ id: string; name: string; type: ProductType }[]>([])

  // 契約アイテムデータの取得
  useEffect(() => {
    const fetchDealItem = async () => {
      try {
        const response = await fetch(`/api/deal-items/${id}`)
        if (!response.ok) {
          throw new Error("契約アイテムデータの取得に失敗しました")
        }
        const data = await response.json()
        setDealItem(data)

        // 商品データの取得
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) {
          throw new Error("商品データの取得に失敗しました")
        }
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("データの取得中にエラーが発生しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDealItem()
  }, [id])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    setFieldErrors({})

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateDealItem(id, formData)

      if (result.success) {
        router.push(`/deal-items/${id}`)
        router.refresh()
      } else {
        setError(result.error || "契約アイテムの更新に失敗しました")
        if (result.fields) {
          setFieldErrors(result.fields)
        }
      }
    } catch (error) {
      console.error("Error updating deal item:", error)
      setError("契約アイテムの更新中にエラーが発生しました")
    } finally {
      setIsSaving(false)
    }
  }

  // 税前金額から税後金額を計算（10%税率）
  const calculateAmountAfterTax = (amountBeforeTax: string) => {
    const amount = Number.parseFloat(amountBeforeTax)
    if (isNaN(amount)) return ""
    return (amount * 1.1).toFixed(0)
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !dealItem) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!dealItem) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>契約アイテムが見つかりませんでした</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // 日付をフォーム用にフォーマット（YYYY-MM-DD）
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>契約アイテム編集</CardTitle>
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
            <Label>商談</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {dealItem.deal.name} ({dealItem.deal.customer.name})
            </div>
          </div>

          <div className="space-y-2">
            <Label>商品</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {dealItem.product.name} ({dealItem.product.type === ProductType.LICENSE ? "ライセンス" : "サービス"})
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">
              商品名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              name="productName"
              placeholder="商品名を入力"
              required
              defaultValue={dealItem.productName}
              className={fieldErrors.productName ? "border-red-500" : ""}
            />
            {fieldErrors.productName && <p className="text-sm text-red-500">{fieldErrors.productName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" defaultValue={dealItem.type} required>
              <SelectTrigger id="type" className={fieldErrors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductType.LICENSE}>ライセンス</SelectItem>
                <SelectItem value={ProductType.SERVICE}>サービス</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.type && <p className="text-sm text-red-500">{fieldErrors.type}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amountBeforeTax">
                税前金額 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amountBeforeTax"
                name="amountBeforeTax"
                type="number"
                placeholder="税前金額を入力"
                required
                defaultValue={dealItem.amountBeforeTax}
                className={fieldErrors.amountBeforeTax ? "border-red-500" : ""}
                onChange={(e) => {
                  const afterTaxInput = document.getElementById("amountAfterTax") as HTMLInputElement
                  if (afterTaxInput) {
                    afterTaxInput.value = calculateAmountAfterTax(e.target.value)
                  }
                }}
              />
              {fieldErrors.amountBeforeTax && <p className="text-sm text-red-500">{fieldErrors.amountBeforeTax}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountAfterTax">
                税後金額 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amountAfterTax"
                name="amountAfterTax"
                type="number"
                placeholder="税後金額を入力"
                required
                defaultValue={dealItem.amountAfterTax}
                className={fieldErrors.amountAfterTax ? "border-red-500" : ""}
              />
              {fieldErrors.amountAfterTax && <p className="text-sm text-red-500">{fieldErrors.amountAfterTax}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                開始日 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={formatDateForInput(dealItem.startDate)}
                className={fieldErrors.startDate ? "border-red-500" : ""}
              />
              {fieldErrors.startDate && <p className="text-sm text-red-500">{fieldErrors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                終了日 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={formatDateForInput(dealItem.endDate)}
                className={fieldErrors.endDate ? "border-red-500" : ""}
              />
              {fieldErrors.endDate && <p className="text-sm text-red-500">{fieldErrors.endDate}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            更新
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
