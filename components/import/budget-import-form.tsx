"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"
import { BudgetType, ProductType } from "@prisma/client"

// モックデータ
const mockImportData = [
  {
    id: 1,
    col1: "2024",
    col2: "1",
    col3: null,
    col4: "SALES",
    col5: null,
    col6: "LICENSE",
    col7: 800000,
  },
  {
    id: 2,
    col1: "2024",
    col2: "2",
    col3: null,
    col4: "SALES",
    col5: null,
    col6: "LICENSE",
    col7: 850000,
  },
  {
    id: 3,
    col1: "2024",
    col2: null,
    col3: "1",
    col4: "COST_OF_SALES",
    col5: "ライセンス原価",
    col6: null,
    col7: 240000,
  },
  {
    id: 4,
    col1: "2024",
    col2: null,
    col3: "2",
    col4: "COST_OF_SALES",
    col5: "サービス原価",
    col6: null,
    col7: 180000,
  },
  {
    id: 5,
    col1: "2024",
    col2: null,
    col3: null,
    col4: "OPERATING_PROFIT",
    col5: null,
    col6: null,
    col7: 3600000,
  },
]

// 列マッピングオプション
const columnOptions = [
  { value: "year", label: "年度" },
  { value: "month", label: "月" },
  { value: "quarter", label: "四半期" },
  { value: "type", label: "予算種別" },
  { value: "category", label: "カテゴリ" },
  { value: "salesType", label: "売上種別" },
  { value: "amount", label: "金額" },
  { value: "ignore", label: "無視" },
]

export function BudgetImportForm() {
  const [columnMapping, setColumnMapping] = useState({
    col1: "year",
    col2: "month",
    col3: "quarter",
    col4: "type",
    col5: "category",
    col6: "salesType",
    col7: "amount",
  })
  const [importStatus, setImportStatus] = useState<"idle" | "validating" | "importing" | "success" | "error">("idle")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleColumnMappingChange = (column: string, value: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [column]: value,
    }))
  }

  const handleValidate = () => {
    setImportStatus("validating")

    // バリデーションのシミュレーション
    setTimeout(() => {
      // モックのバリデーションエラー
      const errors = [
        "3行目: 予算種別「COST_OF_SALES」の場合、カテゴリは必須です。",
        "5行目: 年間予算の場合、月と四半期は両方nullである必要があります。",
      ]

      if (errors.length > 0) {
        setValidationErrors(errors)
        setImportStatus("error")
      } else {
        setValidationErrors([])
        setImportStatus("idle")
      }
    }, 1000)
  }

  const handleImport = () => {
    setImportStatus("importing")

    // インポート処理のシミュレーション
    setTimeout(() => {
      setImportStatus("success")
    }, 2000)
  }

  // 表示用のフォーマット関数
  const formatCellValue = (column: string, value: any) => {
    const mappedField = columnMapping[column as keyof typeof columnMapping]

    if (mappedField === "amount") {
      return value !== null ? formatCurrency(value) : ""
    }

    if (mappedField === "type" && value !== null) {
      const budgetTypeLabels: Record<string, string> = {
        [BudgetType.SALES]: "売上",
        [BudgetType.COST_OF_SALES]: "売上原価",
        [BudgetType.SG_AND_A]: "販管費",
        [BudgetType.OPERATING_PROFIT]: "営業利益",
      }
      return budgetTypeLabels[value] || value
    }

    if (mappedField === "salesType" && value !== null) {
      const salesTypeLabels: Record<string, string> = {
        [ProductType.LICENSE]: "ライセンス",
        [ProductType.SERVICE]: "サービス",
      }
      return salesTypeLabels[value] || value
    }

    return value !== null ? value : ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>予算データのプレビューとマッピング</CardTitle>
        <CardDescription>インポートするデータの列と項目のマッピングを設定してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {importStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>バリデーションエラー</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {importStatus === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">インポート成功</AlertTitle>
            <AlertDescription className="text-green-700">
              5件の予算データが正常にインポートされました。
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">列マッピング設定</div>
          <div className="grid grid-cols-4 gap-4">
            {Object.keys(columnMapping).map((column) => (
              <div key={column} className="space-y-1">
                <Label htmlFor={`mapping-${column}`}>列 {column.replace("col", "")}</Label>
                <Select
                  value={columnMapping[column as keyof typeof columnMapping]}
                  onValueChange={(value) => handleColumnMappingChange(column, value)}
                  disabled={importStatus === "importing" || importStatus === "success"}
                >
                  <SelectTrigger id={`mapping-${column}`}>
                    <SelectValue placeholder="項目を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(columnMapping).map((column) => (
                  <TableHead key={column}>
                    {columnOptions.find(
                      (option) => option.value === columnMapping[column as keyof typeof columnMapping],
                    )?.label || "無視"}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockImportData.map((row) => (
                <TableRow key={row.id}>
                  {Object.keys(columnMapping).map((column) => (
                    <TableCell key={`${row.id}-${column}`}>
                      {formatCellValue(column, row[column as keyof typeof row])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">インポート時の注意事項</h4>
          <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
            <li>月次予算の場合は「月」列に値を設定し、「四半期」列はnullにしてください。</li>
            <li>四半期予算の場合は「四半期」列に値を設定し、「月」列はnullにしてください。</li>
            <li>年間予算の場合は「月」列と「四半期」列の両方をnullにしてください。</li>
            <li>予算種別が「SALES」の場合は「売上種別」を設定してください。</li>
            <li>予算種別が「COST_OF_SALES」または「SG_AND_A」の場合は「カテゴリ」を設定してください。</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleValidate}
          disabled={importStatus === "validating" || importStatus === "importing" || importStatus === "success"}
        >
          バリデーション
        </Button>
        <Button
          onClick={handleImport}
          disabled={
            importStatus === "validating" ||
            importStatus === "importing" ||
            importStatus === "success" ||
            importStatus === "error"
          }
        >
          インポート実行
        </Button>
      </CardFooter>
    </Card>
  )
}
