import type { Metadata } from "next"
import { CostFilter } from "@/components/costs/cost-filter"
import { CostSummary } from "@/components/costs/cost-summary"
import { CostTrendChart } from "@/components/costs/cost-trend-chart"
import { CostBreakdownChart } from "@/components/costs/cost-breakdown-chart"
import { CostTable } from "@/components/costs/cost-table"

export const metadata: Metadata = {
  title: "費用分析",
  description: "費用データの詳細分析と可視化",
}

export default function CostsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">費用分析</h2>
      </div>

      <CostFilter />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CostSummary />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CostTrendChart />
        <CostBreakdownChart />
      </div>

      <CostTable />
    </div>
  )
}
