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
    { header: "顧客名", key: "customerName", width: 20 },
    { header: "商談名", key: "dealName", width: 30 },
    { header: "商談金額", key: "amount", width: 15 },
    { header: "ステータス", key: "status", width: 15 },
    { header: "開始日", key: "startDate", width: 15 },
    { header: "終了日", key: "endDate", width: 15 },
    { header: "担当者", key: "assignedTo", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    customerName: "サンプル株式会社",
    dealName: "2023年度システム開発案件",
    amount: 5000000,
    status: "提案中",
    startDate: "2023-04-01",
    endDate: "2023-09-30",
    assignedTo: "山田太郎",
    notes: "初回商談済み、見積もり提出待ち",
  })

  // 説明行の追加
  worksheet.addRow({
    customerName: "※必須",
    dealName: "※必須",
    amount: "※必須（数値）",
    status: "※必須（提案中/契約済/失注）",
    startDate: "※必須（YYYY-MM-DD）",
    endDate: "※必須（YYYY-MM-DD）",
    assignedTo: "※任意",
    notes: "※任意",
  })
}

// 契約アイテムテンプレートの設定
function setupDealItemsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "商談名", key: "dealName", width: 30 },
    { header: "商品名", key: "productName", width: 20 },
    { header: "数量", key: "quantity", width: 10 },
    { header: "単価", key: "unitPrice", width: 15 },
    { header: "税率", key: "taxRate", width: 10 },
    { header: "税込金額", key: "totalAmount", width: 15 },
    { header: "納品日", key: "deliveryDate", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    dealName: "2023年度システム開発案件",
    productName: "システム開発サービス",
    quantity: 1,
    unitPrice: 3000000,
    taxRate: 0.1,
    totalAmount: 3300000,
    deliveryDate: "2023-09-30",
    notes: "初期開発費用",
  })

  // 説明行の追加
  worksheet.addRow({
    dealName: "※必須（既存の商談名）",
    productName: "※必須",
    quantity: "※必須（数値）",
    unitPrice: "※必須（数値）",
    taxRate: "※必須（0.1 = 10%）",
    totalAmount: "※自動計算されます",
    deliveryDate: "※必須（YYYY-MM-DD）",
    notes: "※任意",
  })
}

// 予算テンプレートの設定
function setupBudgetsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "年度", key: "fiscalYear", width: 10 },
    { header: "期間タイプ", key: "periodType", width: 15 },
    { header: "期間", key: "period", width: 10 },
    { header: "予算種別", key: "budgetType", width: 15 },
    { header: "カテゴリ", key: "category", width: 15 },
    { header: "金額", key: "amount", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    fiscalYear: 2023,
    periodType: "月次",
    period: 4,
    budgetType: "売上",
    category: "システム開発",
    amount: 5000000,
    notes: "4月の売上予算",
  })

  worksheet.addRow({
    fiscalYear: 2023,
    periodType: "月次",
    period: 4,
    budgetType: "費用",
    category: "人件費",
    amount: 3000000,
    notes: "4月の人件費予算",
  })

  // 説明行の追加
  worksheet.addRow({
    fiscalYear: "※必須（数値）",
    periodType: "※必須（月次/四半期/年次）",
    period: "※必須（月次:1-12, 四半期:1-4, 年次:1）",
    budgetType: "※必須（売上/費用/利益）",
    category: "※必須",
    amount: "※必須（数値）",
    notes: "※任意",
  })
}

// 費用実績テンプレートの設定
function setupCostsTemplate(worksheet: ExcelJS.Worksheet) {
  // ヘッダー行の設定
  worksheet.columns = [
    { header: "日付", key: "date", width: 15 },
    { header: "費用種別", key: "costType", width: 15 },
    { header: "カテゴリ", key: "category", width: 15 },
    { header: "金額", key: "amount", width: 15 },
    { header: "支払先", key: "payee", width: 20 },
    { header: "プロジェクト", key: "project", width: 20 },
    { header: "担当者", key: "assignedTo", width: 15 },
    { header: "備考", key: "notes", width: 30 },
  ]

  // サンプルデータの追加
  worksheet.addRow({
    date: "2023-04-15",
    costType: "固定費",
    category: "オフィス賃料",
    amount: 500000,
    payee: "不動産会社A",
    project: "",
    assignedTo: "経理部",
    notes: "4月分オフィス賃料",
  })

  worksheet.addRow({
    date: "2023-04-20",
    costType: "変動費",
    category: "外注費",
    amount: 300000,
    payee: "開発会社B",
    project: "システム開発プロジェクト",
    assignedTo: "開発部",
    notes: "外部開発者への支払い",
  })

  // 説明行の追加
  worksheet.addRow({
    date: "※必須（YYYY-MM-DD）",
    costType: "※必須（固定費/変動費）",
    category: "※必須",
    amount: "※必須（数値）",
    payee: "※必須",
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
