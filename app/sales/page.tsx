import type { Metadata } from "next"
import { SalesFilter } from "@/components/sales/sales-filter"
import { SalesSummary } from "@/components/sales/sales-summary"
import { SalesBreakdownChart } from "@/components/sales/sales-breakdown-chart"
import { SalesTrendChart } from "@/components/sales/sales-trend-chart"
import { SalesTable } from "@/components/sales/sales-table"

export const metadata: Metadata = {
  title: "売上分析",
  description: "売上データの詳細分析と可視化",
}

export default function SalesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">売上分析</h2>
      </div>

      <SalesFilter />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesSummary />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesTrendChart />
        <SalesBreakdownChart />
      </div>

      <SalesTable />
    </div>
  )
}
