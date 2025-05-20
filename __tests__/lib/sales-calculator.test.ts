import { generateMonthlySales, calculateTotalAmount, filterByYearMonth, filterByType } from "@/lib/sales-calculator"
import { Decimal } from "decimal.js"
import { ProductType } from "@prisma/client"

describe("Sales Calculator", () => {
  describe("generateMonthlySales", () => {
    it("should generate monthly sales for a single month contract", () => {
      const dealItemId = "test-item-1"
      const startDate = new Date("2024-01-15")
      const endDate = new Date("2024-01-31")
      const totalAmount = new Decimal(100000)
      const type = ProductType.LICENSE

      const result = generateMonthlySales(dealItemId, startDate, endDate, totalAmount, type)

      expect(result).toHaveLength(1)
      expect(result[0].year).toBe(2024)
      expect(result[0].month).toBe(1)
      expect(result[0].dealItemId).toBe(dealItemId)
      expect(result[0].type).toBe(type)
      expect(result[0].totalDays).toBe(31) // January has 31 days
      expect(result[0].appliedDays).toBe(17) // 31 - 15 + 1 = 17 days

      // Check if the total amount is correct
      const totalCalculatedAmount = calculateTotalAmount(result)
      expect(totalCalculatedAmount.equals(totalAmount)).toBe(true)
    })

    it("should generate monthly sales for a multi-month contract", () => {
      const dealItemId = "test-item-2"
      const startDate = new Date("2024-01-15")
      const endDate = new Date("2024-03-15")
      const totalAmount = new Decimal(300000)
      const type = ProductType.SERVICE

      const result = generateMonthlySales(dealItemId, startDate, endDate, totalAmount, type)

      expect(result).toHaveLength(3) // January, February, March

      // Check if months are correct
      expect(result[0].year).toBe(2024)
      expect(result[0].month).toBe(1)
      expect(result[1].year).toBe(2024)
      expect(result[1].month).toBe(2)
      expect(result[2].year).toBe(2024)
      expect(result[2].month).toBe(3)

      // Check if the total amount is correct
      const totalCalculatedAmount = calculateTotalAmount(result)
      expect(totalCalculatedAmount.equals(totalAmount)).toBe(true)
    })

    it("should generate monthly sales for a contract spanning multiple years", () => {
      const dealItemId = "test-item-3"
      const startDate = new Date("2024-12-15")
      const endDate = new Date("2025-02-15")
      const totalAmount = new Decimal(300000)
      const type = ProductType.LICENSE

      const result = generateMonthlySales(dealItemId, startDate, endDate, totalAmount, type)

      expect(result).toHaveLength(3) // December 2024, January 2025, February 2025

      // Check if months and years are correct
      expect(result[0].year).toBe(2024)
      expect(result[0].month).toBe(12)
      expect(result[1].year).toBe(2025)
      expect(result[1].month).toBe(1)
      expect(result[2].year).toBe(2025)
      expect(result[2].month).toBe(2)

      // Check if the total amount is correct
      const totalCalculatedAmount = calculateTotalAmount(result)
      expect(totalCalculatedAmount.equals(totalAmount)).toBe(true)
    })
  })

  describe("filterByYearMonth", () => {
    it("should filter monthly sales by year and month", () => {
      const monthlySales = [
        {
          dealItemId: "item1",
          year: 2024,
          month: 1,
          totalDays: 31,
          appliedDays: 31,
          dailyRate: new Decimal(1000),
          amount: new Decimal(31000),
          type: ProductType.LICENSE,
        },
        {
          dealItemId: "item1",
          year: 2024,
          month: 2,
          totalDays: 29,
          appliedDays: 29,
          dailyRate: new Decimal(1000),
          amount: new Decimal(29000),
          type: ProductType.LICENSE,
        },
        {
          dealItemId: "item2",
          year: 2024,
          month: 1,
          totalDays: 31,
          appliedDays: 31,
          dailyRate: new Decimal(500),
          amount: new Decimal(15500),
          type: ProductType.SERVICE,
        },
      ]

      const result = filterByYearMonth(monthlySales, 2024, 1)

      expect(result).toHaveLength(2)
      expect(result[0].year).toBe(2024)
      expect(result[0].month).toBe(1)
      expect(result[1].year).toBe(2024)
      expect(result[1].month).toBe(1)
    })
  })

  describe("filterByType", () => {
    it("should filter monthly sales by type", () => {
      const monthlySales = [
        {
          dealItemId: "item1",
          year: 2024,
          month: 1,
          totalDays: 31,
          appliedDays: 31,
          dailyRate: new Decimal(1000),
          amount: new Decimal(31000),
          type: ProductType.LICENSE,
        },
        {
          dealItemId: "item2",
          year: 2024,
          month: 1,
          totalDays: 31,
          appliedDays: 31,
          dailyRate: new Decimal(500),
          amount: new Decimal(15500),
          type: ProductType.SERVICE,
        },
        {
          dealItemId: "item3",
          year: 2024,
          month: 2,
          totalDays: 29,
          appliedDays: 29,
          dailyRate: new Decimal(800),
          amount: new Decimal(23200),
          type: ProductType.LICENSE,
        },
      ]

      const result = filterByType(monthlySales, ProductType.LICENSE)

      expect(result).toHaveLength(2)
      expect(result[0].type).toBe(ProductType.LICENSE)
      expect(result[1].type).toBe(ProductType.LICENSE)
    })
  })
})
