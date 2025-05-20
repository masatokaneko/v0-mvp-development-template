"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { FileUpload } from "@/components/import/file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Upload } from "lucide-react"

export function DataManagementSettings() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出してデータをエクスポートします
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("データのエクスポートが完了しました")
    setIsExporting(false)

    // 実際のアプリケーションでは、ここでダウンロードリンクを生成します
    const dummyData = {
      deals: [],
      dealItems: [],
      customers: [],
      products: [],
      costs: [],
      budgets: [],
    }

    const dataStr = JSON.stringify(dummyData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `business-dashboard-export-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleBackupData = async () => {
    setIsBackingUp(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出してデータをバックアップします
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("データのバックアップが完了しました")
    setIsBackingUp(false)
  }

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/json") {
      toast.error("JSONファイルのみアップロードできます")
      return
    }

    setIsImporting(true)

    // 実際のアプリケーションでは、ここでファイルを読み込んでAPIを呼び出します
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("データのインポートが完了しました")
    setIsImporting(false)
  }

  const handleBackupFileUpload = async (file: File) => {
    if (file.type !== "application/json") {
      toast.error("JSONファイルのみアップロードできます")
      return
    }

    setIsRestoring(true)

    // 実際のアプリケーションでは、ここでファイルを読み込んでAPIを呼び出します
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("バックアップからの復元が完了しました")
    setIsRestoring(false)
  }

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>注意</AlertTitle>
        <AlertDescription>
          データのインポートやバックアップからの復元を行うと、既存のデータが上書きされる可能性があります。
          操作前に必ずデータのバックアップを取ることをお勧めします。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>データのエクスポート</CardTitle>
          <CardDescription>現在のデータをJSONファイルとしてエクスポートします</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            エクスポートされたデータには、商談、契約アイテム、顧客、商品、費用、予算の情報が含まれます。
            このファイルは後でインポートして、データを復元することができます。
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExportData} disabled={isExporting} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? "エクスポート中..." : "データをエクスポート"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データのインポート</CardTitle>
          <CardDescription>以前にエクスポートしたJSONファイルからデータをインポートします</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            インポートを行うと、既存のデータが上書きされる可能性があります。
            操作前に必ずデータのバックアップを取ることをお勧めします。
          </p>

          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedFileTypes=".json"
            maxFileSizeMB={10}
            isUploading={isImporting}
            buttonText={isImporting ? "インポート中..." : "JSONファイルをアップロード"}
            icon={<Upload className="h-4 w-4 mr-2" />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データのバックアップと復元</CardTitle>
          <CardDescription>データのバックアップを作成し、必要に応じて復元します</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            バックアップは定期的に行うことをお勧めします。
            バックアップからの復元を行うと、既存のデータが上書きされます。
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleBackupData}
              disabled={isBackingUp}
              className="w-full flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isBackingUp ? "バックアップ中..." : "データをバックアップ"}
            </Button>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">バックアップから復元</h4>
              <FileUpload
                onFileUpload={handleBackupFileUpload}
                acceptedFileTypes=".json"
                maxFileSizeMB={10}
                isUploading={isRestoring}
                buttonText={isRestoring ? "復元中..." : "バックアップファイルをアップロード"}
                icon={<Upload className="h-4 w-4 mr-2" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
