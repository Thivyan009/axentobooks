"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { formatCurrency } from "@/lib/types/currency";
import type { Transaction } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { selectedCurrency } = useCurrencyStore();

  // Debug logging
  console.log("TransactionList received transactions:", transactions);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Debug logging
  console.log("Recent transactions after sorting:", recentTransactions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest 5 transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {!recentTransactions || recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  No transactions yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Add your first transaction using the form on the left
                </p>
              </div>
            ) : (
              recentTransactions.map((transaction) => {
                // Debug logging for each transaction
                console.log("Rendering transaction:", transaction);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.name || transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} •{" "}
                        {formatDistanceToNow(new Date(transaction.date), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        transaction.type === "expense"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(
                        Math.abs(transaction.amount),
                        selectedCurrency.code
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
