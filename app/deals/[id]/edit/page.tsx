import type { Metadata } from "next"
import { EditDealForm } from "@/components/deals/edit-deal-form"

export const metadata: Metadata = {
  title: "商談編集",
  description: "商談情報の編集",
}

export default function EditDealPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">商談編集</h2>
      </div>
      <EditDealForm id={params.id} />
    </div>
  )
}
