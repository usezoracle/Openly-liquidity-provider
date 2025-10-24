'use client'

import { Edit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useProviderInfo } from "@/lib/api/hooks"
import { formatCurrency } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export function GoalsSection() {
  const { data: providerInfo, isLoading } = useProviderInfo()
  
  // Calculate progress towards earnings goal (example: $5,000 total earnings)
  const earningsGoal = 5000
  const currentEarnings = providerInfo?.totalEarnings || 0
  const progress = Math.min((currentEarnings / earningsGoal) * 100, 100)
  const remaining = Math.max(earningsGoal - currentEarnings, 0)

  console.log('🎯 [GoalsSection] Current earnings:', currentEarnings);
  console.log('🎯 [GoalsSection] Progress:', progress.toFixed(2) + '%');
  console.log('🎯 [GoalsSection] Remaining:', remaining);

  if (isLoading) {
    return (
      <Card className="p-6 shadow-sm border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-sm border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 text-sm">Goals</h3>
        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit2 className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">
          {formatCurrency(remaining)} remaining to achieve your goals · {formatCurrency(currentEarnings)}/{formatCurrency(earningsGoal)}
        </div>
        
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
