import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { CostType } from "@prisma/client"
import { Decimal } from "decimal.js"

/**
 * 費用一覧を取得するAPI
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // クエリパラメータの取得
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : undefined
    const type = searchParams.get("type") || undefined
    const category = searchParams.get("category") || undefined

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

    if (category) {
      where.category = category
    }

    // 費用の取得
    const costs = await prisma.cost.findMany({
      where,
      orderBy: [{ year: "asc" }, { month: "asc" }, { type: "asc" }, { category: "asc" }],
    })

    return NextResponse.json(costs)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 費用を作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      year: validators.isNumber("年"),
      month: validators.isNumber("月"),
      type: (value) => {
        if (!Object.values(CostType).includes(value as CostType)) {
          return "種別は COST_OF_SALES_LICENSE, COST_OF_SALES_SERVICE, SG_AND_A のいずれかである必要があります"
        }
        return true
      },
      category: validators.required("カテゴリ"),
      amount: validators.isNumber("金額"),
    })

    // 費用の作成
    const cost = await prisma.cost.create({
      data: {
        year: data.year,
        month: data.month,
        type: data.type,
        category: data.category,
        amount: new Decimal(data.amount),
        description: data.description,
      },
    })

    return NextResponse.json(cost, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
