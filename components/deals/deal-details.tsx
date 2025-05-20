"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Edit, Trash2, Plus, FileText } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import { deleteDeal } from "@/app/actions/deal-actions"

type DealDetailsProps = {
  id: string
}

export function DealDetails({ id }: DealDetailsProps) {
  const router = useRouter()
  const [deal, setDeal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`/api/deals/${id}`)
        if (!response.ok) {
          throw new Error("商談データの取得に失敗しました")
        }
        const data = await response.json()
        setDeal(data)
      } catch (error) {
        console.error("Error fetching deal:", error)
        setError("商談データの取得中にエラーが発生しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeal()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("この商談を削除してもよろしいですか？関連する契約アイテムもすべて削除されます。")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteDeal(id)
      if (result.success) {
        router.push("/deals")
        router.refresh()
      } else {
        setError(result.error || "商談の削除に失敗しました")
      }
    } catch (error) {
      console.error("Error deleting deal:", error)
      setError("商談の削除中にエラーが発生しました")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">読み込み中...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!deal) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>商談が見つかりませんでした</AlertDescription>
      </Alert>
    )
  }

  // 契約アイテムの合計金額を計算
  const totalAmount = deal.dealItems.reduce((sum: number, item: any) => sum + Number(item.amountAfterTax), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>商談詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">商談名</dt>
              <dd className="mt-1 text-lg">{deal.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">顧客名</dt>
              <dd className="mt-1 text-lg">{deal.customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">商談日</dt>
              <dd className="mt-1">{formatDate(deal.dealDate, { dateStyle: "medium" })}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">計上会計期間</dt>
              <dd className="mt-1">
                {deal.fiscalYear}年 Q{deal.fiscalQuarter}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">種別</dt>
              <dd className="mt-1">
                {deal.type === "LICENSE" ? "ライセンス" : deal.type === "SERVICE" ? "サービス" : "混合"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">契約金額（税後）</dt>
              <dd className="mt-1 font-bold">{formatCurrency(totalAmount)}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/deals/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                編集
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>契約アイテム一覧</CardTitle>
          <Button asChild>
            <Link href={`/deal-items/new?dealId=${id}`}>
              <Plus className="mr-2 h-4 w-4" />
              新規アイテム登録
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {deal.dealItems.length === 0 ? (
            <p className="text-center py-4 text-gray-500">契約アイテムがありません</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品名</TableHead>
                    <TableHead>種別</TableHead>
                    <TableHead>契約期間</TableHead>
                    <TableHead className="text-right">契約金額（税後）</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deal.dealItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.type === "LICENSE" ? "ライセンス" : "サービス"}</TableCell>
                      <TableCell>
                        {formatDate(item.startDate, { dateStyle: "short" })} 〜{" "}
                        {formatDate(item.endDate, { dateStyle: "short" })}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amountAfterTax)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/deal-items/${item.id}`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">詳細</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
