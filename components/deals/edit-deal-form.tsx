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
import { DealType } from "@prisma/client"
import { updateDeal } from "@/app/actions/deal-actions"

type EditDealFormProps = {
  id: string
}

export function EditDealForm({ id }: EditDealFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([])
  const [deal, setDeal] = useState<any>(null)

  // 商談データの取得
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`/api/deals/${id}`)
        if (!response.ok) throw new Error("商談データの取得に失敗しました")
        const data = await response.json()
        setDeal(data)
      } catch (error) {
        console.error("Error fetching deal:", error)
        setError("商談データの取得中にエラーが発生しました")
      }
    }

    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers")
        if (!response.ok) throw new Error("顧客データの取得に失敗しました")
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
        setError("顧客データの取得に失敗しました")
      } finally {
        setIsFetching(false)
      }
    }

    Promise.all([fetchDeal(), fetchCustomers()])
  }, [id])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateDeal(id, formData)

      if (result.success) {
        router.push(`/deals/${id}`)
        router.refresh()
      } else {
        setError(result.error || "商談の更新に失敗しました")
        if (result.fields) {
          setFieldErrors(result.fields)
        }
      }
    } catch (error) {
      console.error("Error updating deal:", error)
      setError("商談の更新中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="flex justify-center p-8">読み込み中...</div>
  }

  if (!deal && !isFetching) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>商談が見つかりませんでした</AlertDescription>
      </Alert>
    )
  }

  // 日付フォーマットの変換（YYYY-MM-DD形式に）
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>商談編集</CardTitle>
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
              defaultValue={deal?.name}
              className={fieldErrors.name ? "border-red-500" : ""}
            />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">
              顧客 <span className="text-red-500">*</span>
            </Label>
            <Select name="customerId" required defaultValue={deal?.customerId}>
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
              defaultValue={deal ? formatDateForInput(deal.dealDate) : ""}
              className={fieldErrors.dealDate ? "border-red-500" : ""}
            />
            {fieldErrors.dealDate && <p className="text-sm text-red-500">{fieldErrors.dealDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              種別 <span className="text-red-500">*</span>
            </Label>
            <Select name="type" required defaultValue={deal?.type}>
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
            更新
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
