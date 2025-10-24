"use client"

import { useState } from "react"
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Search, Download, CheckCircle, Clock, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/lib/api/hooks"
import { formatCurrency, formatDate, truncateAddress, exportToCSV } from "@/lib/utils/format"
import Link from "next/link"

export function TransactionsTable() {
  const [activeTab, setActiveTab] = useState<"all" | "received" | "sent" | "convert">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: transactions = [], isLoading } = useTransactions()

  console.log('📊 [TransactionsTable] Transactions loaded:', transactions.length, 'transactions');
  console.log('📊 [TransactionsTable] Loading state:', isLoading);
  console.log('📊 [TransactionsTable] Active tab:', activeTab);

  // Map transaction types to match reference UI
  const mapTransactionType = (type: string) => {
    if (type === 'deposit' || type === 'earning') return 'received';
    if (type === 'withdrawal') return 'sent';
    return type;
  };

  const filteredTransactions = transactions.filter((tx: any) => {
    const mappedType = mapTransactionType(tx.type);
    const matchesTab = activeTab === "all" || mappedType === activeTab;
    const matchesSearch = searchQuery === "" || 
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.tx_hash?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  console.log('📊 [TransactionsTable] Filtered transactions:', filteredTransactions.length);

  const getTypeCount = (type: string) => {
    if (type === "all") return transactions.length;
    return transactions.filter((tx: any) => mapTransactionType(tx.type) === type).length;
  };

  const handleExportCSV = () => {
    const exportData = filteredTransactions.map((tx: any) => ({
      Date: formatDate(tx.timestamp, 'long'),
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Amount: tx.amount,
      Status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      'Transaction Hash': tx.tx_hash || 'N/A',
      Description: tx.description,
    }));
    exportToCSV(exportData, `stablepay-transactions-${Date.now()}`);
  };

  const getTransactionIcon = (type: string) => {
    const mappedType = mapTransactionType(type);
    if (mappedType === 'received' || type === 'deposit') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
          <ArrowDownCircle className="h-4 w-4 text-green-600" />
        </div>
      );
    }
    if (mappedType === 'sent' || type === 'withdrawal') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50">
          <ArrowUpCircle className="h-4 w-4 text-purple-600" />
        </div>
      );
    }
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
        <DollarSign className="h-4 w-4 text-blue-600" />
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 font-normal">
          <CheckCircle className="mr-1 h-3 w-3" />
          Success
        </Badge>
      );
    }
    if (status === 'pending') {
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 font-normal">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }
    if (status === 'failed') {
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 font-normal">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-100">
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search" 
                className="pl-9 w-64 h-9 border-gray-200 focus:ring-1 focus:ring-gray-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "all" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All
            <span className="ml-1.5 text-xs text-gray-500">{getTypeCount("all")}</span>
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "received" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Received
            <span className="ml-1.5 text-xs text-gray-500">{getTypeCount("received")}</span>
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "sent" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sent
            <span className="ml-1.5 text-xs text-gray-500">{getTypeCount("sent")}</span>
          </button>
          <button
            onClick={() => setActiveTab("convert")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "convert" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Convert
            <span className="ml-1.5 text-xs text-gray-500">{getTypeCount("convert")}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  People
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx.type)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">
                        {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(tx.amount).replace('$', '')} USD
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tx.tx_hash ? 'Blockchain' : 'Internal'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.tx_hash ? `•••• ${tx.tx_hash.slice(-4)}` : 'System'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {tx.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xs font-semibold">
                        {tx.description?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-gray-900">
                        {tx.description?.split(' ').slice(0, 2).join(' ') || 'User'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatDate(tx.timestamp, 'short')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center">
          <Button 
            variant="ghost" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
            onClick={() => {/* Load more logic */}}
          >
            Load More
          </Button>
        </div>
      )}
    </Card>
  );
}
