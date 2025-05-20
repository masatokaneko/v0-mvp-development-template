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
import { CostType } from "@prisma/client"

// モックデータ
const mockImportData = []

// 列マッピングオプション
const columnOptions = [
  { value: "year", label: "年" },
  { value: "month", label: "月" },
  { value: "type", label: "費用種別" },
  { value: "category", label: "カテゴリ" },
  { value: "amount", label: "金額" },
  { value: "description", label: "説明" },
  { value: "payee", label: "支払先" },
  { value: "project", label: "プロジェクト" },
  { value: "assignedTo", label: "担当者" },
  { value: "notes", label: "備考" },
  { value: "ignore", label: "無視" },
]

export function CostImportForm() {
  const [columnMapping, setColumnMapping] = useState({
    col1: "year",
    col2: "month",
    col3: "type",
    col4: "category",
    col5: "amount",
    col6: "description",
    col7: "payee",
    col8: "project",
    col9: "assignedTo",
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
      const errors = [
        "3行目: 費用種別「COST_OF_SALES_SERVICE」に対して、カテゴリ「サービス原価」が正しくありません。",
        "5行目: 金額が負の値になっています。",
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
      return formatCurrency(value)
    }

    if (mappedField === "type" && value) {
      const costTypeLabels: Record<string, string> = {
        [CostType.COST_OF_SALES_LICENSE]: "ライセンス原価",
        [CostType.COST_OF_SALES_SERVICE]: "サービス原価",
        [CostType.SG_AND_A]: "販管費",
      }
      return costTypeLabels[value] || value
    }

    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>費用実績データのプレビューとマッピング</CardTitle>
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
              5件の費用実績データが正常にインポートされました。
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

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">インポート時の注意事項</h4>
          <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
            <li>
              費用種別は「COST_OF_SALES_LICENSE」「COST_OF_SALES_SERVICE」「SG_AND_A」のいずれかを指定してください。
            </li>
            <li>費用種別に応じて適切なカテゴリを設定してください。</li>
            <li>金額は正の値で入力してください。</li>
            <li>説明は必須項目です。</li>
            <li>支払先、プロジェクト、担当者、備考は任意項目です。</li>
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
