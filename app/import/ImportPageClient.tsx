"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/import/file-upload"
import { DealImportForm } from "@/components/import/deal-import-form"
import { DealItemImportForm } from "@/components/import/deal-item-import-form"
import { useEffect, useState } from "react"

export default function ImportPageClient() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("deals")

  // URLパラメータからタブを設定
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "deals" || type === "dealItems") {
      setActiveTab(type)
    }
  }, [searchParams])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">データインポート</h2>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">
          Excelファイルから商談データや契約アイテムデータをインポートします。テンプレートに従ってデータを準備してください。
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="deals">商談インポート</TabsTrigger>
            <TabsTrigger value="dealItems">契約アイテムインポート</TabsTrigger>
          </TabsList>
          <TabsContent value="deals" className="space-y-4 pt-4">
            <FileUpload
              title="商談データのインポート"
              description="商談データのExcelファイルをアップロードしてください。"
              acceptedFileTypes=".xlsx,.xls,.csv"
              maxFileSize={5}
            />
            <DealImportForm />
          </TabsContent>
          <TabsContent value="dealItems" className="space-y-4 pt-4">
            <FileUpload
              title="契約アイテムデータのインポート"
              description="契約アイテムデータのExcelファイルをアップロードしてください。"
              acceptedFileTypes=".xlsx,.xls,.csv"
              maxFileSize={5}
            />
            <DealItemImportForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
