import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { DealType } from "@prisma/client"

/**
 * 商談詳細を取得するAPI
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: {
        id: params.id,
      },
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
            monthlySales: {
              orderBy: [{ year: "asc" }, { month: "asc" }],
            },
          },
        },
      },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 商談を更新するAPI
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const deal = await prisma.deal.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        customerId: data.customerId,
        dealDate: new Date(data.dealDate),
        fiscalYear: data.fiscalYear,
        fiscalQuarter: data.fiscalQuarter,
        type: data.type,
      },
    })

    return NextResponse.json(deal)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 商談を削除するAPI
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.deal.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
