"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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
  const handleDownload = () => {
    // 実際の実装では、APIエンドポイントからテンプレートファイルをダウンロードします
    // ここではモックの実装として、テンプレートタイプに応じたファイル名を設定します
    const templateNames = {
      deals: "商談データインポートテンプレート.xlsx",
      dealItems: "契約アイテムデータインポートテンプレート.xlsx",
      budgets: "予算データインポートテンプレート.xlsx",
      costs: "費用実績データインポートテンプレート.xlsx",
    }

    const fileName = templateNames[templateType]

    // モックのダウンロード処理
    // 実際の実装では、fetch APIを使用してサーバーからファイルをダウンロードします
    alert(`${fileName}のダウンロードを開始します。実際の実装では、ここでファイルがダウンロードされます。`)
  }

  const buttonLabels = {
    deals: "商談テンプレート",
    dealItems: "契約アイテムテンプレート",
    budgets: "予算テンプレート",
    costs: "費用実績テンプレート",
  }

  return (
    <Button variant={variant} size={size} onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      {buttonLabels[templateType]}
    </Button>
  )
}
