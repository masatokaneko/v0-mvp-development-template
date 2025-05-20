import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-700 mb-6">ページが見つかりません</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        ホームに戻る
      </Link>
    </div>
  )
}
