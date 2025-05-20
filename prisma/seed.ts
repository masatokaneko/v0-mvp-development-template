import { PrismaClient, ProductType, DealType, CostType, BudgetType, UserRole } from "@prisma/client"
import { hash } from "bcrypt"
import { Decimal } from "decimal.js"

const prisma = new PrismaClient()

async function main() {
  console.log("シードデータの作成を開始します...")

  try {
    // 管理者ユーザーの作成
    console.log("ユーザーデータを作成中...")
    const adminPassword = await hash("admin123", 10)
    await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "管理者",
        email: "admin@example.com",
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    })

    const userPassword = await hash("user123", 10)
    await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        name: "一般ユーザー",
        email: "user@example.com",
        password: userPassword,
        role: UserRole.USER,
      },
    })

    // 顧客データの作成
    console.log("顧客データを作成中...")
    const customers = await Promise.all([
      prisma.customer.upsert({
        where: { id: "cust1" },
        update: {},
        create: { id: "cust1", name: "株式会社テクノロジー" },
      }),
      prisma.customer.upsert({
        where: { id: "cust2" },
        update: {},
        create: { id: "cust2", name: "株式会社イノベーション" },
      }),
      prisma.customer.upsert({
        where: { id: "cust3" },
        update: {},
        create: { id: "cust3", name: "株式会社デジタルソリューション" },
      }),
      prisma.customer.upsert({
        where: { id: "cust4" },
        update: {},
        create: { id: "cust4", name: "株式会社クラウドサービス" },
      }),
      prisma.customer.upsert({
        where: { id: "cust5" },
        update: {},
        create: { id: "cust5", name: "株式会社データアナリティクス" },
      }),
    ])

    // 商品データの作成
    console.log("商品データを作成中...")
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: "prod1" },
        update: {},
        create: {
          id: "prod1",
          name: "エンタープライズライセンス",
          type: ProductType.LICENSE,
          description: "企業向け基本ライセンス",
        },
      }),
      prisma.product.upsert({
        where: { id: "prod2" },
        update: {},
        create: {
          id: "prod2",
          name: "プレミアムライセンス",
          type: ProductType.LICENSE,
          description: "高機能ライセンス",
        },
      }),
      prisma.product.upsert({
        where: { id: "prod3" },
        update: {},
        create: {
          id: "prod3",
          name: "コンサルティングサービス",
          type: ProductType.SERVICE,
          description: "導入支援コンサルティング",
        },
      }),
      prisma.product.upsert({
        where: { id: "prod4" },
        update: {},
        create: {
          id: "prod4",
          name: "カスタマイズ開発",
          type: ProductType.SERVICE,
          description: "カスタム機能開発",
        },
      }),
      prisma.product.upsert({
        where: { id: "prod5" },
        update: {},
        create: {
          id: "prod5",
          name: "トレーニングサービス",
          type: ProductType.SERVICE,
          description: "ユーザートレーニング",
        },
      }),
    ])

    // 商談データの作成
    console.log("商談データを作成中...")
    const deals = await Promise.all([
      prisma.deal.upsert({
        where: { id: "deal1" },
        update: {},
        create: {
          id: "deal1",
          name: "株式会社テクノロジー 基本契約",
          customerId: "cust1",
          dealDate: new Date("2024-01-15"),
          fiscalYear: 2024,
          fiscalQuarter: 1,
          type: DealType.MIXED,
        },
      }),
      prisma.deal.upsert({
        where: { id: "deal2" },
        update: {},
        create: {
          id: "deal2",
          name: "株式会社イノベーション 年間契約",
          customerId: "cust2",
          dealDate: new Date("2024-02-10"),
          fiscalYear: 2024,
          fiscalQuarter: 1,
          type: DealType.LICENSE,
        },
      }),
      prisma.deal.upsert({
        where: { id: "deal3" },
        update: {},
        create: {
          id: "deal3",
          name: "株式会社デジタルソリューション 導入支援",
          customerId: "cust3",
          dealDate: new Date("2024-03-05"),
          fiscalYear: 2024,
          fiscalQuarter: 2,
          type: DealType.SERVICE,
        },
      }),
      prisma.deal.upsert({
        where: { id: "deal4" },
        update: {},
        create: {
          id: "deal4",
          name: "株式会社クラウドサービス 拡張契約",
          customerId: "cust4",
          dealDate: new Date("2024-04-20"),
          fiscalYear: 2024,
          fiscalQuarter: 2,
          type: DealType.MIXED,
        },
      }),
      prisma.deal.upsert({
        where: { id: "deal5" },
        update: {},
        create: {
          id: "deal5",
          name: "株式会社データアナリティクス 新規契約",
          customerId: "cust5",
          dealDate: new Date("2024-05-12"),
          fiscalYear: 2024,
          fiscalQuarter: 3,
          type: DealType.LICENSE,
        },
      }),
    ])

    // 契約アイテムデータの作成
    console.log("契約アイテムデータを作成中...")
    const dealItems = await Promise.all([
      prisma.dealItem.upsert({
        where: { id: "item1" },
        update: {},
        create: {
          id: "item1",
          dealId: "deal1",
          productId: "prod1",
          productName: "エンタープライズライセンス",
          type: ProductType.LICENSE,
          amountBeforeTax: new Decimal(1000000),
          amountAfterTax: new Decimal(1100000),
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-12-31"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item2" },
        update: {},
        create: {
          id: "item2",
          dealId: "deal1",
          productId: "prod3",
          productName: "コンサルティングサービス",
          type: ProductType.SERVICE,
          amountBeforeTax: new Decimal(500000),
          amountAfterTax: new Decimal(550000),
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-03-15"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item3" },
        update: {},
        create: {
          id: "item3",
          dealId: "deal2",
          productId: "prod2",
          productName: "プレミアムライセンス",
          type: ProductType.LICENSE,
          amountBeforeTax: new Decimal(1500000),
          amountAfterTax: new Decimal(1650000),
          startDate: new Date("2024-02-01"),
          endDate: new Date("2025-01-31"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item4" },
        update: {},
        create: {
          id: "item4",
          dealId: "deal3",
          productId: "prod4",
          productName: "カスタマイズ開発",
          type: ProductType.SERVICE,
          amountBeforeTax: new Decimal(800000),
          amountAfterTax: new Decimal(880000),
          startDate: new Date("2024-03-15"),
          endDate: new Date("2024-06-15"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item5" },
        update: {},
        create: {
          id: "item5",
          dealId: "deal4",
          productId: "prod1",
          productName: "エンタープライズライセンス",
          type: ProductType.LICENSE,
          amountBeforeTax: new Decimal(1200000),
          amountAfterTax: new Decimal(1320000),
          startDate: new Date("2024-05-01"),
          endDate: new Date("2025-04-30"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item6" },
        update: {},
        create: {
          id: "item6",
          dealId: "deal4",
          productId: "prod5",
          productName: "トレーニングサービス",
          type: ProductType.SERVICE,
          amountBeforeTax: new Decimal(300000),
          amountAfterTax: new Decimal(330000),
          startDate: new Date("2024-05-15"),
          endDate: new Date("2024-07-15"),
        },
      }),
      prisma.dealItem.upsert({
        where: { id: "item7" },
        update: {},
        create: {
          id: "item7",
          dealId: "deal5",
          productId: "prod2",
          productName: "プレミアムライセンス",
          type: ProductType.LICENSE,
          amountBeforeTax: new Decimal(2000000),
          amountAfterTax: new Decimal(2200000),
          startDate: new Date("2024-06-01"),
          endDate: new Date("2025-05-31"),
        },
      }),
    ])

    // 月次按分売上データの作成
    console.log("月次按分売上データを作成中...")
    await generateAndCreateMonthlySales()

    // 費用データの作成
    console.log("費用データを作成中...")
    await createCostData()

    // 予算データの作成
    console.log("予算データを作成中...")
    await createBudgetData()

    console.log("シードデータの作成が完了しました")
  } catch (error) {
    console.error("シードデータの作成中にエラーが発生しました:", error)
    throw error
  }
}

// 月次按分売上データを生成して作成する関数
async function generateAndCreateMonthlySales() {
  // 全ての契約アイテムを取得
  const dealItems = await prisma.dealItem.findMany()

  for (const item of dealItems) {
    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)

    // 契約期間の総日数を計算
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // 日割り単価
    const dailyRate = item.amountAfterTax.dividedBy(totalDays)

    // 開始年月と終了年月
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1 // JavaScriptの月は0始まり
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    // 各月の按分額を計算
    let currentYear = startYear
    let currentMonth = startMonth

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      // 月の日数
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

      // 適用日数を計算
      let appliedDays

      if (currentYear === startYear && currentMonth === startMonth) {
        // 開始月
        const startDay = startDate.getDate()
        appliedDays = daysInMonth - startDay + 1
      } else if (currentYear === endYear && currentMonth === endMonth) {
        // 終了月
        appliedDays = endDate.getDate()
      } else {
        // 中間の月
        appliedDays = daysInMonth
      }

      // 月の按分額
      const amount = dailyRate.times(appliedDays)

      // 月次按分売上データを作成
      await prisma.monthlySales.upsert({
        where: {
          dealItemId_year_month: {
            dealItemId: item.id,
            year: currentYear,
            month: currentMonth,
          },
        },
        update: {
          totalDays: daysInMonth,
          appliedDays: appliedDays,
          dailyRate: dailyRate,
          amount: amount,
          type: item.type,
        },
        create: {
          dealItemId: item.id,
          year: currentYear,
          month: currentMonth,
          totalDays: daysInMonth,
          appliedDays: appliedDays,
          dailyRate: dailyRate,
          amount: amount,
          type: item.type,
        },
      })

      // 次の月へ
      if (currentMonth === 12) {
        currentYear++
        currentMonth = 1
      } else {
        currentMonth++
      }
    }
  }
}

// 費用データを作成する関数
async function createCostData() {
  // ライセンス原価
  for (let month = 1; month <= 5; month++) {
    await prisma.cost.upsert({
      where: {
        year_month_type_category: {
          year: 2024,
          month: month,
          type: CostType.COST_OF_SALES_LICENSE,
          category: "ライセンス原価",
        },
      },
      update: {
        amount: new Decimal(200000 + month * 10000),
        description: `${month}月ライセンス原価`,
      },
      create: {
        year: 2024,
        month: month,
        type: CostType.COST_OF_SALES_LICENSE,
        category: "ライセンス原価",
        amount: new Decimal(200000 + month * 10000),
        description: `${month}月ライセンス原価`,
      },
    })
  }

  // サービス原価
  for (let month = 1; month <= 5; month++) {
    await prisma.cost.upsert({
      where: {
        year_month_type_category: {
          year: 2024,
          month: month,
          type: CostType.COST_OF_SALES_SERVICE,
          category: "サービス原価",
        },
      },
      update: {
        amount: new Decimal(150000 + month * 10000),
        description: `${month}月サービス原価`,
      },
      create: {
        year: 2024,
        month: month,
        type: CostType.COST_OF_SALES_SERVICE,
        category: "サービス原価",
        amount: new Decimal(150000 + month * 10000),
        description: `${month}月サービス原価`,
      },
    })
  }

  // 販管費（人件費）
  for (let month = 1; month <= 5; month++) {
    await prisma.cost.upsert({
      where: {
        year_month_type_category: {
          year: 2024,
          month: month,
          type: CostType.SG_AND_A,
          category: "人件費",
        },
      },
      update: {
        amount: new Decimal(500000),
        description: `${month}月人件費`,
      },
      create: {
        year: 2024,
        month: month,
        type: CostType.SG_AND_A,
        category: "人件費",
        amount: new Decimal(500000),
        description: `${month}月人件費`,
      },
    })
  }

  // 販管費（オフィス費）
  for (let month = 1; month <= 5; month++) {
    await prisma.cost.upsert({
      where: {
        year_month_type_category: {
          year: 2024,
          month: month,
          type: CostType.SG_AND_A,
          category: "オフィス費",
        },
      },
      update: {
        amount: new Decimal(100000),
        description: `${month}月オフィス費`,
      },
      create: {
        year: 2024,
        month: month,
        type: CostType.SG_AND_A,
        category: "オフィス費",
        amount: new Decimal(100000),
        description: `${month}月オフィス費`,
      },
    })
  }

  // 販管費（広告宣伝費）
  for (let month = 1; month <= 5; month++) {
    await prisma.cost.upsert({
      where: {
        year_month_type_category: {
          year: 2024,
          month: month,
          type: CostType.SG_AND_A,
          category: "広告宣伝費",
        },
      },
      update: {
        amount: new Decimal(80000 + month * 10000),
        description: `${month}月広告宣伝費`,
      },
      create: {
        year: 2024,
        month: month,
        type: CostType.SG_AND_A,
        category: "広告宣伝費",
        amount: new Decimal(80000 + month * 10000),
        description: `${month}月広告宣伝費`,
      },
    })
  }
}

// 予算データを作成する関数
async function createBudgetData() {
  // 売上予算（月次）
  for (let month = 1; month <= 5; month++) {
    // ライセンス売上予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.SALES,
          category: null,
          salesType: ProductType.LICENSE,
        },
      },
      update: {
        amount: new Decimal(800000 + month * 50000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.SALES,
        salesType: ProductType.LICENSE,
        amount: new Decimal(800000 + month * 50000),
      },
    })

    // サービス売上予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.SALES,
          category: null,
          salesType: ProductType.SERVICE,
        },
      },
      update: {
        amount: new Decimal(400000 + month * 50000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.SALES,
        salesType: ProductType.SERVICE,
        amount: new Decimal(400000 + month * 50000),
      },
    })
  }

  // 費用予算（月次）
  for (let month = 1; month <= 5; month++) {
    // ライセンス原価予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.COST_OF_SALES,
          category: "ライセンス原価",
          salesType: null,
        },
      },
      update: {
        amount: new Decimal(240000 + month * 15000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.COST_OF_SALES,
        category: "ライセンス原価",
        amount: new Decimal(240000 + month * 15000),
      },
    })

    // サービス原価予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.COST_OF_SALES,
          category: "サービス原価",
          salesType: null,
        },
      },
      update: {
        amount: new Decimal(160000 + month * 20000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.COST_OF_SALES,
        category: "サービス原価",
        amount: new Decimal(160000 + month * 20000),
      },
    })

    // 人件費予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.SG_AND_A,
          category: "人件費",
          salesType: null,
        },
      },
      update: {
        amount: new Decimal(480000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.SG_AND_A,
        category: "人件費",
        amount: new Decimal(480000),
      },
    })

    // オフィス費予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.SG_AND_A,
          category: "オフィス費",
          salesType: null,
        },
      },
      update: {
        amount: new Decimal(120000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.SG_AND_A,
        category: "オフィス費",
        amount: new Decimal(120000),
      },
    })

    // 広告宣伝費予算
    await prisma.budget.upsert({
      where: {
        year_month_quarter_type_category_salesType: {
          year: 2024,
          month: month,
          quarter: null,
          type: BudgetType.SG_AND_A,
          category: "広告宣伝費",
          salesType: null,
        },
      },
      update: {
        amount: new Decimal(100000),
      },
      create: {
        year: 2024,
        month: month,
        type: BudgetType.SG_AND_A,
        category: "広告宣伝費",
        amount: new Decimal(100000),
      },
    })
  }

  // 四半期予算
  // Q1（ライセンス売上）
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: 1,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.LICENSE,
      },
    },
    update: {
      amount: new Decimal(2550000),
    },
    create: {
      year: 2024,
      quarter: 1,
      type: BudgetType.SALES,
      salesType: ProductType.LICENSE,
      amount: new Decimal(2550000),
    },
  })

  // Q2（ライセンス売上）
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: 2,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.LICENSE,
      },
    },
    update: {
      amount: new Decimal(2850000),
    },
    create: {
      year: 2024,
      quarter: 2,
      type: BudgetType.SALES,
      salesType: ProductType.LICENSE,
      amount: new Decimal(2850000),
    },
  })

  // Q1（サービス売上）
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: 1,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.SERVICE,
      },
    },
    update: {
      amount: new Decimal(1350000),
    },
    create: {
      year: 2024,
      quarter: 1,
      type: BudgetType.SALES,
      salesType: ProductType.SERVICE,
      amount: new Decimal(1350000),
    },
  })

  // Q2（サービス売上）
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: 2,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.SERVICE,
      },
    },
    update: {
      amount: new Decimal(1650000),
    },
    create: {
      year: 2024,
      quarter: 2,
      type: BudgetType.SALES,
      salesType: ProductType.SERVICE,
      amount: new Decimal(1650000),
    },
  })

  // 年間予算
  // ライセンス売上
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.LICENSE,
      },
    },
    update: {
      amount: new Decimal(12000000),
    },
    create: {
      year: 2024,
      type: BudgetType.SALES,
      salesType: ProductType.LICENSE,
      amount: new Decimal(12000000),
    },
  })

  // サービス売上
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.SALES,
        category: null,
        salesType: ProductType.SERVICE,
      },
    },
    update: {
      amount: new Decimal(6000000),
    },
    create: {
      year: 2024,
      type: BudgetType.SALES,
      salesType: ProductType.SERVICE,
      amount: new Decimal(6000000),
    },
  })

  // ライセンス原価
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.COST_OF_SALES,
        category: "ライセンス原価",
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(3600000),
    },
    create: {
      year: 2024,
      type: BudgetType.COST_OF_SALES,
      category: "ライセンス原価",
      amount: new Decimal(3600000),
    },
  })

  // サービス原価
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.COST_OF_SALES,
        category: "サービス原価",
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(2400000),
    },
    create: {
      year: 2024,
      type: BudgetType.COST_OF_SALES,
      category: "サービス原価",
      amount: new Decimal(2400000),
    },
  })

  // 人件費
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.SG_AND_A,
        category: "人件費",
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(5760000),
    },
    create: {
      year: 2024,
      type: BudgetType.SG_AND_A,
      category: "人件費",
      amount: new Decimal(5760000),
    },
  })

  // オフィス費
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.SG_AND_A,
        category: "オフィス費",
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(1440000),
    },
    create: {
      year: 2024,
      type: BudgetType.SG_AND_A,
      category: "オフィス費",
      amount: new Decimal(1440000),
    },
  })

  // 広告宣伝費
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.SG_AND_A,
        category: "広告宣伝費",
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(1200000),
    },
    create: {
      year: 2024,
      type: BudgetType.SG_AND_A,
      category: "広告宣伝費",
      amount: new Decimal(1200000),
    },
  })

  // 営業利益
  await prisma.budget.upsert({
    where: {
      year_month_quarter_type_category_salesType: {
        year: 2024,
        month: null,
        quarter: null,
        type: BudgetType.OPERATING_PROFIT,
        category: null,
        salesType: null,
      },
    },
    update: {
      amount: new Decimal(3600000),
    },
    create: {
      year: 2024,
      type: BudgetType.OPERATING_PROFIT,
      amount: new Decimal(3600000),
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
