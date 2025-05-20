import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Decimal } from "decimal.js"

type KPICardProps = {
  title: string
  value: string
  description?: string
  change?: number | Decimal
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
  trend?: "up" | "down" | "neutral"
  trendColor?: "green" | "red" | "neutral"
}

export function KPICard({
  title,
  value,
  description,
  change,
  changeLabel,
  icon,
  className,
  trend,
  trendColor,
}: KPICardProps) {
  const showChange = change !== undefined

  // 変化率の符号に基づいてトレンドを決定（明示的に指定されていない場合）
  const determinedTrend =
    trend ||
    (change instanceof Decimal
      ? change.greaterThan(0)
        ? "up"
        : change.lessThan(0)
          ? "down"
          : "neutral"
      : change && change > 0
        ? "up"
        : change && change < 0
          ? "down"
          : "neutral")

  // トレンドの色を決定（明示的に指定されていない場合）
  const determinedTrendColor =
    trendColor || (determinedTrend === "up" ? "green" : determinedTrend === "down" ? "red" : "neutral")

  // トレンドの色に基づいてCSSクラスを決定
  const trendColorClass =
    determinedTrendColor === "green"
      ? "text-green-600"
      : determinedTrendColor === "red"
        ? "text-red-600"
        : "text-gray-500"

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {showChange && (
          <div className="flex items-center space-x-1 mt-2">
            <span className={cn("text-xs font-medium flex items-center", trendColorClass)}>
              {determinedTrend === "up" && <ArrowUpIcon className="h-3 w-3 mr-1" />}
              {determinedTrend === "down" && <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {change instanceof Decimal ? change.toString() : change}%
            </span>
            {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
