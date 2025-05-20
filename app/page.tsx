import { redirect } from "next/navigation"

export default function Home() {
  // ルートパスにアクセスした場合はダッシュボードにリダイレクト
  redirect("/dashboard")
}
