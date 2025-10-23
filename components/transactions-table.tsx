"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Search, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const transactions = [
  {
    type: "sent",
    amount: "-200.000 IDR",
    amountUSD: "40 USD",
    paymentMethod: "Credit Card",
    cardNumber: "**** 9388",
    status: "Success",
    activity: "Sending money to Raihan Fikri",
    person: {
      name: "Raihan Zuhilmin",
      avatar: "/placeholder.svg?height=32&width=32",
      initial: "R",
      color: "bg-orange-500",
    },
    date: "Aug 28, 2023 3:40 PM",
  },
  {
    type: "sent",
    amount: "-200.000 IDR",
    amountUSD: "18 USD",
    paymentMethod: "Wire Transfer",
    cardNumber: "**** 9830",
    status: "Success",
    activity: "Sending money to Bani Zuhilmin",
    person: {
      name: "Bani Zuhilmin",
      avatar: "/placeholder.svg?height=32&width=32",
      initial: "B",
      color: "bg-teal-500",
    },
    date: "Aug 28, 2023 3:40 PM",
  },
  {
    type: "received",
    amount: "+1.600 USD",
    amountUSD: "",
    paymentMethod: "Bank Transfer",
    cardNumber: "**** 6663",
    status: "Success",
    activity: "Received money from Andrew",
    person: { name: "Andrew Top G", avatar: "/placeholder.svg?height=32&width=32", initial: "A", color: "bg-red-500" },
    date: "Aug 28, 2023 3:40 PM",
  },
  {
    type: "received",
    amount: "+2.500 USD",
    amountUSD: "",
    paymentMethod: "PayPal",
    cardNumber: "",
    status: "Success",
    activity: "Payment for product",
    person: {
      name: "Clarista Jawl",
      avatar: "/placeholder.svg?height=32&width=32",
      initial: "C",
      color: "bg-gray-400",
    },
    date: "Aug 28, 2023 3:40 PM",
  },
]

export function TransactionsTable() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Transactions</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All <span className="ml-1 text-muted-foreground">150</span>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "received" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Received <span className="ml-1 text-muted-foreground">15</span>
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "sent" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sent <span className="ml-1 text-muted-foreground">5</span>
            </button>
            <button
              onClick={() => setActiveTab("convert")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === "convert" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Convert <span className="ml-1 text-muted-foreground">10</span>
            </button>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="pb-3 font-medium">TYPE</th>
              <th className="pb-3 font-medium">AMOUNT</th>
              <th className="pb-3 font-medium">PAYMENT METHOD</th>
              <th className="pb-3 font-medium">STATUS</th>
              <th className="pb-3 font-medium">ACTIVITY</th>
              <th className="pb-3 font-medium">PEOPLE</th>
              <th className="pb-3 font-medium text-right">DATE</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      transaction.type === "sent" ? "bg-purple-100" : "bg-green-100"
                    }`}
                  >
                    {transaction.type === "sent" ? (
                      <ArrowUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-success" />
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="font-semibold">{transaction.amount}</div>
                  {transaction.amountUSD && (
                    <div className="text-sm text-muted-foreground">{transaction.amountUSD}</div>
                  )}
                </td>
                <td className="py-4">
                  <div className="font-medium">{transaction.paymentMethod}</div>
                  {transaction.cardNumber && (
                    <div className="text-sm text-muted-foreground">{transaction.cardNumber}</div>
                  )}
                </td>
                <td className="py-4">
                  <Badge variant="secondary" className="bg-green-100 text-success hover:bg-green-100">
                    ✓ {transaction.status}
                  </Badge>
                </td>
                <td className="py-4 text-sm">{transaction.activity}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={transaction.person.color}>{transaction.person.initial}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{transaction.person.name}</span>
                  </div>
                </td>
                <td className="py-4 text-right text-sm">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" className="text-blue-600">
          Load More
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
