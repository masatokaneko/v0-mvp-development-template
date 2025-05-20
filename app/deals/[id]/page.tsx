import type { Metadata } from "next"
import { DealDetails } from "@/components/deals/deal-details"

export const metadata: Metadata = {
  title: "商談詳細",
  description: "商談の詳細情報",
}

export default function DealDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">商談詳細</h2>
      </div>
      <DealDetails id={params.id} />
    </div>
  )
}
