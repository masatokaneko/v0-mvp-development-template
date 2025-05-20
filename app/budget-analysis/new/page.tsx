import type { Metadata } from "next"
import { CreateBudgetForm } from "@/components/budget/create-budget-form"

export const metadata: Metadata = {
  title: "新規予算登録",
  description: "新しい予算を登録します",
}

export default function NewBudgetPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">新規予算登録</h2>
      </div>
      <CreateBudgetForm />
    </div>
  )
}
