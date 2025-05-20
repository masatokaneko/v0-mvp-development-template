"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    dealCreated: true,
    dealUpdated: true,
    dealItemCreated: false,
    dealItemUpdated: false,
    budgetAlert: true,
    weeklyReport: true,
    monthlyReport: true,
  })

  const [appNotifications, setAppNotifications] = useState({
    dealCreated: true,
    dealUpdated: true,
    dealItemCreated: true,
    dealItemUpdated: true,
    budgetAlert: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出して設定を保存します
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("通知設定が保存されました")
    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
        <CardDescription>通知の受信方法を管理します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">メール通知</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-deal-created" className="flex-1">
              商談作成時
            </Label>
            <Switch
              id="email-deal-created"
              checked={emailNotifications.dealCreated}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, dealCreated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-deal-updated" className="flex-1">
              商談更新時
            </Label>
            <Switch
              id="email-deal-updated"
              checked={emailNotifications.dealUpdated}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, dealUpdated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-deal-item-created" className="flex-1">
              契約アイテム作成時
            </Label>
            <Switch
              id="email-deal-item-created"
              checked={emailNotifications.dealItemCreated}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, dealItemCreated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-deal-item-updated" className="flex-1">
              契約アイテム更新時
            </Label>
            <Switch
              id="email-deal-item-updated"
              checked={emailNotifications.dealItemUpdated}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, dealItemUpdated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-budget-alert" className="flex-1">
              予算アラート
            </Label>
            <Switch
              id="email-budget-alert"
              checked={emailNotifications.budgetAlert}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, budgetAlert: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-weekly-report" className="flex-1">
              週次レポート
            </Label>
            <Switch
              id="email-weekly-report"
              checked={emailNotifications.weeklyReport}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, weeklyReport: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-monthly-report" className="flex-1">
              月次レポート
            </Label>
            <Switch
              id="email-monthly-report"
              checked={emailNotifications.monthlyReport}
              onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, monthlyReport: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">アプリ内通知</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-deal-created" className="flex-1">
              商談作成時
            </Label>
            <Switch
              id="app-deal-created"
              checked={appNotifications.dealCreated}
              onCheckedChange={(checked) => setAppNotifications({ ...appNotifications, dealCreated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-deal-updated" className="flex-1">
              商談更新時
            </Label>
            <Switch
              id="app-deal-updated"
              checked={appNotifications.dealUpdated}
              onCheckedChange={(checked) => setAppNotifications({ ...appNotifications, dealUpdated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-deal-item-created" className="flex-1">
              契約アイテム作成時
            </Label>
            <Switch
              id="app-deal-item-created"
              checked={appNotifications.dealItemCreated}
              onCheckedChange={(checked) => setAppNotifications({ ...appNotifications, dealItemCreated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-deal-item-updated" className="flex-1">
              契約アイテム更新時
            </Label>
            <Switch
              id="app-deal-item-updated"
              checked={appNotifications.dealItemUpdated}
              onCheckedChange={(checked) => setAppNotifications({ ...appNotifications, dealItemUpdated: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-budget-alert" className="flex-1">
              予算アラート
            </Label>
            <Switch
              id="app-budget-alert"
              checked={appNotifications.budgetAlert}
              onCheckedChange={(checked) => setAppNotifications({ ...appNotifications, budgetAlert: checked })}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "保存中..." : "設定を保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}
