'use client'

import { Target, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProviderInfo } from "@/lib/api/hooks"
import { formatCurrency, formatPercentage } from "@/lib/utils/format"

export function GoalsSection() {
  const { data: providerInfo, isLoading } = useProviderInfo()
  
  // Calculate progress towards earnings goal (example: $10,000 total earnings)
  const earningsGoal = 10000
  const currentEarnings = providerInfo?.totalEarnings || 0
  const progress = Math.min((currentEarnings / earningsGoal) * 100, 100)
  const remaining = Math.max(earningsGoal - currentEarnings, 0)

  console.log('🎯 [GoalsSection] Current earnings:', currentEarnings);
  console.log('🎯 [GoalsSection] Progress:', progress.toFixed(2) + '%');
  console.log('🎯 [GoalsSection] Remaining:', remaining);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Earnings Goal</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <TrendingUp className="h-3 w-3" />
          <span>{formatPercentage(progress, 0)}</span>
        </div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {remaining > 0 ? (
          <>
            <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span>
            {' '}remaining to achieve your earnings goal of{' '}
            <span className="font-semibold text-foreground">{formatCurrency(earningsGoal)}</span>
          </>
        ) : (
          <span className="font-semibold text-green-600">
            🎉 Congratulations! You've reached your earnings goal!
          </span>
        )}
      </div>

      <Progress value={progress} className="h-2 mb-2" />
      
      <div className="text-xs text-muted-foreground text-right">
        Current: {formatCurrency(currentEarnings)}
      </div>
    </Card>
  )
}
