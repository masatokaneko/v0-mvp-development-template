import type { Metadata } from "next"
import { KPICard } from "@/components/dashboard/kpi-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { BudgetActualComparison } from "@/components/dashboard/budget-actual-comparison"
import { SalesByTypeChart } from "@/components/dashboard/sales-by-type-chart"
import { CostBreakdownChart } from "@/components/dashboard/cost-breakdown-chart"
import { ProfitTrendChart } from "@/components/dashboard/profit-trend-chart"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, DollarSign, TrendingUp, PieChart } from "lucide-react"

export const metadata: Metadata = {
  title: "経営ダッシュボード",
  description: "売上、費用、利益の可視化による経営状況の把握",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">経営ダッシュボード</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">2024年5月</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="月次売上"
          value={formatCurrency(1700000)}
          description="2024年5月"
          change={6.3}
          changeLabel="vs 予算"
          trend="up"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <KPICard
          title="月次費用"
          value={formatCurrency(1160000)}
          description="2024年5月"
          change={-6.5}
          changeLabel="vs 予算"
          trend="down"
          trendColor="green"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="営業利益"
          value={formatCurrency(540000)}
          description="2024年5月"
          change={17.4}
          changeLabel="vs 予算"
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="営業利益率"
          value="31.8%"
          description="2024年5月"
          change={3.1}
          changeLabel="vs 前月"
          trend="up"
          icon={<PieChart className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BudgetActualComparison />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfitTrendChart />
        <SalesByTypeChart />
        <CostBreakdownChart />
      </div>
    </div>
  )
}
