import { KPICard } from "@/components/dashboard/kpi-card"
import { BarChart3, TrendingUp, DollarSign, PieChart } from "lucide-react"

export function BudgetSummary() {
  return (
    <>
      <KPICard
        title="売上予算達成率"
        value="106.3%"
        description="2024年5月"
        change={6.3}
        changeLabel="vs 目標"
        trend="up"
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <KPICard
        title="費用予算達成率"
        value="93.5%"
        description="2024年5月"
        change={-6.5}
        changeLabel="vs 目標"
        trend="down"
        trendColor="green"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="営業利益予算達成率"
        value="117.4%"
        description="2024年5月"
        change={17.4}
        changeLabel="vs 目標"
        trend="up"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KPICard
        title="営業利益率"
        value="31.8%"
        description="2024年5月"
        change={3.1}
        changeLabel="vs 予算"
        trend="up"
        icon={<PieChart className="h-4 w-4" />}
      />
    </>
  )
}
