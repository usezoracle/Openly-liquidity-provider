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

  // Prepare chart data from last 30 days
  const chartData = earnings?.daily_earnings?.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: day.amount,
  })) || []

  // Generate dummy withdrawal data for visualization
  const withdrawalData = chartData.map((_, index) => ({
    date: chartData[index]?.date,
    amount: index % 5 === 0 ? Math.random() * 20 + 5 : 0, // Random withdrawals every 5 days
  }))

  const maxValue = Math.max(
    ...chartData.map(d => d.earnings),
    ...withdrawalData.map(d => d.amount),
    1
  )

  const netProfit = totalEarnings - totalWithdrawals

  console.log('📊 [SpendingChart] Total earnings:', totalEarnings);
  console.log('📊 [SpendingChart] Total withdrawals:', totalWithdrawals);
  console.log('📊 [SpendingChart] Net profit:', netProfit);
  console.log('📊 [SpendingChart] Chart data points:', chartData.length);

  return (
    <Card className="p-6 shadow-sm border-gray-100">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">
          Looks like you are {netProfit > 0 ? 'earning' : 'spending'} more
        </p>
        <p className="text-sm text-gray-600">
          than {formatCurrency(totalEarnings < 25 ? 25 : totalEarnings)} on last 3 weeks.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-green-500" />
            <span className="text-xs text-gray-600 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-gray-300" />
            <span className="text-xs text-gray-600 font-medium">Outcome</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">4K USD</div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Income</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(totalEarnings)} <span className="text-xs text-gray-500 font-normal">USD</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Outcome</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(totalWithdrawals)} <span className="text-xs text-gray-500 font-normal">USD</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-40 mt-6">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No earnings data yet
          </div>
        ) : (
          <div className="flex items-end justify-between h-full gap-1">
            {chartData.map((day, index) => {
              const earningsHeight = (day.earnings / maxValue) * 100
              const withdrawalHeight = (withdrawalData[index].amount / maxValue) * 100

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group">
                  {/* Earnings bar */}
                  <div
                    className="w-full rounded-t transition-all duration-300 bg-green-500 hover:bg-green-600 relative group-hover:opacity-90"
                    style={{ height: `${earningsHeight}%`, minHeight: earningsHeight > 0 ? '2px' : '0' }}
                  >
                    {/* Tooltip on hover */}
                    {earningsHeight > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {formatCurrency(day.earnings)}
                      </div>
                    )}
                  </div>
                  {/* Withdrawal bar */}
                  <div
                    className="w-full rounded-b transition-all duration-300 bg-gray-300 hover:bg-gray-400"
                    style={{ height: `${withdrawalHeight}%`, minHeight: withdrawalHeight > 0 ? '2px' : '0' }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 px-1">
        {chartData.length > 0 && (
          <>
            <span className="text-xs text-gray-500">{chartData[0]?.date}</span>
            <span className="text-xs text-gray-500">
              {chartData[Math.floor(chartData.length / 2)]?.date}
            </span>
            <span className="text-xs text-gray-500">{chartData[chartData.length - 1]?.date}</span>
          </>
        )}
      </div>

      {/* Summary text */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Set your budget so that you can save <br />
          about <span className="font-semibold text-gray-700">{formatCurrency(totalEarnings * 0.2)}</span> on next time period.
        </p>
      </div>
    </Card>
  )
}
