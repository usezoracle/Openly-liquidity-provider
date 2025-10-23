'use client'

import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProviderInfo } from "@/lib/api/hooks"
import { formatCurrency, formatPercentage } from "@/lib/utils/format"
import Link from "next/link"

export function BalanceCard() {
  const { data: providerInfo, isLoading } = useProviderInfo()

  console.log('💳 [BalanceCard] Provider info:', providerInfo);
  console.log('💳 [BalanceCard] Loading state:', isLoading);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm">
            $
          </div>
          <span className="text-sm text-muted-foreground">Available Balance</span>
        </div>
        <div className="mb-2 text-4xl font-bold">
          {formatCurrency(providerInfo?.currentBalance || 0)}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>Network:</span>
          <span className="font-semibold text-purple-600 uppercase">
            {providerInfo?.chain || 'BASE'}
          </span>
          <span className="mx-2">•</span>
          <span>{providerInfo?.token || 'USDC'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/deposit" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Deposit
          </Button>
        </Link>
        <Link href="/dashboard/withdraw" className="flex-1">
          <Button className="w-full" variant="outline">
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </Link>
        <Link href="/dashboard/history" className="flex-1">
          <Button className="w-full" variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            History
          </Button>
        </Link>
      </div>
    </Card>
  )
}
