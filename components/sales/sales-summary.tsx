import { KPICard } from "@/components/dashboard/kpi-card"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export function SalesSummary() {
  return (
    <>
      <KPICard
        title="総売上"
        value={formatCurrency(5700000)}
        description="2024年1月-5月"
        change={5.6}
        changeLabel="vs 前年同期"
        trend="up"
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <KPICard
        title="ライセンス売上"
        value={formatCurrency(3500000)}
        description="2024年1月-5月"
        change={7.2}
        changeLabel="vs 前年同期"
        trend="up"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KPICard
        title="サービス売上"
        value={formatCurrency(2200000)}
        description="2024年1月-5月"
        change={3.1}
        changeLabel="vs 前年同期"
        trend="up"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KPICard
        title="顧客数"
        value="5"
        description="2024年1月-5月"
        change={25}
        changeLabel="vs 前年同期"
        trend="up"
        icon={<Users className="h-4 w-4" />}
      />
    </>
  )
}
