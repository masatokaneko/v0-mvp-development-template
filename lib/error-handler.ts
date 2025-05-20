import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

/**
 * APIエラーハンドラー
 * @param error エラーオブジェクト
 * @returns NextResponse
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  // Prismaエラーの処理
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error)
  }

  // バリデーションエラーの処理
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: "Validation Error", message: error.message, fields: error.fields },
      { status: 400 },
    )
  }

  // 一般的なエラーの処理
  if (error instanceof Error) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 })
  }

  // 未知のエラーの処理
  return NextResponse.json({ error: "Unknown Error", message: "An unknown error occurred" }, { status: 500 })
}

/**
 * Prismaエラーの処理
 * @param error Prismaエラーオブジェクト
 * @returns NextResponse
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case "P2002": // ユニーク制約違反
      return NextResponse.json(
        {
          error: "Unique Constraint Violation",
          message: `The ${error.meta?.target || "field"} already exists.`,
        },
        { status: 409 },
      )
    case "P2003": // 外部キー制約違反
      return NextResponse.json(
        {
          error: "Foreign Key Constraint Violation",
          message: `The referenced record does not exist.`,
        },
        { status: 400 },
      )
    case "P2025": // レコードが見つからない
      return NextResponse.json(
        {
          error: "Record Not Found",
          message: error.meta?.cause || "The requested record does not exist.",
        },
        { status: 404 },
      )
    default:
      return NextResponse.json(
        {
          error: "Database Error",
          message: `A database error occurred: ${error.message}`,
        },
        { status: 500 },
      )
  }
}

/**
 * バリデーションエラークラス
 */
export class ValidationError extends Error {
  fields: Record<string, string>

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message)
    this.name = "ValidationError"
    this.fields = fields
  }
}

/**
 * 入力データのバリデーション
 * @param data 検証するデータ
 * @param schema バリデーションスキーマ
 * @throws ValidationError バリデーションエラー
 */
export function validateData<T>(data: T, schema: Record<keyof T, (value: any) => boolean | string>): void {
  const errors: Record<string, string> = {}

  for (const [key, validator] of Object.entries(schema) as [keyof T, (value: any) => boolean | string][]) {
    const value = data[key]
    const result = validator(value)

    if (typeof result === "string") {
      errors[key as string] = result
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors)
  }
}

/**
 * バリデーターの作成
 */
export const validators = {
  required:
    (fieldName: string) =>
    (value: any): boolean | string => {
      if (value === undefined || value === null || value === "") {
        return `${fieldName} is required`
      }
      return true
    },

  minLength:
    (fieldName: string, min: number) =>
    (value: string): boolean | string => {
      if (value && value.length < min) {
        return `${fieldName} must be at least ${min} characters`
      }
      return true
    },

  maxLength:
    (fieldName: string, max: number) =>
    (value: string): boolean | string => {
      if (value && value.length > max) {
        return `${fieldName} must be at most ${max} characters`
      }
      return true
    },

  isDate:
    (fieldName: string) =>
    (value: any): boolean | string => {
      if (value && !(value instanceof Date) && isNaN(Date.parse(value))) {
        return `${fieldName} must be a valid date`
      }
      return true
    },

  isNumber:
    (fieldName: string) =>
    (value: any): boolean | string => {
      if (value && (isNaN(Number(value)) || typeof value === "boolean")) {
        return `${fieldName} must be a number`
      }
      return true
    },

  min:
    (fieldName: string, min: number) =>
    (value: number): boolean | string => {
      if (value !== undefined && value !== null && Number(value) < min) {
        return `${fieldName} must be at least ${min}`
      }
      return true
    },

  max:
    (fieldName: string, max: number) =>
    (value: number): boolean | string => {
      if (value !== undefined && value !== null && Number(value) > max) {
        return `${fieldName} must be at most ${max}`
      }
      return true
    },

  isEmail:
    (fieldName: string) =>
    (value: string): boolean | string => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return `${fieldName} must be a valid email address`
      }
      return true
    },
}
