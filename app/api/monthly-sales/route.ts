import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/error-handler"

/**
 * 月次按分売上一覧を取得するAPI
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // クエリパラメータの取得
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : undefined
    const type = searchParams.get("type") || undefined
    const dealItemId = searchParams.get("dealItemId") || undefined

    // フィルター条件の構築
    const where: any = {}

    if (year !== undefined) {
      where.year = year
    }

    if (month !== undefined) {
      where.month = month
    }

    if (type) {
      where.type = type
    }

    if (dealItemId) {
      where.dealItemId = dealItemId
    }

    // 月次按分売上の取得
    const monthlySales = await prisma.monthlySales.findMany({
      where,
      include: {
        dealItem: {
          include: {
            deal: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    })

    return NextResponse.json(monthlySales)
  } catch (error) {
    return handleApiError(error)
  }
}
