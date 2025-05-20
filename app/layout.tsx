import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

const navLinks = [
  { href: "/dashboard", label: "ダッシュボード", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/sales", label: "売上分析", icon: <TrendingUp className="h-5 w-5" /> },
  { href: "/deals", label: "商談管理", icon: <Handshake className="h-5 w-5" /> },
  { href: "/deal-items", label: "契約アイテム", icon: <FileText className="h-5 w-5" /> },
  { href: "/costs", label: "費用分析", icon: <DollarSign className="h-5 w-5" /> },
  { href: "/budget-analysis", label: "予算管理", icon: <PieChart className="h-5 w-5" /> },
  { href: "/import", label: "データインポート", icon: <Upload className="h-5 w-5" /> },
  { href: "/settings", label: "設定", icon: <Settings className="h-5 w-5" /> },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
