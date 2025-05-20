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
    col1: "deal1",
    col2: "エンタープライズライセンス追加",
    col3: "LICENSE",
    col4: 500000,
    col5: 550000,
    col6: "2024-07-01",
    col7: "2025-06-30",
    col8: 1,
    col9: 1000000,
    col10: "備考1",
  },
  {
    id: 2,
    col1: "deal2",
    col2: "コンサルティングサービス",
    col3: "SERVICE",
    col4: 300000,
    col5: 330000,
    col6: "2024-07-15",
    col7: "2024-10-15",
    col8: 2,
    col9: 1500000,
    col10: "備考2",
  },
  {
    id: 3,
    col1: "deal3",
    col2: "プレミアムライセンス",
    col3: "LICENSE",
    col4: 800000,
    col5: 880000,
    col6: "2024-08-01",
    col7: "2025-07-31",
    col8: 3,
    col9: 2000000,
    col10: "備考3",
  },
  {
    id: 4,
    col1: "deal3",
    col2: "トレーニングサービス",
    col3: "SERVICE",
    col4: 200000,
    col5: 220000,
    col6: "2024-08-15",
    col7: "2024-09-15",
    col8: 4,
    col9: 2500000,
    col10: "備考4",
  },
]

// 列マッピングオプション
const columnOptions = [
  { value: "dealId", label: "商談ID" },
  { value: "productName", label: "商品名" },
  { value: "type", label: "種別" },
  { value: "quantity", label: "数量" },
  { value: "unitPrice", label: "単価" },
  { value: "taxRate", label: "税率" },
  { value: "amountBeforeTax", label: "税前金額" },
  { value: "amountAfterTax", label: "税後金額" },
  { value: "startDate", label: "開始日" },
  { value: "endDate", label: "終了日" },
  { value: "notes", label: "備考" },
  { value: "ignore", label: "無視" },
]

export function DealItemImportForm() {
  const [columnMapping, setColumnMapping] = useState({
    col1: "dealId",
    col2: "productName",
    col3: "type",
    col4: "amountBeforeTax",
    col5: "amountAfterTax",
    col6: "startDate",
    col7: "endDate",
    col8: "quantity",
    col9: "unitPrice",
    col10: "notes",
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
      const errors = ["2行目: 商談ID「deal2」が存在しません。", "4行目: 終了日が開始日より前になっています。"]

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

    if (mappedField === "amountBeforeTax" || mappedField === "amountAfterTax" || mappedField === "unitPrice") {
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
          <div className="grid grid-cols-5 gap-4">
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
