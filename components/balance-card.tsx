'use client'

import { ArrowUpCircle, ArrowDownCircle, RefreshCw, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProviderInfo } from "@/lib/api/hooks"
import { formatCurrency } from "@/lib/utils/format"
import Link from "next/link"

export function BalanceCard() {
  const { data: providerInfo, isLoading } = useProviderInfo()

  console.log('💳 [BalanceCard] Provider info:', providerInfo);
  console.log('💳 [BalanceCard] Loading state:', isLoading);

  if (isLoading) {
    return (
      <Card className="p-8 shadow-sm border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-3 mt-6">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 shadow-sm border-gray-100">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
            </svg>
          </div>
          <span className="text-sm text-gray-600 font-medium">Total Balance</span>
        </div>
        <div className="mb-2 text-5xl font-bold text-gray-900">
          {formatCurrency(providerInfo?.currentBalance || 0).replace('$', '')} <span className="text-2xl text-gray-600 font-semibold">USD</span>
        </div>
        <div className="text-sm text-gray-500">
          1 USD = 1 USDC · As of today
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/deposit" className="flex-1">
          <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Deposit
          </Button>
        </Link>
        <Link href="/dashboard/withdraw" className="flex-1">
          <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </Link>
        <Link href="/dashboard/history" className="flex-1">
          <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium">
            <RefreshCw className="mr-2 h-4 w-4" />
            Convert
          </Button>
        </Link>
        <Button className="h-11 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
