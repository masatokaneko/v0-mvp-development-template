import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { BudgetType } from "@prisma/client"
import { Decimal } from "decimal.js"

/**
 * 予算一覧を取得するAPI
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // クエリパラメータの取得
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : null
    const quarter = searchParams.get("quarter") ? Number.parseInt(searchParams.get("quarter")!) : null
    const type = searchParams.get("type") || undefined
    const category = searchParams.get("category") || undefined
    const salesType = searchParams.get("salesType") || undefined

    // フィルター条件の構築
    const where: any = {}

    if (year !== undefined) {
      where.year = year
    }

    if (month !== null) {
      where.month = month === 0 ? null : month
    }

    if (quarter !== null) {
      where.quarter = quarter === 0 ? null : quarter
    }

    if (type) {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (salesType) {
      where.salesType = salesType
    }

    // 予算の取得
    const budgets = await prisma.budget.findMany({
      where,
      orderBy: [{ year: "asc" }, { quarter: "asc" }, { month: "asc" }, { type: "asc" }],
    })

    return NextResponse.json(budgets)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 予算を作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      year: validators.isNumber("年"),
      type: (value) => {
        if (!Object.values(BudgetType).includes(value as BudgetType)) {
          return "種別は SALES, COST_OF_SALES, SG_AND_A, OPERATING_PROFIT のいずれかである必要があります"
        }
        return true
      },
      amount: validators.isNumber("金額"),
    })

    // 月次、四半期、年間のいずれかを指定
    if (data.month === null && data.quarter === null && data.month !== null && data.quarter !== null) {
      return NextResponse.json(
        { error: "Validation Error", message: "月または四半期のいずれかを指定してください" },
        { status: 400 },
      )
    }

    // 予算の作成
    const budget = await prisma.budget.create({
      data: {
        year: data.year,
        month: data.month || null,
        quarter: data.quarter || null,
        type: data.type,
        category: data.category || null,
        salesType: data.salesType || null,
        amount: new Decimal(data.amount),
      },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
