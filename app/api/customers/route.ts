import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateData, validators } from "@/lib/error-handler"

/**
 * 顧客一覧を取得するAPI
 */
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(customers)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 顧客を作成するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // バリデーション
    validateData(data, {
      name: validators.required("顧客名"),
    })

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
