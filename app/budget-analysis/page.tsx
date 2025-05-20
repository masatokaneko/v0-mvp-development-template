import type { Metadata } from "next"
import { BudgetFilter } from "@/components/budget/budget-filter"
import { BudgetSummary } from "@/components/budget/budget-summary"
import { BudgetComparisonChart } from "@/components/budget/budget-comparison-chart"
import { BudgetTable } from "@/components/budget/budget-table"
import { BudgetActualComparisonTable } from "@/components/budget/budget-actual-comparison-table"

export const metadata: Metadata = {
  title: "予算管理",
  description: "予算の設定と実績比較",
}

export default function BudgetAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">予算管理</h2>
      </div>

      <BudgetFilter />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BudgetSummary />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <BudgetComparisonChart />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <BudgetActualComparisonTable />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <BudgetTable />
      </div>
    </div>
  )
}
