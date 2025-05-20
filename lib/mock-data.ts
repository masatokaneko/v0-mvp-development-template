// 顧客モックデータを空配列に置き換え
export const mockCustomers = []

// 商品モックデータを空配列に置き換え
export const mockProducts = []

// 商談モックデータを空配列に置き換え
export const mockDeals = []

// 新規獲得契約アイテムモックデータを空配列に置き換え
export const mockDealItems = []

// 月次按分売上モックデータを生成関数を修正
export const generateMonthlySales = () => {
  return []
}

export const mockMonthlySales = []

// 費用モックデータを空配列に置き換え
export const mockCosts = []

// 予算モックデータを空配列に置き換え
export const mockBudgets = []

// 元の名前でもエクスポートする（後方互換性のため）
export const customers = mockCustomers
export const products = mockProducts
export const deals = mockDeals
export const dealItems = mockDealItems
export const monthlySales = mockMonthlySales
export const costs = mockCosts
export const budgets = mockBudgets
