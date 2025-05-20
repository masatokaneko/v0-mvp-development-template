import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"

/**
 * 顧客詳細を取得するAPI
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
      include: {
        deals: {
          orderBy: {
            dealDate: "desc",
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 顧客を更新するAPI
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      name: validators.required("顧客名"),
    })

    const customer = await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 顧客を削除するAPI
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.customer.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
