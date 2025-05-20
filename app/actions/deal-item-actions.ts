"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ProductType } from "@prisma/client"
import { Decimal } from "decimal.js"
import { ValidationError } from "@/lib/error-handler"
import { generateMonthlySales } from "@/lib/sales-calculator"

/**
 * 契約アイテムを作成するServer Action
 */
export async function createDealItem(formData: FormData) {
  try {
    // フォームデータの取得
    const dealId = formData.get("dealId") as string
    const productId = formData.get("productId") as string
    const productName = formData.get("productName") as string
    const type = formData.get("type") as ProductType
    const amountBeforeTaxStr = formData.get("amountBeforeTax") as string
    const amountAfterTaxStr = formData.get("amountAfterTax") as string
    const startDateStr = formData.get("startDate") as string
    const endDateStr = formData.get("endDate") as string

    // バリデーション
    if (!dealId) {
      throw new ValidationError("商談は必須です", { dealId: "商談は必須です" })
    }

    if (!productId) {
      throw new ValidationError("商品は必須です", { productId: "商品は必須です" })
    }

    if (!productName) {
      throw new ValidationError("商品名は必須です", { productName: "商品名は必須です" })
    }

    if (!type || !Object.values(ProductType).includes(type)) {
      throw new ValidationError("種別は LICENSE または SERVICE である必要があります", {
        type: "種別は LICENSE または SERVICE である必要があります",
      })
    }

    if (!amountBeforeTaxStr || isNaN(Number(amountBeforeTaxStr))) {
      throw new ValidationError("税前金額は数値である必要があります", {
        amountBeforeTax: "税前金額は数値である必要があります",
      })
    }

    if (!amountAfterTaxStr || isNaN(Number(amountAfterTaxStr))) {
      throw new ValidationError("税後金額は数値である必要があります", {
        amountAfterTax: "税後金額は数値である必要があります",
      })
    }

    if (!startDateStr) {
      throw new ValidationError("開始日は必須です", { startDate: "開始日は必須です" })
    }

    if (!endDateStr) {
      throw new ValidationError("終了日は必須です", { endDate: "終了日は必須です" })
    }

    const amountBeforeTax = new Decimal(amountBeforeTaxStr)
    const amountAfterTax = new Decimal(amountAfterTaxStr)
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    // 開始日と終了日のチェック
    if (startDate > endDate) {
      throw new ValidationError("開始日は終了日より前である必要があります", {
        startDate: "開始日は終了日より前である必要があります",
      })
    }

    // トランザクションを使用して契約アイテムと月次按分売上を一緒に作成
    const dealItem = await prisma.$transaction(async (tx) => {
      // 契約アイテムを作成
      const newDealItem = await tx.dealItem.create({
        data: {
          dealId,
          productId,
          productName,
          type,
          amountBeforeTax,
          amountAfterTax,
          startDate,
          endDate,
        },
      })

      // 月次按分売上を生成
      const monthlySalesData = generateMonthlySales(newDealItem.id, startDate, endDate, amountAfterTax, type)

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

    // キャッシュの再検証
    revalidatePath("/deal-items")
    revalidatePath(`/deals/${dealId}`)

    return { success: true, dealItem }
  } catch (error) {
    console.error("Failed to create deal item:", error)

    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields }
    }

    return { success: false, error: "契約アイテムの作成に失敗しました" }
  }
}

/**
 * 契約アイテムを更新するServer Action
 */
export async function updateDealItem(id: string, formData: FormData) {
  try {
    // フォームデータの取得
    const productName = formData.get("productName") as string
    const type = formData.get("type") as ProductType
    const amountBeforeTaxStr = formData.get("amountBeforeTax") as string
    const amountAfterTaxStr = formData.get("amountAfterTax") as string
    const startDateStr = formData.get("startDate") as string
    const endDateStr = formData.get("endDate") as string

    // バリデーション
    if (!productName) {
      throw new ValidationError("商品名は必須です", { productName: "商品名は必須です" })
    }

    if (!type || !Object.values(ProductType).includes(type)) {
      throw new ValidationError("種別は LICENSE または SERVICE である必要があります", {
        type: "種別は LICENSE または SERVICE である必要があります",
      })
    }

    if (!amountBeforeTaxStr || isNaN(Number(amountBeforeTaxStr))) {
      throw new ValidationError("税前金額は数値である必要があります", {
        amountBeforeTax: "税前金額は数値である必要があります",
      })
    }

    if (!amountAfterTaxStr || isNaN(Number(amountAfterTaxStr))) {
      throw new ValidationError("税後金額は数値である必要があります", {
        amountAfterTax: "税後金額は数値である必要があります",
      })
    }

    if (!startDateStr) {
      throw new ValidationError("開始日は必須です", { startDate: "開始日は必須です" })
    }

    if (!endDateStr) {
      throw new ValidationError("終了日は必須です", { endDate: "終了日は必須です" })
    }

    const amountBeforeTax = new Decimal(amountBeforeTaxStr)
    const amountAfterTax = new Decimal(amountAfterTaxStr)
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    // 開始日と終了日のチェック
    if (startDate > endDate) {
      throw new ValidationError("開始日は終了日より前である必要があります", {
        startDate: "開始日は終了日より前である必要があります",
      })
    }

    // 契約アイテムの取得
    const existingDealItem = await prisma.dealItem.findUnique({
      where: { id },
      select: { dealId: true },
    })

    if (!existingDealItem) {
      throw new ValidationError("契約アイテムが見つかりません", { id: "契約アイテムが見つかりません" })
    }

    // トランザクションを使用して契約アイテムと月次按分売上を一緒に更新
    const dealItem = await prisma.$transaction(async (tx) => {
      // 契約アイテムを更新
      const updatedDealItem = await tx.dealItem.update({
        where: { id },
        data: {
          productName,
          type,
          amountBeforeTax,
          amountAfterTax,
          startDate,
          endDate,
        },
      })

      // 既存の月次按分売上を削除
      await tx.monthlySales.deleteMany({
        where: { dealItemId: id },
      })

      // 月次按分売上を再生成
      const monthlySalesData = generateMonthlySales(updatedDealItem.id, startDate, endDate, amountAfterTax, type)

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

    // キャッシュの再検証
    revalidatePath("/deal-items")
    revalidatePath(`/deal-items/${id}`)
    revalidatePath(`/deals/${existingDealItem.dealId}`)

    return { success: true, dealItem }
  } catch (error) {
    console.error("Failed to update deal item:", error)

    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields }
    }

    return { success: false, error: "契約アイテムの更新に失敗しました" }
  }
}

/**
 * 契約アイテムを削除するServer Action
 */
export async function deleteDealItem(id: string) {
  try {
    // 契約アイテムの取得
    const dealItem = await prisma.dealItem.findUnique({
      where: { id },
      select: { dealId: true },
    })

    if (!dealItem) {
      throw new ValidationError("契約アイテムが見つかりません", { id: "契約アイテムが見つかりません" })
    }

    // トランザクションを使用して契約アイテムと月次按分売上を一緒に削除
    await prisma.$transaction(async (tx) => {
      // 関連する月次按分売上を削除
      await tx.monthlySales.deleteMany({
        where: { dealItemId: id },
      })

      // 契約アイテムを削除
      await tx.dealItem.delete({
        where: { id },
      })
    })

    // キャッシュの再検証
    revalidatePath("/deal-items")
    revalidatePath(`/deals/${dealItem.dealId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to delete deal item:", error)

    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields }
    }

    return { success: false, error: "契約アイテムの削除に失敗しました" }
  }
}
