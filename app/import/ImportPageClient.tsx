"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/import/file-upload"
import { DealImportForm } from "@/components/import/deal-import-form"
import { DealItemImportForm } from "@/components/import/deal-item-import-form"
import { BudgetImportForm } from "@/components/import/budget-import-form"
import { CostImportForm } from "@/components/import/cost-import-form"
import { TemplateDownloadButton } from "@/components/import/template-download-button"
import { useEffect, useState } from "react"

export default function ImportPageClient() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("deals")

  // URLパラメータからタブを設定
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "deals" || type === "dealItems" || type === "budgets" || type === "costs") {
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
          Excelファイルから各種データをインポートします。テンプレートに従ってデータを準備してください。
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <TemplateDownloadButton templateType="deals" />
          <TemplateDownloadButton templateType="dealItems" />
          <TemplateDownloadButton templateType="budgets" />
          <TemplateDownloadButton templateType="costs" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="deals">商談</TabsTrigger>
            <TabsTrigger value="dealItems">契約アイテム</TabsTrigger>
            <TabsTrigger value="budgets">予算</TabsTrigger>
            <TabsTrigger value="costs">費用実績</TabsTrigger>
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
          <TabsContent value="budgets" className="space-y-4 pt-4">
            <FileUpload
              title="予算データのインポート"
              description="予算データのExcelファイルをアップロードしてください。"
              acceptedFileTypes=".xlsx,.xls,.csv"
              maxFileSize={5}
            />
            <BudgetImportForm />
          </TabsContent>
          <TabsContent value="costs" className="space-y-4 pt-4">
            <FileUpload
              title="費用実績データのインポート"
              description="費用実績データのExcelファイルをアップロードしてください。"
              acceptedFileTypes=".xlsx,.xls,.csv"
              maxFileSize={5}
            />
            <CostImportForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
