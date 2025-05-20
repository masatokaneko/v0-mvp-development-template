import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"
import { ProductType } from "@prisma/client"
import { Decimal } from "decimal.js"
import { generateMonthlySales } from "@/lib/sales-calculator"

/**
 * 契約アイテム詳細を取得するAPI
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dealItem = await prisma.dealItem.findUnique({
      where: {
        id: params.id,
      },
      include: {
        deal: {
          include: {
            customer: true,
          },
        },
        product: true,
        monthlySales: {
          orderBy: [{ year: "asc" }, { month: "asc" }],
        },
      },
    })

    if (!dealItem) {
      return NextResponse.json({ error: "Deal item not found" }, { status: 404 })
    }

    return NextResponse.json(dealItem)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 契約アイテムを更新するAPI
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
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

    // トランザクションを使用して契約アイテムと月次按分売上を一緒に更新
    const dealItem = await prisma.$transaction(async (tx) => {
      // 契約アイテムを更新
      const updatedDealItem = await tx.dealItem.update({
        where: {
          id: params.id,
        },
        data: {
          productName: data.productName,
          type: data.type,
          amountBeforeTax: new Decimal(data.amountBeforeTax),
          amountAfterTax: new Decimal(data.amountAfterTax),
          startDate,
          endDate,
        },
      })

      // 既存の月次按分売上を削除
      await tx.monthlySales.deleteMany({
        where: {
          dealItemId: params.id,
        },
      })

      // 月次按分売上を再生成
      const monthlySalesData = generateMonthlySales(
        updatedDealItem.id,
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

      return updatedDealItem
    })

    return NextResponse.json(dealItem)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 契約アイテムを削除するAPI
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.$transaction(async (tx) => {
      // 関連する月次按分売上を削除
      await tx.monthlySales.deleteMany({
        where: {
          dealItemId: params.id,
        },
      })

      // 契約アイテムを削除
      await tx.dealItem.delete({
        where: {
          id: params.id,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
