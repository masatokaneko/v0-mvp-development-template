# ER図

以下は経営ダッシュボードのデータベース設計を表すER図です。

```mermaid title="経営ダッシュボード ER図" type="diagram"
erDiagram
    Customer ||--o{ Deal : "has"
    Deal ||--o{ DealItem : "contains"
    Product ||--o{ DealItem : "referenced_by"
    DealItem ||--o{ MonthlySales : "generates"
    
    Customer {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }
    
    Product {
        string id PK
        string name
        enum type "LICENSE/SERVICE"
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    Deal {
        string id PK
        string name
        string customerId FK
        datetime dealDate
        string fiscalPeriod
        enum type "LICENSE/SERVICE"
        datetime createdAt
        datetime updatedAt
    }
    
    DealItem {
        string id PK
        string dealId FK
        string productId FK
        string productName
        enum type "LICENSE/SERVICE"
        decimal amountBeforeTax
        decimal amountAfterTax
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }
    
    MonthlySales {
        string id PK
        string dealItemId FK
        int year
        int month
        int totalDays
        int appliedDays
        decimal dailyRate
        decimal amount
        enum type "LICENSE/SERVICE"
        datetime createdAt
        datetime updatedAt
    }
    
    Cost {
        string id PK
        int year
        int month
        enum category "LICENSE_COST/SERVICE_COST/OPERATING_EXPENSE"
        string subcategory
        decimal amount
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    Budget {
        string id PK
        int year
        int month
        int quarter
        enum type "REVENUE/COST/PROFIT"
        string category
        string subcategory
        enum salesType "LICENSE/SERVICE"
        decimal amount
        datetime createdAt
        datetime updatedAt
    }
