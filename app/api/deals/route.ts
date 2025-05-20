import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { DealType } from "@prisma/client"

/**
 * 商談一覧を取得するAPI
 */
export async function GET() {
  try {
    // Prisma Client が利用可能かチェック
    if (!prisma || typeof prisma.deal?.findMany !== "function") {
      console.error("Prisma Client is not properly initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

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
    console.error("Error in deals API:", error)
    return handleApiError(error)
  }
}

/**
 * 商談を作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    // Prisma Client が利用可能かチェック
    if (!prisma || typeof prisma.deal?.create !== "function") {
      console.error("Prisma Client is not properly initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    const data = await request.json()

    // バリデーション
    validateData(data, {
      id: validators.required("商談ID"),
      name: validators.required("商談名"),
      customerName: validators.required("顧客名"),
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

    // 顧客の存在確認または作成
    let customer = await prisma.customer.findFirst({
      where: {
        name: data.customerName,
      },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
        },
      })
    }

    // 商談の作成（IDを指定）
    const deal = await prisma.deal.create({
      data: {
        id: data.id,
        name: data.name,
        customerId: customer.id,
        dealDate: new Date(data.dealDate),
        fiscalYear: data.fiscalYear,
        fiscalQuarter: data.fiscalQuarter,
        type: data.type,
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Error in deals API:", error)
    return handleApiError(error)
  }
}
