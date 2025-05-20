"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function GeneralSettings() {
  const [appName, setAppName] = useState("ビジネスダッシュボード")
  const [language, setLanguage] = useState("ja")
  const [timezone, setTimezone] = useState("Asia/Tokyo")
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出して設定を保存します
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("一般設定が保存されました")
    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>一般設定</CardTitle>
        <CardDescription>アプリケーションの基本設定を管理します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="app-name">アプリケーション名</Label>
          <Input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">言語</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="言語を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">タイムゾーン</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger id="timezone">
              <SelectValue placeholder="タイムゾーンを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
              <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
              <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
              <SelectItem value="Australia/Sydney">Australia/Sydney (GMT+11)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-format">日付形式</Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger id="date-format">
              <SelectValue placeholder="日付形式を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
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
