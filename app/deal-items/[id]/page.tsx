import type { Metadata } from "next"
import { DealItemDetails } from "@/components/deal-items/deal-item-details"

export const metadata: Metadata = {
  title: "契約アイテム詳細",
  description: "契約アイテムの詳細情報",
}

export default function DealItemDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">契約アイテム詳細</h2>
      </div>
      <DealItemDetails id={params.id} />
    </div>
  )
}
