"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { DealType } from "@prisma/client"
import { createDeal } from "@/app/actions/deal-actions"

export function CreateDealForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([])

  // 顧客データの取得
  useState(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers")
        if (!response.ok) throw new Error("Failed to fetch customers")
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
        setError("顧客データの取得に失敗しました")
      }
    }

    fetchCustomers()
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createDeal(formData)

      if (result.success) {
        router.push(`/deals/${result.deal.id}`)
        router.refresh()
      } else {
        setError(result.error || "商談の作成に失敗しました")
        if (result.fields) {
          setFieldErrors(result.fields)
        }
      }
    } catch (error) {
      console.error("Error creating deal:", error)
      setError("商談の作成中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新規商談登録</CardTitle>
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
            <Label htmlFor="name">
              商談名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="商談名を入力"
              required
              className={fieldErrors.name ? "border-red-500" : ""}
            />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">
              顧客 <span className="text-red-500">*</span>
            </Label>
            <Select name="customerId" required>
              <SelectTrigger id="customerId" className={fieldErrors.customerId ? "border-red-500" : ""}>
                <SelectValue placeholder="顧客を選択" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.customerId && <p className="text-sm text-red-500">{fieldErrors.customerId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealDate">
              商談日 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dealDate"
              name="dealDate"
              type="date"
              required
              className={fieldErrors.dealDate ? "border-red-500" : ""}
            />
            {fieldErrors.dealDate && <p className="text-sm text-red-500">{fieldErrors.dealDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" required>
              <SelectTrigger id="type" className={fieldErrors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DealType.LICENSE}>ライセンス</SelectItem>
                <SelectItem value={DealType.SERVICE}>サービス</SelectItem>
                <SelectItem value={DealType.MIXED}>混合</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.type && <p className="text-sm text-red-500">{fieldErrors.type}</p>}
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
