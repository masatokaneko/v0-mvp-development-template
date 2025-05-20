"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface TemplateDownloadButtonProps {
  templateType: "deals" | "dealItems" | "budgets" | "costs"
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function TemplateDownloadButton({
  templateType,
  variant = "outline",
  size = "default",
}: TemplateDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // APIエンドポイントからテンプレートファイルをダウンロード
      const response = await fetch(`/api/templates/${templateType}`)

      if (!response.ok) {
        throw new Error(`テンプレートのダウンロードに失敗しました: ${response.statusText}`)
      }

      // レスポンスからBlobを取得
      const blob = await response.blob()

      // ダウンロードリンクを作成
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${getTemplateFileName(templateType)}`
      document.body.appendChild(a)
      a.click()

      // クリーンアップ
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`${getTemplateLabel(templateType)}のダウンロードが完了しました`)
    } catch (error) {
      console.error("Template download error:", error)
      toast.error(
        `テンプレートのダウンロードに失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
      )
    }
  }

  const getTemplateFileName = (type: string) => {
    const templateNames = {
      deals: "商談データインポートテンプレート.xlsx",
      dealItems: "契約アイテムデータインポートテンプレート.xlsx",
      budgets: "予算データインポートテンプレート.xlsx",
      costs: "費用実績データインポートテンプレート.xlsx",
    }
    return templateNames[type as keyof typeof templateNames]
  }

  const getTemplateLabel = (type: string) => {
    const buttonLabels = {
      deals: "商談テンプレート",
      dealItems: "契約アイテムテンプレート",
      budgets: "予算テンプレート",
      costs: "費用実績テンプレート",
    }
    return buttonLabels[type as keyof typeof buttonLabels]
  }

  return (
    <Button variant={variant} size={size} onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      {getTemplateLabel(templateType)}
    </Button>
  )
}
