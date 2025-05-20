import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { DealType } from "@prisma/client"

/**
 * 商談一覧を取得するAPI
 */
export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        dealDate: "desc",
      },
    })

    return NextResponse.json(deals)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 商談を作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      name: validators.required("商談名"),
      customerId: validators.required("顧客ID"),
      dealDate: validators.isDate("商談日"),
      fiscalYear: validators.isNumber("会計年度"),
      fiscalQuarter: validators.isNumber("四半期"),
      type: (value) => {
        if (!Object.values(DealType).includes(value as DealType)) {
          return "種別は LICENSE, SERVICE, MIXED のいずれかである必要があります"
        }
        return true
      },
    })

    const deal = await prisma.deal.create({
      data: {
        name: data.name,
        customerId: data.customerId,
        dealDate: new Date(data.dealDate),
        fiscalYear: data.fiscalYear,
        fiscalQuarter: data.fiscalQuarter,
        type: data.type,
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
