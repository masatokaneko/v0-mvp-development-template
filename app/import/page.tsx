import type { Metadata } from "next"
import ImportPageClient from "./ImportPageClient"

export const metadata: Metadata = {
  title: "データインポート",
  description: "商談と契約アイテムのデータ取込",
}

export default function ImportPage() {
  return <ImportPageClient />
}
