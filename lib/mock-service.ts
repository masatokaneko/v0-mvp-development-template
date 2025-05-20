import { Decimal } from "decimal.js"
import { customers, products, deals, dealItems, monthlySales, costs, budgets } from "./mock-data"

// 顧客関連
export const getCustomers = async () => {
  return [...customers]
}

export const getCustomerById = async (id: string) => {
  return customers.find((customer) => customer.id === id)
}

// 商品関連
export const getProducts = async () => {
  return [...products]
}

export const getProductById = async (id: string) => {
  return products.find((product) => product.id === id)
}

// 商談関連
export const getDeals = async () => {
  return [...deals]
}

export const getDealById = async (id: string) => {
  return deals.find((deal) => deal.id === id)
}

export const getDealsByCustomerId = async (customerId: string) => {
  return deals.filter((deal) => deal.customerId === customerId)
}

// 新規獲得契約アイテム関連
export const getDealItems = async () => {
  return [...dealItems]
}

export const getDealItemById = async (id: string) => {
  return dealItems.find((item) => item.id === id)
}

export const getDealItemsByDealId = async (dealId: string) => {
  return dealItems.filter((item) => item.dealId === dealId)
}

// 月次按分売上関連
export const getMonthlySales = async () => {
  return [...monthlySales]
}

export const getMonthlySalesByDealItemId = async (dealItemId: string) => {
  return monthlySales.filter((sale) => sale.dealItemId === dealItemId)
}

export const getMonthlySalesByYearMonth = async (year: number, month: number) => {
  return monthlySales.filter((sale) => sale.year === year && sale.month === month)
}

export const getMonthlySalesByYear = async (year: number) => {
  return monthlySales.filter((sale) => sale.year === year)
}

export const getMonthlySalesByYearQuarter = async (year: number, quarter: number) => {
  // 四半期の月を計算（当社の会計年度は12月開始）
  let months: number[] = []

  switch (quarter) {
    case 1: // Q1: 12月, 1月, 2月
      months = [12, 1, 2]
      break
    case 2: // Q2: 3月, 4月, 5月
      months = [3, 4, 5]
      break
    case 3: // Q3: 6月, 7月, 8月
      months = [6, 7, 8]
      break
    case 4: // Q4: 9月, 10月, 11月
      months = [9, 10, 11]
      break
  }

  return monthlySales.filter((sale) => {
    // 12月の場合は前年度の12月
    if (sale.month === 12) {
      return sale.year === year - 1 && months.includes(sale.month)
    }
    return sale.year === year && months.includes(sale.month)
  })
}

// 費用関連
export const getCosts = async () => {
  return [...costs]
}

export const getCostsByYearMonth = async (year: number, month: number) => {
  return costs.filter((cost) => cost.year === year && cost.month === month)
}

export const getCostsByYear = async (year: number) => {
  return costs.filter((cost) => cost.year === year)
}

export const getCostsByYearQuarter = async (year: number, quarter: number) => {
  // 四半期の月を計算（当社の会計年度は12月開始）
  let months: number[] = []

  switch (quarter) {
    case 1: // Q1: 12月, 1月, 2月
      months = [12, 1, 2]
      break
    case 2: // Q2: 3月, 4月, 5月
      months = [3, 4, 5]
      break
    case 3: // Q3: 6月, 7月, 8月
      months = [6, 7, 8]
      break
    case 4: // Q4: 9月, 10月, 11月
      months = [9, 10, 11]
      break
  }

  return costs.filter((cost) => {
    // 12月の場合は前年度の12月
    if (cost.month === 12) {
      return cost.year === year - 1 && months.includes(cost.month)
    }
    return cost.year === year && months.includes(cost.month)
  })
}

// 予算関連
export const getBudgets = async () => {
  return [...budgets]
}

export const getBudgetsByYearMonth = async (year: number, month: number) => {
  return budgets.filter((budget) => budget.year === year && budget.month === month)
}

export const getBudgetsByYear = async (year: number) => {
  return budgets.filter((budget) => budget.year === year && budget.month === null)
}

export const getBudgetsByYearQuarter = async (year: number, quarter: number) => {
  return budgets.filter((budget) => budget.year === year && budget.quarter === quarter)
}

// 集計関連
export const getSalesSummaryByMonth = async (year: number, month: number) => {
  const sales = await getMonthlySalesByYearMonth(year, month)

  // ライセンス売上とサービス売上に分ける
  const licenseSales = sales
    .filter((sale) => sale.type === "LICENSE")
    .reduce((sum, sale) => sum.plus(sale.amount), new Decimal(0))

  const serviceSales = sales
    .filter((sale) => sale.type === "SERVICE")
    .reduce((sum, sale) => sum.plus(sale.amount), new Decimal(0))

  const totalSales = licenseSales.plus(serviceSales)

  return {
    licenseSales,
    serviceSales,
    totalSales,
  }
}

export const getCostSummaryByMonth = async (year: number, month: number) => {
  const costsData = await getCostsByYearMonth(year, month)

  // ライセンス原価、サービス原価、販管費に分ける
  const licenseCosts = costsData
    .filter((cost) => cost.type === "COST_OF_SALES_LICENSE")
    .reduce((sum, cost) => sum.plus(cost.amount), new Decimal(0))

  const serviceCosts = costsData
    .filter((cost) => cost.type === "COST_OF_SALES_SERVICE")
    .reduce((sum, cost) => sum.plus(cost.amount), new Decimal(0))

  const sgAndA = costsData
    .filter((cost) => cost.type === "SG_AND_A")
    .reduce((sum, cost) => sum.plus(cost.amount), new Decimal(0))

  const totalCosts = licenseCosts.plus(serviceCosts).plus(sgAndA)

  return {
    licenseCosts,
    serviceCosts,
    sgAndA,
    totalCosts,
  }
}

export const getProfitSummaryByMonth = async (year: number, month: number) => {
  const salesSummary = await getSalesSummaryByMonth(year, month)
  const costSummary = await getCostSummaryByMonth(year, month)

  const grossProfit = salesSummary.totalSales.minus(costSummary.licenseCosts).minus(costSummary.serviceCosts)
  const operatingProfit = grossProfit.minus(costSummary.sgAndA)

  const grossProfitMargin = salesSummary.totalSales.isZero()
    ? new Decimal(0)
    : grossProfit.dividedBy(salesSummary.totalSales).times(100)

  const operatingProfitMargin = salesSummary.totalSales.isZero()
    ? new Decimal(0)
    : operatingProfit.dividedBy(salesSummary.totalSales).times(100)

  return {
    grossProfit,
    operatingProfit,
    grossProfitMargin,
    operatingProfitMargin,
  }
}

// 予実比較関連
export const getBudgetActualComparisonByMonth = async (year: number, month: number) => {
  const salesSummary = await getSalesSummaryByMonth(year, month)
  const costSummary = await getCostSummaryByMonth(year, month)
  const profitSummary = await getProfitSummaryByMonth(year, month)

  const budgetsData = await getBudgetsByYearMonth(year, month)

  // 売上予算
  const licenseSalesBudget =
    budgetsData.find((budget) => budget.type === "SALES" && budget.salesType === "LICENSE")?.amount || new Decimal(0)

  const serviceSalesBudget =
    budgetsData.find((budget) => budget.type === "SALES" && budget.salesType === "SERVICE")?.amount || new Decimal(0)

  const totalSalesBudget = licenseSalesBudget.plus(serviceSalesBudget)

  // 費用予算
  const licenseCostsBudget =
    budgetsData.find((budget) => budget.type === "COST_OF_SALES" && budget.category === "ライセンス原価")?.amount ||
    new Decimal(0)

  const serviceCostsBudget =
    budgetsData.find((budget) => budget.type === "COST_OF_SALES" && budget.category === "サービス原価")?.amount ||
    new Decimal(0)

  // 販管費予算（カテゴリ別に集計）
  const sgAndABudgets = budgetsData.filter((budget) => budget.type === "SG_AND_A")
  const sgAndABudget = sgAndABudgets.reduce((sum, budget) => sum.plus(budget.amount), new Decimal(0))

  const totalCostsBudget = licenseCostsBudget.plus(serviceCostsBudget).plus(sgAndABudget)

  // 利益予算
  const grossProfitBudget = totalSalesBudget.minus(licenseCostsBudget).minus(serviceCostsBudget)
  const operatingProfitBudget = grossProfitBudget.minus(sgAndABudget)

  // 予実比較
  return {
    sales: {
      license: {
        actual: salesSummary.licenseSales,
        budget: licenseSalesBudget,
        variance: salesSummary.licenseSales.minus(licenseSalesBudget),
        achievementRate: licenseSalesBudget.isZero()
          ? new Decimal(0)
          : salesSummary.licenseSales.dividedBy(licenseSalesBudget).times(100),
      },
      service: {
        actual: salesSummary.serviceSales,
        budget: serviceSalesBudget,
        variance: salesSummary.serviceSales.minus(serviceSalesBudget),
        achievementRate: serviceSalesBudget.isZero()
          ? new Decimal(0)
          : salesSummary.serviceSales.dividedBy(serviceSalesBudget).times(100),
      },
      total: {
        actual: salesSummary.totalSales,
        budget: totalSalesBudget,
        variance: salesSummary.totalSales.minus(totalSalesBudget),
        achievementRate: totalSalesBudget.isZero()
          ? new Decimal(0)
          : salesSummary.totalSales.dividedBy(totalSalesBudget).times(100),
      },
    },
    costs: {
      licenseCosts: {
        actual: costSummary.licenseCosts,
        budget: licenseCostsBudget,
        variance: costSummary.licenseCosts.minus(licenseCostsBudget),
        achievementRate: licenseCostsBudget.isZero()
          ? new Decimal(0)
          : costSummary.licenseCosts.dividedBy(licenseCostsBudget).times(100),
      },
      serviceCosts: {
        actual: costSummary.serviceCosts,
        budget: serviceCostsBudget,
        variance: costSummary.serviceCosts.minus(serviceCostsBudget),
        achievementRate: serviceCostsBudget.isZero()
          ? new Decimal(0)
          : costSummary.serviceCosts.dividedBy(serviceCostsBudget).times(100),
      },
      sgAndA: {
        actual: costSummary.sgAndA,
        budget: sgAndABudget,
        variance: costSummary.sgAndA.minus(sgAndABudget),
        achievementRate: sgAndABudget.isZero() ? new Decimal(0) : costSummary.sgAndA.dividedBy(sgAndABudget).times(100),
      },
      total: {
        actual: costSummary.totalCosts,
        budget: totalCostsBudget,
        variance: costSummary.totalCosts.minus(totalCostsBudget),
        achievementRate: totalCostsBudget.isZero()
          ? new Decimal(0)
          : costSummary.totalCosts.dividedBy(totalCostsBudget).times(100),
      },
    },
    profits: {
      grossProfit: {
        actual: profitSummary.grossProfit,
        budget: grossProfitBudget,
        variance: profitSummary.grossProfit.minus(grossProfitBudget),
        achievementRate: grossProfitBudget.isZero()
          ? new Decimal(0)
          : profitSummary.grossProfit.dividedBy(grossProfitBudget).times(100),
      },
      operatingProfit: {
        actual: profitSummary.operatingProfit,
        budget: operatingProfitBudget,
        variance: profitSummary.operatingProfit.minus(operatingProfitBudget),
        achievementRate: operatingProfitBudget.isZero()
          ? new Decimal(0)
          : profitSummary.operatingProfit.dividedBy(operatingProfitBudget).times(100),
      },
    },
  }
}
