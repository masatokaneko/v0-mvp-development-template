"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { DealType } from "@prisma/client"
import { ValidationError } from "@/lib/error-handler"

/**
 * 商談を作成するServer Action
 */
export async function createDeal(formData: FormData) {
  try {
    // フォームデータの取得
    const name = formData.get("name") as string
    const customerId = formData.get("customerId") as string
    const dealDateStr = formData.get("dealDate") as string
    const type = formData.get("type") as DealType

    // バリデーション
    if (!name) {
      throw new ValidationError("商談名は必須です", { name: "商談名は必須です" })
    }

    if (!customerId) {
      throw new ValidationError("顧客は必須です", { customerId: "顧客は必須です" })
    }

    if (!dealDateStr) {
      throw new ValidationError("商談日は必須です", { dealDate: "商談日は必須です" })
    }

    if (!type || !Object.values(DealType).includes(type)) {
      throw new ValidationError("種別は LICENSE, SERVICE, MIXED のいずれかである必要があります", {
        type: "種別は LICENSE, SERVICE, MIXED のいずれかである必要があります",
      })
    }

    const dealDate = new Date(dealDateStr)

    // 会計年度と四半期を計算
    const fiscalYear = dealDate.getFullYear()
    const month = dealDate.getMonth() + 1

    let fiscalQuarter = 1
    if (month >= 3 && month <= 5) {
      fiscalQuarter = 2
    } else if (month >= 6 && month <= 8) {
      fiscalQuarter = 3
    } else if (month >= 9 && month <= 11) {
      fiscalQuarter = 4
    }

    // 商談の作成
    const deal = await prisma.deal.create({
      data: {
        name,
        customerId,
        dealDate,
        fiscalYear,
        fiscalQuarter,
        type,
      },
    })

    // キャッシュの再検証
    revalidatePath("/deals")

    return { success: true, deal }
  } catch (error) {
    console.error("Failed to create deal:", error)

    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields }
    }

    return { success: false, error: "商談の作成に失敗しました" }
  }
}

/**
 * 商談を更新するServer Action
 */
export async function updateDeal(id: string, formData: FormData) {
  try {
    // フォームデータの取得
    const name = formData.get("name") as string
    const customerId = formData.get("customerId") as string
    const dealDateStr = formData.get("dealDate") as string
    const type = formData.get("type") as DealType

    // バリデーション
    if (!name) {
      throw new ValidationError("商談名は必須です", { name: "商談名は必須です" })
    }

    if (!customerId) {
      throw new ValidationError("顧客は必須です", { customerId: "顧客は必須です" })
    }

    if (!dealDateStr) {
      throw new ValidationError("商談日は必須です", { dealDate: "商談日は必須です" })
    }

    if (!type || !Object.values(DealType).includes(type)) {
      throw new ValidationError("種別は LICENSE, SERVICE, MIXED のいずれかである必要があります", {
        type: "種別は LICENSE, SERVICE, MIXED のいずれかである必要があります",
      })
    }

    const dealDate = new Date(dealDateStr)

    // 会計年度と四半期を計算
    const fiscalYear = dealDate.getFullYear()
    const month = dealDate.getMonth() + 1

    let fiscalQuarter = 1
    if (month >= 3 && month <= 5) {
      fiscalQuarter = 2
    } else if (month >= 6 && month <= 8) {
      fiscalQuarter = 3
    } else if (month >= 9 && month <= 11) {
      fiscalQuarter = 4
    }

    // 商談の更新
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        name,
        customerId,
        dealDate,
        fiscalYear,
        fiscalQuarter,
        type,
      },
    })

    // キャッシュの再検証
    revalidatePath("/deals")
    revalidatePath(`/deals/${id}`)

    return { success: true, deal }
  } catch (error) {
    console.error("Failed to update deal:", error)

    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields }
    }

    return { success: false, error: "商談の更新に失敗しました" }
  }
}

/**
 * 商談を削除するServer Action
 */
export async function deleteDeal(id: string) {
  try {
    // 商談の削除
    await prisma.$transaction(async (tx) => {
      // 関連する月次按分売上を削除
      const dealItems = await tx.dealItem.findMany({
        where: { dealId: id },
        select: { id: true },
      })

      const dealItemIds = dealItems.map((item) => item.id)

      if (dealItemIds.length > 0) {
        await tx.monthlySales.deleteMany({
          where: {
            dealItemId: { in: dealItemIds },
          },
        })
      }

      // 関連する契約アイテムを削除
      await tx.dealItem.deleteMany({
        where: { dealId: id },
      })

      // 商談を削除
      await tx.deal.delete({
        where: { id },
      })
    })

    // キャッシュの再検証
    revalidatePath("/deals")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete deal:", error)
    return { success: false, error: "商談の削除に失敗しました" }
  }
}
