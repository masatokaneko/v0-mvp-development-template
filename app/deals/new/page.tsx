import type { Metadata } from "next"
import { CreateDealForm } from "@/components/deals/create-deal-form"

export const metadata: Metadata = {
  title: "新規商談登録",
  description: "新しい商談を登録します",
}

export default function NewDealPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">新規商談登録</h2>
      </div>
      <CreateDealForm />
    </div>
  )
}
