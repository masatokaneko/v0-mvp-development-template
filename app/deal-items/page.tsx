import type { Metadata } from "next"
import DealItemsClientPage from "./DealItemsClientPage"

export const metadata: Metadata = {
  title: "新規獲得契約アイテム一覧",
  description: "新規獲得契約アイテムの管理と詳細表示",
}

export default function DealItemsPage() {
  return <DealItemsClientPage />
}
