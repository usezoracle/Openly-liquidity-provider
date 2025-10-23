'use client'

import { Card } from "@/components/ui/card"
import { useEarnings, useTransactions } from "@/lib/api/hooks"
import { formatCurrency } from "@/lib/utils/format"

export function SpendingChart() {
  const { data: earnings } = useEarnings()
  const { data: transactions = [] } = useTransactions()

  // Calculate totals
  const totalEarnings = earnings?.total_earnings || 0
  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0)

  // Prepare chart data from last 12 days of earnings
  const chartData = earnings?.daily_earnings?.slice(-12).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: day.amount,
  })) || []

  const maxValue = Math.max(...chartData.map(d => d.earnings), 1)

  const netProfit = totalEarnings - totalWithdrawals

  console.log('📊 [SpendingChart] Total earnings:', totalEarnings);
  console.log('📊 [SpendingChart] Total withdrawals:', totalWithdrawals);
  console.log('📊 [SpendingChart] Net profit:', netProfit);
  console.log('📊 [SpendingChart] Chart data points:', chartData.length);

  return (
    <Card className="p-6 h-fit sticky top-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          {netProfit > 0 
            ? `Great! You're earning ${formatCurrency(netProfit)} in net profit.`
            : "Track your earnings and withdrawals over time."}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-600" />
              <span className="text-xs text-muted-foreground">Total Earnings</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatCurrency(totalEarnings)}</div>
              <div className="text-xs text-muted-foreground">USDC</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-600" />
              <span className="text-xs text-muted-foreground">Withdrawals</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatCurrency(totalWithdrawals)}</div>
              <div className="text-xs text-muted-foreground">USDC</div>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="relative h-64">
          <div className="absolute right-0 top-0 text-xs text-muted-foreground">
            {formatCurrency(maxValue)}
          </div>
          <div className="absolute right-0 bottom-0 text-xs text-muted-foreground">$0</div>

          <div className="flex h-full items-end justify-between gap-1 pt-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-colors"
                    style={{ height: `${(item.earnings / maxValue) * 200}px`, minHeight: '2px' }}
                    title={`${item.date}: ${formatCurrency(item.earnings)}`}
                  />
                </div>
                {index % 3 === 0 && (
                  <span className="mt-2 text-[10px] text-muted-foreground whitespace-nowrap">{item.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No earnings data yet
        </div>
      )}
    </Card>
  )
}
