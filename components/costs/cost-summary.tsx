import { KPICard } from "@/components/dashboard/kpi-card"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingDown, PieChart } from "lucide-react"

export function CostSummary() {
  return (
    <>
      <KPICard
        title="総費用"
        value={formatCurrency(3160000)}
        description="2024年1月-5月"
        change={-3.2}
        changeLabel="vs 予算"
        trend="down"
        trendColor="green"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="売上原価"
        value={formatCurrency(1160000)}
        description="2024年1月-5月"
        change={-5.7}
        changeLabel="vs 予算"
        trend="down"
        trendColor="green"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      <KPICard
        title="販管費"
        value={formatCurrency(2000000)}
        description="2024年1月-5月"
        change={-1.8}
        changeLabel="vs 予算"
        trend="down"
        trendColor="green"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      <KPICard
        title="売上原価率"
        value="20.4%"
        description="2024年1月-5月"
        change={-1.1}
        changeLabel="vs 前年同期"
        trend="down"
        trendColor="green"
        icon={<PieChart className="h-4 w-4" />}
      />
    </>
  )
}
