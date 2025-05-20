import type { Metadata } from "next"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export const metadata: Metadata = {
  title: "設定 | ビジネスダッシュボード",
  description: "アプリケーション設定を管理します",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-muted-foreground">アプリケーションの設定を管理します</p>
      </div>

      <SettingsTabs />
    </div>
  )
}
