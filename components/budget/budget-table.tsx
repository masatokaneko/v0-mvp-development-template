"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, FileText, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { BudgetType, ProductType } from "@prisma/client"

// 予算データの型定義
type BudgetTableData = {
  id: string
  year: number
  month: number | null
  quarter: number | null
  type: BudgetType
  category: string | null
  salesType: ProductType | null
  amount: number
}

// モックデータを生成
const generateBudgetTableData = (): BudgetTableData[] => {
  // 実際のアプリケーションではAPIから取得するデータ
  return [
    {
      id: "budget1",
      year: 2024,
      month: 1,
      quarter: null,
      type: BudgetType.SALES,
      category: null,
      salesType: ProductType.LICENSE,
      amount: 800000,
    },
    {
      id: "budget2",
      year: 2024,
      month: 2,
      quarter: null,
      type: BudgetType.SALES,
      category: null,
      salesType: ProductType.LICENSE,
      amount: 850000,
    },
    {
      id: "budget6",
      year: 2024,
      month: 1,
      quarter: null,
      type: BudgetType.SALES,
      category: null,
      salesType: ProductType.SERVICE,
      amount: 400000,
    },
    {
      id: "budget7",
      year: 2024,
      month: 2,
      quarter: null,
      type: BudgetType.SALES,
      category: null,
      salesType: ProductType.SERVICE,
      amount: 450000,
    },
    {
      id: "budget11",
      year: 2024,
      month: 1,
      quarter: null,
      type: BudgetType.COST_OF_SALES,
      category: "ライセンス原価",
      salesType: null,
      amount: 240000,
    },
    {
      id: "budget12",
      year: 2024,
      month: 2,
      quarter: null,
      type: BudgetType.COST_OF_SALES,
      category: "ライセンス原価",
      salesType: null,
      amount: 255000,
    },
    {
      id: "budget16",
      year: 2024,
      month: 1,
      quarter: null,
      type: BudgetType.COST_OF_SALES,
      category: "サービス原価",
      salesType: null,
      amount: 160000,
    },
    {
      id: "budget17",
      year: 2024,
      month: 2,
      quarter: null,
      type: BudgetType.COST_OF_SALES,
      category: "サービス原価",
      salesType: null,
      amount: 180000,
    },
    {
      id: "budget21",
      year: 2024,
      month: 1,
      quarter: null,
      type: BudgetType.SG_AND_A,
      category: "人件費",
      salesType: null,
      amount: 480000,
    },
    {
      id: "budget22",
      year: 2024,
      month: 2,
      quarter: null,
      type: BudgetType.SG_AND_A,
      category: "人件費",
      salesType: null,
      amount: 480000,
    },
  ]
}

export function BudgetTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState("10")
  const budgetsData = generateBudgetTableData()

  // ページネーション用の計算
  const totalItems = budgetsData.length
  const totalPages = Math.ceil(totalItems / Number.parseInt(pageSize))
  const startIndex = (page - 1) * Number.parseInt(pageSize)
  const endIndex = Math.min(startIndex + Number.parseInt(pageSize), totalItems)
  const currentPageData = budgetsData.slice(startIndex, endIndex)

  // ページ変更ハンドラー
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  // 予算種別の表示名を取得
  const getBudgetTypeName = (type: BudgetType): string => {
    switch (type) {
      case BudgetType.SALES:
        return "売上"
      case BudgetType.COST_OF_SALES:
        return "売上原価"
      case BudgetType.SG_AND_A:
        return "販管費"
      case BudgetType.OPERATING_PROFIT:
        return "営業利益"
      default:
        return type
    }
  }

  // 売上種別の表示名を取得
  const getSalesTypeName = (type: ProductType | null): string => {
    if (!type) return "-"
    switch (type) {
      case ProductType.LICENSE:
        return "ライセンス"
      case ProductType.SERVICE:
        return "サービス"
      default:
        return type
    }
  }

  // 期間の表示
  const getPeriodDisplay = (month: number | null, quarter: number | null): string => {
    if (month !== null) return `${month}月`
    if (quarter !== null) return `Q${quarter}`
    return "年間"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>予算一覧</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            CSV出力
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Excel出力
          </Button>
          <Button asChild>
            <Link href="/budget-analysis/new">
              <Plus className="mr-2 h-4 w-4" />
              新規予算登録
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年度</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>売上種別</TableHead>
                <TableHead className="text-right">金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.year}年</TableCell>
                  <TableCell>{getPeriodDisplay(budget.month, budget.quarter)}</TableCell>
                  <TableCell>{getBudgetTypeName(budget.type)}</TableCell>
                  <TableCell>{budget.category || "-"}</TableCell>
                  <TableCell>{getSalesTypeName(budget.salesType)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(budget.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {totalItems}件中 {startIndex + 1}-{endIndex}件を表示
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">表示件数</p>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">前のページ</span>
              </Button>
              <div className="text-sm">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">次のページ</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
