"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function DealsClientPage() {
  // APIから商談データを取得するロジックを追加
  const [deals, setDeals] = useState([])

  useEffect(() => {
    // APIからデータを取得
    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/deals")
        if (response.ok) {
          const data = await response.json()
          setDeals(data)
        }
      } catch (error) {
        console.error("商談データの取得に失敗しました:", error)
      }
    }

    fetchDeals()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">商談一覧</h2>
        <div className="flex space-x-2">
          <Link href="/import?type=deals">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              データ取込
            </Button>
          </Link>
          <Link href="/deals/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規商談登録
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">商談名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">顧客名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">商談日</th>
                <th className="px-4 py-3 text-left text-sm font-medium">計上会計期間</th>
                <th className="px-4 py-3 text-left text-sm font-medium">種別</th>
                <th className="px-4 py-3 text-right text-sm font-medium">アクション</th>
              </tr>
            </thead>
            <tbody>
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <tr key={deal.id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{deal.name}</td>
                    <td className="px-4 py-3 text-sm">{deal.customerName}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(deal.dealDate, { dateStyle: "medium" })}</td>
                    <td className="px-4 py-3 text-sm">
                      {deal.fiscalYear}年 Q{deal.fiscalQuarter}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {deal.type === "LICENSE" ? "ライセンス" : deal.type === "SERVICE" ? "サービス" : "混合"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    商談データがありません。新規商談を登録してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
