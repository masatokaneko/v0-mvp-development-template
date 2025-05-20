import type { Metadata } from "next"
import { CreateCostForm } from "@/components/costs/create-cost-form"

export const metadata: Metadata = {
  title: "新規費用登録",
  description: "新しい費用を登録します",
}

export default function NewCostPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">新規費用登録</h2>
      </div>
      <CreateCostForm />
    </div>
  )
}
