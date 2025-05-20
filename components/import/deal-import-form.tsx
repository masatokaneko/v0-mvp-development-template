"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// モックデータ
const mockImportData = [
  {
    id: 1,
    col1: "DEAL-001",
    col2: "株式会社テクノロジー 追加契約",
    col3: "株式会社テクノロジー",
    col4: "2024-06-15",
    col5: "2024",
    col6: "2",
    col7: "LICENSE",
  },
  {
    id: 2,
    col1: "DEAL-002",
    col2: "株式会社イノベーション 保守契約",
    col3: "株式会社イノベーション",
    col4: "2024-06-20",
    col5: "2024",
    col6: "2",
    col7: "SERVICE",
  },
  {
    id: 3,
    col1: "DEAL-003",
    col2: "株式会社デジタルソリューション 更新",
    col3: "株式会社デジタルソリューション",
    col4: "2024-07-01",
    col5: "2024",
    col6: "3",
    col7: "MIXED",
  },
]

// 列マッピングオプション
const columnOptions = [
  { value: "id", label: "商談ID" },
  { value: "name", label: "商談名" },
  { value: "customerName", label: "顧客名" },
  { value: "dealDate", label: "商談日" },
  { value: "fiscalYear", label: "会計年度" },
  { value: "fiscalQuarter", label: "四半期" },
  { value: "type", label: "種別" },
  { value: "ignore", label: "無視" },
]

export function DealImportForm() {
  const [columnMapping, setColumnMapping] = useState({
    col1: "id",
    col2: "name",
    col3: "customerName",
    col4: "dealDate",
    col5: "fiscalYear",
    col6: "fiscalQuarter",
    col7: "type",
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
      const errors = ["3行目: 商談日の形式が正しくありません。YYYY-MM-DD形式で入力してください。"]

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>商談データのプレビューとマッピング</CardTitle>
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
              3件の商談データが正常にインポートされました。
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

        <div className="rounded-md border">
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
                    <TableCell key={`${row.id}-${column}`}>{row[column as keyof typeof row]}</TableCell>
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
