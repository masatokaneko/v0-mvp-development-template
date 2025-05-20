import type { Metadata } from "next"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { deals } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "商談一覧",
  description: "商談の管理と詳細表示",
}

export default function DealsPage() {
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
              {deals.map((deal) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
