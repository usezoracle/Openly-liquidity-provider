'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/lib/api/hooks';
import { formatCurrency, formatDate, exportToCSV, truncateAddress } from '@/lib/utils/format';
import { Download, ExternalLink, Filter } from 'lucide-react';
import { useState } from 'react';

type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'earning';

export default function HistoryPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const [filter, setFilter] = useState<TransactionType>('all');

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const handleExportCSV = () => {
    const exportData = filteredTransactions.map(tx => ({
      Date: formatDate(tx.timestamp, 'long'),
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Amount: tx.amount,
      Status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      'Transaction Hash': tx.tx_hash || 'N/A',
      Description: tx.description,
    }));

    exportToCSV(exportData, `transactions-${Date.now()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'withdrawal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'earning':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="mt-2 text-gray-600">
            Complete audit trail of all your activities
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['all', 'deposit', 'withdrawal', 'earning'] as TransactionType[]).map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">TX Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatDate(tx.timestamp, 'short')}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getTypeColor(tx.type)}>
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                          {tx.type === 'withdrawal' ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {tx.tx_hash ? (
                            <a
                              href={`https://etherscan.io/tx/${tx.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-purple-600 hover:text-purple-700 font-mono"
                            >
                              {truncateAddress(tx.tx_hash)}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map((tx) => (
                  <Card key={tx.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <Badge className={getTypeColor(tx.type)}>
                              {tx.type}
                            </Badge>
                            <p className="text-xs text-gray-500">
                              {formatDate(tx.timestamp, 'short')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {tx.type === 'withdrawal' ? '-' : '+'}
                              {formatCurrency(tx.amount)}
                            </p>
                            <Badge className={getStatusColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{tx.description}</p>
                        {tx.tx_hash && (
                          <a
                            href={`https://etherscan.io/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-mono"
                          >
                            {truncateAddress(tx.tx_hash)}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

