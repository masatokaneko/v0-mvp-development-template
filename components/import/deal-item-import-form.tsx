"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

// 空のモックデータ（サンプル表示用）
const mockImportData: any[] = []

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
  const [fileSelected, setFileSelected] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  const handleColumnMappingChange = (column: string, value: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [column]: value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 実際のファイルアップロード処理はここに実装
    // この例ではファイルが選択されたことだけを記録
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true)
      // 実際のアプリケーションではここでファイルを解析してプレビューデータを設定
      setPreviewData([])
    }
  }

  const handleValidate = () => {
    setImportStatus("validating")

    // バリデーションのシミュレーション
    setTimeout(() => {
      if (!fileSelected) {
        setValidationErrors(["ファイルが選択されていません。"])
        setImportStatus("error")
        return
      }

      setValidationErrors([])
      setImportStatus("idle")
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

  // 表示するデータ（アップロードされたデータまたは空の配列）
  const displayData = previewData.length > 0 ? previewData : mockImportData

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
              契約アイテムデータが正常にインポートされました。
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload-deal-item"
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>ファイルを選択</span>
              <input
                id="file-upload-deal-item"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <span className="text-sm text-gray-500">
              {fileSelected ? "ファイルが選択されました" : "ファイルが選択されていません"}
            </span>
          </div>

          {displayData.length === 0 && !fileSelected && (
            <div className="py-8 text-center text-gray-500 border rounded-md bg-gray-50">
              <p>ファイルをアップロードするとデータがここにプレビュー表示されます。</p>
              <p className="text-sm mt-2">サポートされているファイル形式: Excel (.xlsx, .xls), CSV (.csv)</p>
            </div>
          )}

          {(displayData.length > 0 || fileSelected) && (
            <>
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

              {displayData.length > 0 && (
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
                      {displayData.map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(columnMapping).map((column) => (
                            <TableCell key={`${index}-${column}`}>{formatCellValue(column, row[column])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
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
            importStatus === "error" ||
            !fileSelected
          }
        >
          インポート実行
        </Button>
      </CardFooter>
    </Card>
  )
}
