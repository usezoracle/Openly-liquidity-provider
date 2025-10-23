'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePoolStats } from '@/lib/api/hooks';
import { formatCurrency, formatPercentage, formatLargeNumber } from '@/lib/utils/format';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Activity,
  Wallet,
} from 'lucide-react';

export default function PoolStatsPage() {
  const { data: stats, isLoading } = usePoolStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const utilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'text-red-600';
    if (utilization >= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pool Statistics</h1>
        <p className="mt-2 text-gray-600">
          Real-time metrics and health indicators for the liquidity pool
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Liquidity
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.total_liquidity || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total USDC in pool
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Providers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.total_providers || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active liquidity providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average APY
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(stats?.average_apy || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current average yield
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              24h Volume
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.total_volume_24h || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Transaction volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings Distributed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.total_earnings_distributed || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              All-time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pool Utilization
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${utilizationColor(stats?.pool_utilization || 0)}`}>
              {formatPercentage(stats?.pool_utilization || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current utilization rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pool Health */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Health Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Utilization Rate</span>
              <span className={`text-sm font-bold ${utilizationColor(stats?.pool_utilization || 0)}`}>
                {formatPercentage(stats?.pool_utilization || 0)}
              </span>
            </div>
            <Progress 
              value={stats?.pool_utilization || 0} 
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {stats?.pool_utilization && stats.pool_utilization < 60 
                ? 'Healthy - Low utilization, plenty of liquidity available'
                : stats?.pool_utilization && stats.pool_utilization < 80
                ? 'Moderate - Normal utilization levels'
                : 'High - Pool is heavily utilized'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Pool Status</span>
                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                  Healthy
                </span>
              </div>
              <p className="text-xs text-green-700 mt-2">
                All systems operational, pool is functioning normally
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Liquidity Status</span>
                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                  Sufficient
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Adequate liquidity available for all operations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Liquidity Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Pool Size</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(stats?.total_liquidity || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Available Liquidity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency((stats?.total_liquidity || 0) * (1 - (stats?.pool_utilization || 0) / 100))}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Utilized Liquidity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency((stats?.total_liquidity || 0) * ((stats?.pool_utilization || 0) / 100))}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Provider Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Providers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats?.total_providers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Avg. Provider Balance</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency((stats?.total_liquidity || 0) / (stats?.total_providers || 1))}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Distributed Earnings</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(stats?.total_earnings_distributed || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

