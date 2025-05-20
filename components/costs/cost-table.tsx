"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, FileText, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

// 費用データの型定義
type CostTableData = {
  id: string
  year: number
  month: number
  type: string
  category: string
  amount: number
  description: string
}

// モックデータを生成
const generateCostTableData = (): CostTableData[] => {
  // 実際のアプリケーションではAPIから取得するデータ
  return [
    {
      id: "cost1",
      year: 2024,
      month: 1,
      type: "COST_OF_SALES_LICENSE",
      category: "ライセンス原価",
      amount: 200000,
      description: "1月ライセンス原価",
    },
    {
      id: "cost2",
      year: 2024,
      month: 2,
      type: "COST_OF_SALES_LICENSE",
      category: "ライセンス原価",
      amount: 220000,
      description: "2月ライセンス原価",
    },
    {
      id: "cost6",
      year: 2024,
      month: 1,
      type: "COST_OF_SALES_SERVICE",
      category: "サービス原価",
      amount: 150000,
      description: "1月サービス原価",
    },
    {
      id: "cost7",
      year: 2024,
      month: 2,
      type: "COST_OF_SALES_SERVICE",
      category: "サービス原価",
      amount: 160000,
      description: "2月サービス原価",
    },
    {
      id: "cost11",
      year: 2024,
      month: 1,
      type: "SG_AND_A",
      category: "人件費",
      amount: 500000,
      description: "1月人件費",
    },
    {
      id: "cost12",
      year: 2024,
      month: 2,
      type: "SG_AND_A",
      category: "人件費",
      amount: 500000,
      description: "2月人件費",
    },
    {
      id: "cost16",
      year: 2024,
      month: 1,
      type: "SG_AND_A",
      category: "オフィス費",
      amount: 100000,
      description: "1月オフィス費",
    },
    {
      id: "cost17",
      year: 2024,
      month: 2,
      type: "SG_AND_A",
      category: "オフィス費",
      amount: 100000,
      description: "2月オフィス費",
    },
    {
      id: "cost21",
      year: 2024,
      month: 1,
      type: "SG_AND_A",
      category: "広告宣伝費",
      amount: 80000,
      description: "1月広告宣伝費",
    },
    {
      id: "cost22",
      year: 2024,
      month: 2,
      type: "SG_AND_A",
      category: "広告宣伝費",
      amount: 90000,
      description: "2月広告宣伝費",
    },
  ]
}

export function CostTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState("10")
  const costsData = generateCostTableData()

  // ページネーション用の計算
  const totalItems = costsData.length
  const totalPages = Math.ceil(totalItems / Number.parseInt(pageSize))
  const startIndex = (page - 1) * Number.parseInt(pageSize)
  const endIndex = Math.min(startIndex + Number.parseInt(pageSize), totalItems)
  const currentPageData = costsData.slice(startIndex, endIndex)

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

  // 費用種別の表示名を取得
  const getCostTypeName = (type: string): string => {
    switch (type) {
      case "COST_OF_SALES_LICENSE":
        return "ライセンス原価"
      case "COST_OF_SALES_SERVICE":
        return "サービス原価"
      case "SG_AND_A":
        return "販管費"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>費用一覧</CardTitle>
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
            <Link href="/costs/new">
              <Plus className="mr-2 h-4 w-4" />
              新規費用登録
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年</TableHead>
                <TableHead>月</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{cost.year}年</TableCell>
                  <TableCell>{cost.month}月</TableCell>
                  <TableCell>{getCostTypeName(cost.type)}</TableCell>
                  <TableCell>{cost.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cost.amount)}</TableCell>
                  <TableCell>{cost.description}</TableCell>
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
