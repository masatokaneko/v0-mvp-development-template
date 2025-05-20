"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function TaxSettings() {
  const [defaultTaxRate, setDefaultTaxRate] = useState("10")
  const [taxCalculationMethod, setTaxCalculationMethod] = useState("inclusive")
  const [enableMultipleTaxRates, setEnableMultipleTaxRates] = useState(false)
  const [taxRates, setTaxRates] = useState([
    { id: 1, name: "標準税率", rate: "10", isDefault: true },
    { id: 2, name: "軽減税率", rate: "8", isDefault: false },
  ])
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // 実際のアプリケーションでは、ここでAPIを呼び出して設定を保存します
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("税率設定が保存されました")
    setIsSaving(false)
  }

  const handleTaxRateChange = (id: number, value: string) => {
    setTaxRates(taxRates.map((rate) => (rate.id === id ? { ...rate, rate: value } : rate)))
  }

  const handleTaxNameChange = (id: number, value: string) => {
    setTaxRates(taxRates.map((rate) => (rate.id === id ? { ...rate, name: value } : rate)))
  }

  const handleSetDefault = (id: number) => {
    setTaxRates(taxRates.map((rate) => ({ ...rate, isDefault: rate.id === id })))

    const defaultRate = taxRates.find((rate) => rate.id === id)
    if (defaultRate) {
      setDefaultTaxRate(defaultRate.rate)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>税率設定</CardTitle>
        <CardDescription>アプリケーション全体で使用される税率設定を管理します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="default-tax-rate">デフォルト税率 (%)</Label>
          <Input
            id="default-tax-rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={defaultTaxRate}
            onChange={(e) => setDefaultTaxRate(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            新しい商品や契約アイテムを作成する際に適用されるデフォルトの税率です。
          </p>
        </div>

        <div className="space-y-2">
          <Label>税計算方法</Label>
          <RadioGroup value={taxCalculationMethod} onValueChange={setTaxCalculationMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inclusive" id="inclusive" />
              <Label htmlFor="inclusive">税込価格から計算（内税）</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exclusive" id="exclusive" />
              <Label htmlFor="exclusive">税抜価格から計算（外税）</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-multiple-tax-rates">複数税率を有効にする</Label>
            <Switch
              id="enable-multiple-tax-rates"
              checked={enableMultipleTaxRates}
              onCheckedChange={setEnableMultipleTaxRates}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            複数の税率（標準税率、軽減税率など）を使用する場合に有効にします。
          </p>
        </div>

        {enableMultipleTaxRates && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">税率一覧</h3>

            {taxRates.map((taxRate) => (
              <div key={taxRate.id} className="flex items-end gap-4 pb-4 border-b">
                <div className="space-y-2 flex-1">
                  <Label htmlFor={`tax-name-${taxRate.id}`}>税率名</Label>
                  <Input
                    id={`tax-name-${taxRate.id}`}
                    value={taxRate.name}
                    onChange={(e) => handleTaxNameChange(taxRate.id, e.target.value)}
                  />
                </div>

                <div className="space-y-2 w-24">
                  <Label htmlFor={`tax-rate-${taxRate.id}`}>税率 (%)</Label>
                  <Input
                    id={`tax-rate-${taxRate.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate.rate}
                    onChange={(e) => handleTaxRateChange(taxRate.id, e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pb-2">
                  <input
                    type="radio"
                    id={`tax-default-${taxRate.id}`}
                    checked={taxRate.isDefault}
                    onChange={() => handleSetDefault(taxRate.id)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor={`tax-default-${taxRate.id}`} className="text-sm">
                    デフォルト
                  </Label>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => {
                const newId = Math.max(...taxRates.map((r) => r.id)) + 1
                setTaxRates([...taxRates, { id: newId, name: "新しい税率", rate: "0", isDefault: false }])
              }}
            >
              税率を追加
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "保存中..." : "設定を保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}
