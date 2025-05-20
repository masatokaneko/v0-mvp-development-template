import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { ProductType } from "@prisma/client"
import { Decimal } from "decimal.js"
import { generateMonthlySales } from "@/lib/sales-calculator"

/**
 * 契約アイテム一覧を取得するAPI
 */
export async function GET() {
  try {
    const dealItems = await prisma.dealItem.findMany({
      include: {
        deal: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(dealItems)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 契約アイテムを作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      dealId: validators.required("商談ID"),
      productId: validators.required("商品ID"),
      productName: validators.required("商品名"),
      type: (value) => {
        if (!Object.values(ProductType).includes(value as ProductType)) {
          return "種別は LICENSE または SERVICE である必要があります"
        }
        return true
      },
      amountBeforeTax: validators.isNumber("税前金額"),
      amountAfterTax: validators.isNumber("税後金額"),
      startDate: validators.isDate("開始日"),
      endDate: validators.isDate("終了日"),
    })

    // 開始日と終了日のチェック
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "Validation Error", message: "開始日は終了日より前である必要があります" },
        { status: 400 },
      )
    }

    // トランザクションを使用して契約アイテムと月次按分売上を一緒に作成
    const dealItem = await prisma.$transaction(async (tx) => {
      // 契約アイテムを作成
      const newDealItem = await tx.dealItem.create({
        data: {
          dealId: data.dealId,
          productId: data.productId,
          productName: data.productName,
          type: data.type,
          amountBeforeTax: new Decimal(data.amountBeforeTax),
          amountAfterTax: new Decimal(data.amountAfterTax),
          startDate,
          endDate,
        },
      })

      // 月次按分売上を生成
      const monthlySalesData = generateMonthlySales(
        newDealItem.id,
        startDate,
        endDate,
        new Decimal(data.amountAfterTax),
        data.type,
      )

      // 月次按分売上を一括作成
      await Promise.all(
        monthlySalesData.map((salesData) =>
          tx.monthlySales.create({
            data: salesData,
          }),
        ),
      )

      return newDealItem
    })

    return NextResponse.json(dealItem, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
