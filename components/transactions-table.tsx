"use client"

import { useState } from "react"
import { ArrowDownToLine, ArrowUpFromLine, DollarSign, Search, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/lib/api/hooks"
import { formatCurrency, formatDate, truncateAddress, exportToCSV } from "@/lib/utils/format"
import Link from "next/link"

export function TransactionsTable() {
  const [activeTab, setActiveTab] = useState<"all" | "deposit" | "withdrawal" | "earning">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: transactions = [], isLoading } = useTransactions()

  console.log('📊 [TransactionsTable] Transactions loaded:', transactions.length, 'transactions');
  console.log('📊 [TransactionsTable] Loading state:', isLoading);
  console.log('📊 [TransactionsTable] Active tab:', activeTab);

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesTab = activeTab === "all" || tx.type === activeTab
    const matchesSearch = searchQuery === "" || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.tx_hash?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  console.log('📊 [TransactionsTable] Filtered transactions:', filteredTransactions.length);

  const getTypeCount = (type: string) => {
    if (type === "all") return transactions.length
    return transactions.filter((tx: any) => tx.type === type).length
  }

  const handleExportCSV = () => {
    const exportData = filteredTransactions.map((tx: any) => ({
      Date: formatDate(tx.timestamp, 'long'),
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Amount: tx.amount,
      Status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      'Transaction Hash': tx.tx_hash || 'N/A',
      Description: tx.description,
    }))
    exportToCSV(exportData, `stablepay-transactions-${Date.now()}`)
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-bold">Transactions</h2>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "all" ? "bg-purple-100 text-purple-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All <span className="ml-1 text-muted-foreground">{getTypeCount("all")}</span>
            </button>
            <button
              onClick={() => setActiveTab("deposit")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "deposit" ? "bg-blue-100 text-blue-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Deposits <span className="ml-1 text-muted-foreground">{getTypeCount("deposit")}</span>
            </button>
            <button
              onClick={() => setActiveTab("withdrawal")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "withdrawal" ? "bg-purple-100 text-purple-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Withdrawals <span className="ml-1 text-muted-foreground">{getTypeCount("withdrawal")}</span>
            </button>
            <button
              onClick={() => setActiveTab("earning")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "earning" ? "bg-green-100 text-green-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Earnings <span className="ml-1 text-muted-foreground">{getTypeCount("earning")}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">TYPE</th>
                <th className="pb-3 font-medium">AMOUNT</th>
                <th className="pb-3 font-medium">STATUS</th>
                <th className="pb-3 font-medium">DESCRIPTION</th>
                <th className="pb-3 font-medium">TX HASH</th>
                <th className="pb-3 font-medium text-right">DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction: any) => (
                <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                  <td className="py-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        transaction.type === "withdrawal" ? "bg-purple-100" : 
                        transaction.type === "deposit" ? "bg-blue-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.type === "withdrawal" ? (
                        <ArrowUpFromLine className="h-4 w-4 text-purple-600" />
                      ) : transaction.type === "deposit" ? (
                        <ArrowDownToLine className="h-4 w-4 text-blue-600" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`font-semibold ${
                      transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"
                    }`}>
                      {transaction.type === "withdrawal" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{transaction.type}</div>
                  </td>
                  <td className="py-4">
                    <Badge 
                      variant="secondary" 
                      className={
                        transaction.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        transaction.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {transaction.status === "completed" && "✓ "}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm max-w-xs truncate">{transaction.description}</td>
                  <td className="py-4">
                    {transaction.tx_hash ? (
                      <a
                        href={`https://etherscan.io/tx/${transaction.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 font-mono underline"
                      >
                        {truncateAddress(transaction.tx_hash)}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-4 text-right text-sm">{formatDate(transaction.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
          <Link href="/dashboard/history">
            <Button variant="ghost" className="text-purple-600">
              View Full History
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
