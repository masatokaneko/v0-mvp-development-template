"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { ProductType } from "@prisma/client"
import { createDealItem } from "@/app/actions/deal-item-actions"

export function CreateDealItemForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dealId = searchParams.get("dealId")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [deals, setDeals] = useState<{ id: string; name: string }[]>([])
  const [products, setProducts] = useState<{ id: string; name: string; type: ProductType }[]>([])
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; type: ProductType } | null>(null)

  // 商談と商品データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 商談データの取得
        const dealsResponse = await fetch("/api/deals")
        if (!dealsResponse.ok) throw new Error("Failed to fetch deals")
        const dealsData = await dealsResponse.json()
        setDeals(dealsData)

        // 商品データの取得
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) throw new Error("Failed to fetch products")
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("データの取得に失敗しました")
      }
    }

    fetchData()
  }, [])

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId) || null
    setSelectedProduct(product)

    // フォームの商品名と種別を自動設定
    if (product) {
      const productNameInput = document.getElementById("productName") as HTMLInputElement
      if (productNameInput) {
        productNameInput.value = product.name
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createDealItem(formData)

      if (result.success) {
        router.push(`/deal-items/${result.dealItem.id}`)
        router.refresh()
      } else {
        setError(result.error || "契約アイテムの作成に失敗しました")
        if (result.fields) {
          setFieldErrors(result.fields)
        }
      }
    } catch (error) {
      console.error("Error creating deal item:", error)
      setError("契約アイテムの作成中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  // 税前金額から税後金額を計算（10%税率）
  const calculateAmountAfterTax = (amountBeforeTax: string) => {
    const amount = Number.parseFloat(amountBeforeTax)
    if (isNaN(amount)) return ""
    return (amount * 1.1).toFixed(0)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新規契約アイテム登録</CardTitle>
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
            <Label htmlFor="dealId">
              商談 <span className="text-red-500">*</span>
            </Label>
            <Select name="dealId" defaultValue={dealId || undefined} required>
              <SelectTrigger id="dealId" className={fieldErrors.dealId ? "border-red-500" : ""}>
                <SelectValue placeholder="商談を選択" />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.dealId && <p className="text-sm text-red-500">{fieldErrors.dealId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productId">
              商品 <span className="text-red-500">*</span>
            </Label>
            <Select name="productId" required onValueChange={handleProductChange}>
              <SelectTrigger id="productId" className={fieldErrors.productId ? "border-red-500" : ""}>
                <SelectValue placeholder="商品を選択" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.type === ProductType.LICENSE ? "ライセンス" : "サービス"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.productId && <p className="text-sm text-red-500">{fieldErrors.productId}</p>}
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
              className={fieldErrors.productName ? "border-red-500" : ""}
            />
            {fieldErrors.productName && <p className="text-sm text-red-500">{fieldErrors.productName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" defaultValue={selectedProduct?.type} required>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登録
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
