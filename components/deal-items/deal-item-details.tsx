"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Edit, Trash2, BarChart } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import { deleteDealItem } from "@/app/actions/deal-item-actions"

type DealItemDetailsProps = {
  id: string
}

export function DealItemDetails({ id }: DealItemDetailsProps) {
  const router = useRouter()
  const [dealItem, setDealItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchDealItem = async () => {
      try {
        const response = await fetch(`/api/deal-items/${id}`)
        if (!response.ok) {
          throw new Error("契約アイテムデータの取得に失敗しました")
        }
        const data = await response.json()
        setDealItem(data)
      } catch (error) {
        console.error("Error fetching deal item:", error)
        setError("契約アイテムデータの取得中にエラーが発生しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDealItem()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("この契約アイテムを削除してもよろしいですか？関連する月次按分売上もすべて削除されます。")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteDealItem(id)
      if (result.success) {
        router.push(`/deals/${dealItem.dealId}`)
        router.refresh()
      } else {
        setError(result.error || "契約アイテムの削除に失敗しました")
      }
    } catch (error) {
      console.error("Error deleting deal item:", error)
      setError("契約アイテムの削除中にエラーが発生しました")
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

  if (!dealItem) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>契約アイテムが見つかりませんでした</AlertDescription>
      </Alert>
    )
  }

  // 月次按分売上の合計金額を計算
  const totalMonthlySales = dealItem.monthlySales.reduce((sum: number, sale: any) => sum + Number(sale.amount), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>契約アイテム詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">商談名</dt>
              <dd className="mt-1 text-lg">
                <Link href={`/deals/${dealItem.dealId}`} className="text-blue-600 hover:underline">
                  {dealItem.deal.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">顧客名</dt>
              <dd className="mt-1 text-lg">{dealItem.deal.customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">商品名</dt>
              <dd className="mt-1">{dealItem.productName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">種別</dt>
              <dd className="mt-1">{dealItem.type === "LICENSE" ? "ライセンス" : "サービス"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">契約期間</dt>
              <dd className="mt-1">
                {formatDate(dealItem.startDate, { dateStyle: "medium" })} 〜{" "}
                {formatDate(dealItem.endDate, { dateStyle: "medium" })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">契約日数</dt>
              <dd className="mt-1">
                {Math.floor(
                  (new Date(dealItem.endDate).getTime() - new Date(dealItem.startDate).getTime()) /
                    (1000 * 60 * 60 * 24) +
                    1,
                )}
                日
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">税前金額</dt>
              <dd className="mt-1">{formatCurrency(dealItem.amountBeforeTax)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">税後金額</dt>
              <dd className="mt-1 font-bold">{formatCurrency(dealItem.amountAfterTax)}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/deal-items/${id}/edit`}>
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
          <CardTitle>月次按分売上</CardTitle>
          <Button variant="outline" asChild>
            <Link href={`/deal-items/${id}/monthly-sales`}>
              <BarChart className="mr-2 h-4 w-4" />
              按分詳細
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {dealItem.monthlySales.length === 0 ? (
            <p className="text-center py-4 text-gray-500">月次按分売上がありません</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>年</TableHead>
                    <TableHead>月</TableHead>
                    <TableHead>適用日数</TableHead>
                    <TableHead className="text-right">按分金額</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealItem.monthlySales.map((sale: any) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.year}年</TableCell>
                      <TableCell>{sale.month}月</TableCell>
                      <TableCell>
                        {sale.appliedDays}日 / {sale.totalDays}日
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">
                      合計
                    </TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalMonthlySales)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
