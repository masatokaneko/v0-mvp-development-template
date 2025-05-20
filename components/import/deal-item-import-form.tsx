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

// モックデータ
const mockImportData = [
  {
    id: 1,
    col1: "DEAL-001",
    col2: "PROD-001",
    col3: "エンタープライズライセンス追加",
    col4: "LICENSE",
    col5: 500000,
    col6: 550000,
    col7: "2024-07-01",
    col8: "2025-06-30",
  },
  {
    id: 2,
    col1: "DEAL-002",
    col2: "PROD-002",
    col3: "コンサルティングサービス",
    col4: "SERVICE",
    col5: 300000,
    col6: 330000,
    col7: "2024-07-15",
    col8: "2024-10-15",
  },
  {
    id: 3,
    col1: "DEAL-003",
    col2: "PROD-003",
    col3: "プレミアムライセンス",
    col4: "LICENSE",
    col5: 800000,
    col6: 880000,
    col7: "2024-08-01",
    col8: "2025-07-31",
  },
  {
    id: 4,
    col1: "DEAL-003",
    col2: "PROD-004",
    col3: "トレーニングサービス",
    col4: "SERVICE",
    col5: 200000,
    col6: 220000,
    col7: "2024-08-15",
    col8: "2024-09-15",
  },
]

// 列マッピングオプション
const columnOptions = [
  { value: "dealId", label: "商談ID" },
  { value: "productId", label: "商品ID" },
  { value: "productName", label: "商品名" },
  { value: "type", label: "種別" },
  { value: "amountBeforeTax", label: "税前金額" },
  { value: "amountAfterTax", label: "税後金額" },
  { value: "startDate", label: "開始日" },
  { value: "endDate", label: "終了日" },
  { value: "ignore", label: "無視" },
]

export function DealItemImportForm() {
  const [columnMapping, setColumnMapping] = useState({
    col1: "dealId",
    col2: "productId",
    col3: "productName",
    col4: "type",
    col5: "amountBeforeTax",
    col6: "amountAfterTax",
    col7: "startDate",
    col8: "endDate",
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
      const errors = ["2行目: 商談ID「DEAL-002」が存在しません。", "4行目: 終了日が開始日より前になっています。"]

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

    if (mappedField === "amountBeforeTax" || mappedField === "amountAfterTax") {
      return formatCurrency(value)
    }

    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>契約アイテムデータのプレビューとマッピング</CardTitle>
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
              4件の契約アイテムデータが正常にインポートされました。
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
