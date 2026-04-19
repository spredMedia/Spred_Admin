"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialMetrics {
  lifetimeValue: number;
  totalSpending: number;
  totalEarnings: number;
  currentBalance: number;
  monthlySpending: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  transactions: Array<{
    id: string;
    type: "earning" | "spending" | "refund" | "payout";
    amount: number;
    description: string;
    date: Date;
  }>;
}

interface FinancialSummaryProps {
  metrics?: FinancialMetrics;
}

const defaultMetrics: FinancialMetrics = {
  lifetimeValue: 12847,
  totalSpending: 3245,
  totalEarnings: 16092,
  currentBalance: 8234.50,
  monthlySpending: 342,
  monthlyEarnings: 1245.67,
  pendingPayouts: 4521.83,
  transactions: [
    {
      id: "1",
      type: "earning",
      amount: 342.50,
      description: "P2P Transfer Revenue",
      date: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      type: "spending",
      amount: 49.99,
      description: "Premium Subscription Renewal",
      date: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      type: "earning",
      amount: 156.25,
      description: "Content Monetization",
      date: new Date(Date.now() - 259200000),
    },
    {
      id: "4",
      type: "payout",
      amount: 2000,
      description: "Monthly Payout",
      date: new Date(Date.now() - 345600000),
    },
    {
      id: "5",
      type: "refund",
      amount: 29.99,
      description: "Premium Upgrade Credit",
      date: new Date(Date.now() - 432000000),
    },
  ],
};

const transactionConfig = {
  earning: {
    icon: ArrowUpRight,
    color: "text-emerald-500 bg-emerald-500/10",
    textColor: "text-emerald-500",
  },
  spending: {
    icon: ArrowDownLeft,
    color: "text-rose-500 bg-rose-500/10",
    textColor: "text-rose-500",
  },
  refund: {
    icon: TrendingUp,
    color: "text-blue-500 bg-blue-500/10",
    textColor: "text-blue-500",
  },
  payout: {
    icon: Wallet,
    color: "text-amber-500 bg-amber-500/10",
    textColor: "text-amber-500",
  },
};

export function FinancialSummary({
  metrics = defaultMetrics,
}: FinancialSummaryProps) {
  const ltv = metrics.lifetimeValue;
  const netBalance = metrics.totalEarnings - metrics.totalSpending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Financial Summary</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Lifetime Value */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Lifetime Value
            </p>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-white">
            ${ltv.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-600">
            {metrics.totalEarnings > metrics.totalSpending ? "+" : "-"}
            {Math.abs(netBalance).toFixed(2)}
          </p>
        </div>

        {/* Current Balance */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Wallet Balance
            </p>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-white">
            ${metrics.currentBalance.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-600">
            {metrics.pendingPayouts.toFixed(2)} pending
          </p>
        </div>

        {/* Monthly Earnings */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              This Month
            </p>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">
            ${metrics.monthlyEarnings.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-600">
            Earned vs ${metrics.monthlySpending} spent
          </p>
        </div>

        {/* Total Transactions */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Total Spent
            </p>
            <CreditCard className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-white">
            ${metrics.totalSpending.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-600">
            All-time spending
          </p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
        <p className="text-sm font-bold text-white">Revenue Breakdown</p>
        <div className="space-y-2">
          {/* Earnings Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Earnings</span>
              <span className="font-bold text-emerald-500">
                ${metrics.totalEarnings.toFixed(2)}
              </span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${(metrics.totalEarnings / (metrics.totalEarnings + metrics.totalSpending)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Spending Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Spending</span>
              <span className="font-bold text-rose-500">
                ${metrics.totalSpending.toFixed(2)}
              </span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{
                  width: `${(metrics.totalSpending / (metrics.totalEarnings + metrics.totalSpending)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-white">Recent Transactions</p>
        <div className="space-y-2">
          {metrics.transactions.slice(0, 5).map((transaction) => {
            const config =
              transactionConfig[
                transaction.type as keyof typeof transactionConfig
              ];
            const TxIcon = config.icon;

            return (
              <div
                key={transaction.id}
                className="glass-card rounded-lg border-white/10 p-3 flex items-center justify-between hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn("p-2 rounded-lg", config.color)}>
                    <TxIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {transaction.description}
                    </p>
                    <p className="text-[10px] text-zinc-600">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-sm font-black whitespace-nowrap flex-shrink-0",
                    config.textColor
                  )}
                >
                  {transaction.type === "earning" ||
                  transaction.type === "refund"
                    ? "+"
                    : "-"}
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-white/5">
        <button className="flex-1 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-bold transition-all">
          Request Payout
        </button>
        <button className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 text-sm font-bold transition-all">
          View History
        </button>
      </div>
    </div>
  );
}
