import type { Metadata } from "next"
import DealsClientPage from "./DealsClientPage"

export const metadata: Metadata = {
  title: "商談一覧",
  description: "商談の管理と詳細表示",
}

export default function DealsPage() {
  return <DealsClientPage />
}
