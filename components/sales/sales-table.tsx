"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

// 月次売上データの型定義
type SalesTableData = {
  id: string
  dealItemId: string
  dealName: string
  customerName: string
  productName: string
  type: string
  year: number
  month: number
  amount: number
  startDate: Date
  endDate: Date
}

// モックデータを生成
const generateSalesTableData = (): SalesTableData[] => {
  // 実際のアプリケーションではAPIから取得するデータ
  return [
    {
      id: "sale1",
      dealItemId: "item1",
      dealName: "株式会社テクノロジー 基本契約",
      customerName: "株式会社テクノロジー",
      productName: "エンタープライズライセンス",
      type: "LICENSE",
      year: 2024,
      month: 1,
      amount: 91667,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    },
    {
      id: "sale2",
      dealItemId: "item1",
      dealName: "株式会社テクノロジー 基本契約",
      customerName: "株式会社テクノロジー",
      productName: "エンタープライズライセンス",
      type: "LICENSE",
      year: 2024,
      month: 2,
      amount: 91667,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    },
    {
      id: "sale3",
      dealItemId: "item2",
      dealName: "株式会社テクノロジー 基本契約",
      customerName: "株式会社テクノロジー",
      productName: "コンサルティングサービス",
      type: "SERVICE",
      year: 2024,
      month: 1,
      amount: 183333,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-03-15"),
    },
    {
      id: "sale4",
      dealItemId: "item2",
      dealName: "株式会社テクノロジー 基本契約",
      customerName: "株式会社テクノロジー",
      productName: "コンサルティングサービス",
      type: "SERVICE",
      year: 2024,
      month: 2,
      amount: 183333,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-03-15"),
    },
    {
      id: "sale5",
      dealItemId: "item2",
      dealName: "株式会社テクノロジー 基本契約",
      customerName: "株式会社テクノロジー",
      productName: "コンサルティングサービス",
      type: "SERVICE",
      year: 2024,
      month: 3,
      amount: 183333,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-03-15"),
    },
    {
      id: "sale6",
      dealItemId: "item3",
      dealName: "株式会社イノベーション 年間契約",
      customerName: "株式会社イノベーション",
      productName: "プレミアムライセンス",
      type: "LICENSE",
      year: 2024,
      month: 2,
      amount: 137500,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2025-01-31"),
    },
    {
      id: "sale7",
      dealItemId: "item3",
      dealName: "株式会社イノベーション 年間契約",
      customerName: "株式会社イノベーション",
      productName: "プレミアムライセンス",
      type: "LICENSE",
      year: 2024,
      month: 3,
      amount: 137500,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2025-01-31"),
    },
    {
      id: "sale8",
      dealItemId: "item4",
      dealName: "株式会社デジタルソリューション 導入支援",
      customerName: "株式会社デジタルソリューション",
      productName: "カスタマイズ開発",
      type: "SERVICE",
      year: 2024,
      month: 3,
      amount: 293333,
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-06-15"),
    },
    {
      id: "sale9",
      dealItemId: "item4",
      dealName: "株式会社デジタルソリューション 導入支援",
      customerName: "株式会社デジタルソリューション",
      productName: "カスタマイズ開発",
      type: "SERVICE",
      year: 2024,
      month: 4,
      amount: 293333,
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-06-15"),
    },
    {
      id: "sale10",
      dealItemId: "item4",
      dealName: "株式会社デジタルソリューション 導入支援",
      customerName: "株式会社デジタルソリューション",
      productName: "カスタマイズ開発",
      type: "SERVICE",
      year: 2024,
      month: 5,
      amount: 293333,
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-06-15"),
    },
  ]
}

export function SalesTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState("10")
  const salesData = generateSalesTableData()

  // ページネーション用の計算
  const totalItems = salesData.length
  const totalPages = Math.ceil(totalItems / Number.parseInt(pageSize))
  const startIndex = (page - 1) * Number.parseInt(pageSize)
  const endIndex = Math.min(startIndex + Number.parseInt(pageSize), totalItems)
  const currentPageData = salesData.slice(startIndex, endIndex)

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>月次按分売上一覧</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            CSV出力
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Excel出力
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
                <TableHead>顧客名</TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>種別</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead>契約期間</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.year}年</TableCell>
                  <TableCell>{sale.month}月</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.productName}</TableCell>
                  <TableCell>{sale.type === "LICENSE" ? "ライセンス" : "サービス"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                  <TableCell>
                    {formatDate(sale.startDate, { dateStyle: "short" })} 〜{" "}
                    {formatDate(sale.endDate, { dateStyle: "short" })}
                  </TableCell>
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
