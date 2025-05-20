"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./general-settings"
import { UserSettings } from "./user-settings"
import { NotificationSettings } from "./notification-settings"
import { DataManagementSettings } from "./data-management-settings"
import { TaxSettings } from "./tax-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="general">一般</TabsTrigger>
        <TabsTrigger value="user">ユーザー</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
        <TabsTrigger value="data">データ管理</TabsTrigger>
        <TabsTrigger value="tax">税率設定</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="user">
        <UserSettings />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="data">
        <DataManagementSettings />
      </TabsContent>

      <TabsContent value="tax">
        <TaxSettings />
      </TabsContent>
    </Tabs>
  )
}
