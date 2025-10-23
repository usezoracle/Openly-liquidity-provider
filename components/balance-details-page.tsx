"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProviderInfo, usePoolStats, useTransactions, useEarnings } from '@/lib/api/hooks'
import { formatCurrency, formatPercentage, formatDate, formatRelativeTime } from '@/lib/utils/format'
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from 'next/link'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function BalanceDetailsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const { data: providerInfo, isLoading: providerLoading } = useProviderInfo()
  const { data: poolStats } = usePoolStats()
  const { data: transactions = [] } = useTransactions()
  const { data: earnings } = useEarnings()

  console.log('📈 [BalanceDetailsPage] Provider info:', providerInfo);
  console.log('📈 [BalanceDetailsPage] Pool stats:', poolStats);
  console.log('📈 [BalanceDetailsPage] Transactions:', transactions.length);
  console.log('📈 [BalanceDetailsPage] Earnings:', earnings);
  console.log('📈 [BalanceDetailsPage] Time range:', timeRange);

  // Calculate balance breakdown
  const balanceBreakdown = [
    { name: 'Active Balance', value: providerInfo?.currentBalance || 0, color: '#8b5cf6' },
    { name: 'Total Earnings', value: providerInfo?.totalEarnings || 0, color: '#10b981' },
    { name: 'Withdrawn', value: providerInfo?.totalWithdrawn || 0, color: '#f59e0b' },
  ]

  // Recent activity
  const recentTransactions = transactions.slice(0, 5)

  // Performance metrics
  const performanceMetrics = [
    {
      label: 'Can Withdraw',
      value: providerInfo?.canWithdraw ? 'Yes' : `${providerInfo?.daysUntilWithdrawal || 0}d`,
      change: providerInfo?.canWithdraw ? 'Unlocked' : 'Locked',
      positive: providerInfo?.canWithdraw || false,
      icon: TrendingUp,
    },
    {
      label: 'Daily Earnings',
      value: formatCurrency(earnings?.average_daily || 0),
      change: '+5.2%',
      positive: true,
      icon: DollarSign,
    },
    {
      label: 'Pool Share',
      value: formatPercentage(
        ((providerInfo?.currentBalance || 0) / (poolStats?.totalLiquidity || 1)) * 100
      ),
      change: '+0.8%',
      positive: true,
      icon: Activity,
    },
    {
      label: 'Total Deposits',
      value: providerInfo?.deposits?.length || 0,
      change: `${formatCurrency(providerInfo?.totalDeposited || 0)}`,
      positive: true,
      icon: Calendar,
    },
  ]

  if (providerLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liquidity Balance Details</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive breakdown of your liquidity portfolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Link href="/dashboard/deposit">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </Link>
        </div>
      </div>

      {/* Balance Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-purple-600" />
                {metric.change && (
                  <Badge className={metric.positive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                    {metric.change}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Composition */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Composition</CardTitle>
              <CardDescription>
                Breakdown of your total liquidity portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={balanceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {balanceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend and Values */}
                <div className="space-y-4">
                  {balanceBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Portfolio</span>
                      <span className="text-lg font-bold text-purple-600">
                        {formatCurrency(
                          (providerInfo?.currentBalance || 0) + 
                          (providerInfo?.totalEarnings || 0) + 
                          (providerInfo?.totalWithdrawn || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>
                Daily earnings over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {earnings?.daily_earnings && earnings.daily_earnings.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={earnings.daily_earnings.slice(-30).map((day: any) => ({ 
                    date: formatDate(day.date, 'short'),
                    amount: day.amount,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [formatCurrency(value), 'Earnings']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#8b5cf6"
                      fill="url(#colorEarnings)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                  No earnings data available yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest transactions
                </CardDescription>
              </div>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'deposit' ? 'bg-blue-100' :
                        tx.type === 'withdrawal' ? 'bg-purple-100' :
                        'bg-green-100'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <ArrowDownToLine className="h-4 w-4 text-blue-600" />
                        ) : tx.type === 'withdrawal' ? (
                          <ArrowUpFromLine className="h-4 w-4 text-purple-600" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(new Date(tx.timestamp))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <Badge className={
                        tx.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(providerInfo?.currentBalance || 0)}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Deposited</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(providerInfo?.totalDeposited || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(providerInfo?.totalEarnings || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Withdrawn</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(providerInfo?.totalWithdrawn || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {formatCurrency((providerInfo?.totalEarnings || 0) - (providerInfo?.totalWithdrawn || 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pool Health */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Lock Period</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {poolStats?.lockPeriodDays || 7} days
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Funds are locked for {poolStats?.lockPeriodDays || 7} days from your last deposit
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Liquidity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(poolStats?.totalLiquidity || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Providers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {poolStats?.totalProviders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Balance</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(poolStats?.averageProviderBalance || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Deposited</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(poolStats?.totalDeposited || 0)}
                  </span>
                </div>
              </div>

              <Link href="/dashboard/pool-stats">
                <Button variant="outline" className="w-full mt-4">
                  View Pool Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/deposit">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit USDC
                </Button>
              </Link>
              <Link href="/dashboard/withdraw">
                <Button className="w-full" variant="outline">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </Link>
              <Link href="/dashboard/history">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
