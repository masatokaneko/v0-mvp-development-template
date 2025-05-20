import type { Metadata } from "next"
import { CreateDealItemForm } from "@/components/deal-items/create-deal-item-form"

export const metadata: Metadata = {
  title: "新規契約アイテム登録",
  description: "新しい契約アイテムを登録します",
}

export default function NewDealItemPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">新規契約アイテム登録</h2>
      </div>
      <CreateDealItemForm />
    </div>
  )
}
