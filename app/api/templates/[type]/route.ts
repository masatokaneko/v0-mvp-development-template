import { type NextRequest, NextResponse } from "next/server"
import ExcelJS from "exceljs"

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const templateType = params.type

    // テンプレートタイプの検証
    if (!["deals", "dealItems", "budgets", "costs"].includes(templateType)) {
      return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    // Excelワークブックの作成
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Template")

    // テンプレートタイプに応じたヘッダーとサンプルデータの設定
    switch (templateType) {
      case "deals":
        setupDealsTemplate(worksheet)
        break
      case "dealItems":
        setupDealItemsTemplate(worksheet)
        break
      case "budgets":
        setupBudgetsTemplate(worksheet)
        break
      case "costs":
        setupCostsTemplate(worksheet)
        break
    }

    // スタイルの設定
    applyTemplateStyles(worksheet)

    // Excelファイルのバッファを生成
    const buffer = await workbook.xlsx.writeBuffer()

    // レスポンスヘッダーの設定
    const headers = new Headers()
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    headers.set("Content-Disposition", `attachment; filename=${templateType}_template.xlsx`)

    // バッファをレスポンスとして返す
    return new NextResponse(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Template generation error:", error)
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}

// 商談テンプレートの設定
function setupDealsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "商談名", key: "dealName", width: 30 },
    { header: "顧客名", key: "customerName", width: 20 },
    { header: "商談日", key: "dealDate", width: 15 },
    { header: "種別", key: "type", width: 15 },
    { header: "会計年度", key: "fiscalYear", width: 15 },
    { header: "四半期", key: "fiscalQuarter", width: 15 },
    { header: "担当者", key: "assignedTo", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    dealName: "2023年度システム開発案件",
    customerName: "サンプル株式会社",
    dealDate: "2023-04-01",
    type: "LICENSE",
    fiscalYear: "2023",
    fiscalQuarter: "Q1",
    assignedTo: "山田太郎",
    notes: "初回商談済み、見積もり提出待ち",
  })

  // 説明行の追加
  worksheet.addRow({
    dealName: "※必須",
    customerName: "※必須",
    dealDate: "※必須（YYYY-MM-DD）",
    type: "※必須（LICENSE/SERVICE/HARDWARE等）",
    fiscalYear: "※必須（数値）",
    fiscalQuarter: "※必須（Q1/Q2/Q3/Q4）",
    assignedTo: "※任意",
    notes: "※任意",
  })
}

// 契約アイテムテンプレートの設定
function setupDealItemsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "商談ID", key: "dealId", width: 15 },
    { header: "商品名", key: "productName", width: 20 },
    { header: "種別", key: "type", width: 15 },
    { header: "数量", key: "quantity", width: 10 },
    { header: "単価", key: "unitPrice", width: 15 },
    { header: "税率", key: "taxRate", width: 10 },
    { header: "税前金額", key: "amountBeforeTax", width: 15 },
    { header: "税後金額", key: "amountAfterTax", width: 15 },
    { header: "開始日", key: "startDate", width: 15 },
    { header: "終了日", key: "endDate", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    dealId: "DEAL-001",
    productName: "システム開発サービス",
    type: "SERVICE",
    quantity: 1,
    unitPrice: 3000000,
    taxRate: 0.1,
    amountBeforeTax: 3000000,
    amountAfterTax: 3300000,
    startDate: "2023-04-01",
    endDate: "2023-09-30",
    notes: "初期開発費用",
  })

  // 説明行の追加
  worksheet.addRow({
    dealId: "※必須（既存の商談ID）",
    productName: "※必須",
    type: "※必須（LICENSE/SERVICE/HARDWARE等）",
    quantity: "※必須（数値）",
    unitPrice: "※必須（数値）",
    taxRate: "※必須（0.1 = 10%）",
    amountBeforeTax: "※税前金額 = 数量 × 単価",
    amountAfterTax: "※税後金額 = 税前金額 × (1 + 税率)",
    startDate: "※必須（YYYY-MM-DD）日割り計算に使用",
    endDate: "※必須（YYYY-MM-DD）日割り計算に使用",
    notes: "※任意",
  })
}

// 予算テンプレートの設定
function setupBudgetsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "年度", key: "year", width: 10 },
    { header: "月", key: "month", width: 10 },
    { header: "四半期", key: "quarter", width: 10 },
    { header: "予算種別", key: "type", width: 15 },
    { header: "カテゴリ", key: "category", width: 15 },
    { header: "売上種別", key: "salesType", width: 15 },
    { header: "金額", key: "amount", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    year: 2023,
    month: 4,
    quarter: null,
    type: "SALES",
    category: null,
    salesType: "LICENSE",
    amount: 5000000,
    notes: "4月のライセンス売上予算",
  })

  worksheet.addRow({
    year: 2023,
    month: null,
    quarter: 2,
    type: "COST_OF_SALES",
    category: "人件費",
    salesType: null,
    amount: 3000000,
    notes: "第2四半期の人件費予算",
  })

  // 説明行の追加
  worksheet.addRow({
    year: "※必須（数値）",
    month: "※月次予算の場合は必須（1-12）",
    quarter: "※四半期予算の場合は必須（1-4）",
    type: "※必須（SALES/COST_OF_SALES/SG_AND_A/OPERATING_PROFIT）",
    category: "※費用予算の場合は必須",
    salesType: "※売上予算の場合は必須（LICENSE/SERVICE等）",
    amount: "※必須（数値）",
    notes: "※任意",
  })
}

// 費用実績テンプレートの設定
function setupCostsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "年", key: "year", width: 10 },
    { header: "月", key: "month", width: 10 },
    { header: "費用種別", key: "type", width: 15 },
    { header: "カテゴリ", key: "category", width: 15 },
    { header: "金額", key: "amount", width: 15 },
    { header: "説明", key: "description", width: 30 },
    { header: "支払先", key: "payee", width: 20 },
    { header: "プロジェクト", key: "project", width: 20 },
    { header: "担当者", key: "assignedTo", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    year: 2023,
    month: 4,
    type: "COST_OF_SALES_LICENSE",
    category: "ライセンス原価",
    amount: 500000,
    description: "4月分ライセンス原価",
    payee: "ベンダーA",
    project: "プロジェクトX",
    assignedTo: "経理部",
    notes: "四半期契約",
  })

  worksheet.addRow({
    year: 2023,
    month: 5,
    type: "SG_AND_A",
    category: "オフィス賃料",
    amount: 300000,
    description: "5月分オフィス賃料",
    payee: "不動産会社B",
    project: "",
    assignedTo: "総務部",
    notes: "年間契約",
  })

  // 説明行の追加
  worksheet.addRow({
    year: "※必須（数値）",
    month: "※必須（1-12）",
    type: "※必須（COST_OF_SALES_LICENSE/COST_OF_SALES_SERVICE/SG_AND_A）",
    category: "※必須",
    amount: "※必須（数値）",
    description: "※必須",
    payee: "※任意",
    project: "※任意",
    assignedTo: "※任意",
    notes: "※任意",
  })
}

// テンプレートのスタイル設定
function applyTemplateStyles(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行のスタイル設定
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD3D3D3" }, // ライトグレー
  }
  headerRow.alignment = { vertical: "middle", horizontal: "center" }

  // サンプルデータ行のスタイル設定
  const sampleRows = [2, 3]
  sampleRows.forEach((rowIndex) => {
    const row = worksheet.getRow(rowIndex)
    if (rowIndex === 3) {
      // 説明行のスタイル
      row.font = { italic: true, color: { argb: "FF808080" } } // グレー
    }
  })

  // 枠線の設定
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
  })
}
