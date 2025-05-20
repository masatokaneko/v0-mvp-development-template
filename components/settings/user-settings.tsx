"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserSettings() {
  const [name, setName] = useState("山田 太郎")
  const [email, setEmail] = useState("yamada@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出してプロファイルを保存します
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("プロファイルが更新されました")
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("新しいパスワードと確認用パスワードが一致しません")
      return
    }

    setIsChangingPassword(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出してパスワードを変更します
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("パスワードが変更されました")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsChangingPassword(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>プロファイル設定</CardTitle>
          <CardDescription>ユーザープロファイル情報を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/abstract-profile.png" alt="プロフィール画像" />
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
            <Button variant="outline">画像を変更</Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? "保存中..." : "プロファイルを保存"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
          <CardDescription>アカウントのパスワードを変更します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">現在のパスワード</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">新しいパスワード</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {isChangingPassword ? "変更中..." : "パスワードを変更"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
