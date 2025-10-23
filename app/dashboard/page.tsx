'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProviderInfo, usePoolStats } from '@/lib/api/hooks';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils/format';
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  Clock,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { data: providerInfo, isLoading: providerLoading } = useProviderInfo();
  const { data: poolStats, isLoading: poolLoading } = usePoolStats();

  if (providerLoading || poolLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const isLocked = providerInfo?.lock_until && new Date(providerInfo.lock_until) > new Date();
  const lockDate = providerInfo?.lock_until ? new Date(providerInfo.lock_until) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's your liquidity portfolio summary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(providerInfo?.balance || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              USDC available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(providerInfo?.total_earnings || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Current APY
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(providerInfo?.apy || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Annual percentage yield
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Lock Status
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLocked ? 'Locked' : 'Unlocked'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isLocked && lockDate ? `Until ${formatDate(lockDate)}` : 'Ready to withdraw'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/deposit">
              <Button className="w-full h-24 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <ArrowDownToLine className="mr-2 h-6 w-6" />
                Deposit USDC
              </Button>
            </Link>
            <Link href="/dashboard/withdraw">
              <Button 
                className="w-full h-24 text-lg" 
                variant="outline"
                disabled={isLocked}
              >
                <ArrowUpFromLine className="mr-2 h-6 w-6" />
                Withdraw USDC
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pool Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liquidity</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(poolStats?.total_liquidity || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {poolStats?.total_providers || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average APY</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatPercentage(poolStats?.average_apy || 0)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Pool Utilization</span>
              <span className="font-medium text-gray-900">
                {formatPercentage(poolStats?.pool_utilization || 0)}
              </span>
            </div>
            <Progress value={poolStats?.pool_utilization || 0} />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Link href="/dashboard/pool-stats">
              <Button variant="outline" className="w-full">
                View Detailed Statistics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Deposited</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(providerInfo?.total_deposited || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Withdrawn</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(providerInfo?.total_withdrawn || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Member Since</span>
              <span className="font-semibold text-gray-900">
                {providerInfo?.created_at ? formatDate(providerInfo.created_at) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-semibold text-gray-900">
                {providerInfo?.last_activity ? formatDate(providerInfo.last_activity, 'relative') : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

