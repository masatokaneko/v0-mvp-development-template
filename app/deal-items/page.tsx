import type { Metadata } from "next"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"
import { dealItems } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "新規獲得契約アイテム一覧",
  description: "新規獲得契約アイテムの管理と詳細表示",
}

export default function DealItemsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">新規獲得契約アイテム一覧</h2>
        <div className="flex space-x-2">
          <Link href="/import?type=dealItems">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              データ取込
            </Button>
          </Link>
          <Link href="/deal-items/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規アイテム登録
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">商品名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">種別</th>
                <th className="px-4 py-3 text-left text-sm font-medium">契約期間</th>
                <th className="px-4 py-3 text-right text-sm font-medium">契約金額(税後)</th>
                <th className="px-4 py-3 text-right text-sm font-medium">アクション</th>
              </tr>
            </thead>
            <tbody>
              {dealItems.map((item) => (
                <tr key={item.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{item.productName}</td>
                  <td className="px-4 py-3 text-sm">{item.type === "LICENSE" ? "ライセンス" : "サービス"}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(item.startDate, { dateStyle: "short" })} 〜{" "}
                    {formatDate(item.endDate, { dateStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.amountAfterTax)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Link
                      href={`/deal-items/${item.id}`}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 mr-2"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/deal-items/${item.id}/monthly-sales`}
                      className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow hover:bg-secondary/90"
                    >
                      月次按分
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
