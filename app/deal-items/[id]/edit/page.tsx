import type { Metadata } from "next"
import { EditDealItemForm } from "@/components/deal-items/edit-deal-item-form"

export const metadata: Metadata = {
  title: "契約アイテム編集",
  description: "契約アイテムの情報を編集します",
}

export default function EditDealItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">契約アイテム編集</h2>
      </div>
      <EditDealItemForm id={params.id} />
    </div>
  )
}
