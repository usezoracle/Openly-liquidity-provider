"use client"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { BalanceCard } from "@/components/balance-card"
import { GoalsSection } from "@/components/goals-section"
import { SpendingChart } from "@/components/spending-chart"
import { TransactionsTable } from "@/components/transactions-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"

export function BalanceDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <Breadcrumb />

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Balance Details</h1>

          <div className="flex items-center gap-3">
            <Select defaultValue="3weeks">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">Last week</SelectItem>
                <SelectItem value="2weeks">Last 2 weeks</SelectItem>
                <SelectItem value="3weeks">Last 3 weeks</SelectItem>
                <SelectItem value="1month">Last month</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="mar15-22">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mar15-22">15 Mar - 22 Mar</SelectItem>
                <SelectItem value="mar8-15">8 Mar - 15 Mar</SelectItem>
                <SelectItem value="mar1-8">1 Mar - 8 Mar</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage Balance
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard />
            <GoalsSection />
            <TransactionsTable />
          </div>

          <div className="lg:col-span-1">
            <SpendingChart />
          </div>
        </div>
      </main>
    </div>
  )
}
