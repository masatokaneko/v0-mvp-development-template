import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { LayoutDashboard, FileText, Package, BarChart3, DollarSign, Settings, Upload } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | 経営ダッシュボード",
    default: "経営ダッシュボード",
  },
  description: "売上、費用、利益の可視化による経営状況の把握",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex h-screen">
          {/* サイドバー */}
          <div className="hidden md:flex w-64 flex-col bg-gray-800 text-white">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold">経営ダッシュボード</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>ダッシュボード</span>
              </Link>
              <Link href="/deals" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <FileText className="mr-2 h-5 w-5" />
                <span>商談管理</span>
              </Link>
              <Link href="/deal-items" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <Package className="mr-2 h-5 w-5" />
                <span>契約アイテム</span>
              </Link>
              <Link href="/sales" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span>売上分析</span>
              </Link>
              <Link href="/costs" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <DollarSign className="mr-2 h-5 w-5" />
                <span>費用分析</span>
              </Link>
              <Link href="/budget-analysis" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span>予実分析</span>
              </Link>
              <Link href="/import" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <Upload className="mr-2 h-5 w-5" />
                <span>データ取込</span>
              </Link>
              <Link href="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <Settings className="mr-2 h-5 w-5" />
                <span>設定</span>
              </Link>
            </nav>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* ヘッダー */}
            <header className="bg-white border-b h-16 flex items-center justify-between px-6">
              <div className="md:hidden">
                <button className="text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">ユーザー名</span>
              </div>
            </header>

            {/* コンテンツエリア */}
            <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
