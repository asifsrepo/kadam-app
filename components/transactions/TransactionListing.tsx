"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import BalanceSummary from "@/components/transactions/BalanceSummary";
import TransactionItem from "@/components/transactions/TransactionItem";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { ITransaction } from "@/types/transaction";
import TransactionsSkeleton from "./TransactionsSkeleton";

interface TransactionListingProps {
    customerId: string;
}

const TransactionListing = ({ customerId }: TransactionListingProps) => {
    const supabase = createClient();

    const {
        data: transactions,
        isLoading,
        error,
    } = useQuery({
        queryKey: [Tables.Transactions, customerId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(Tables.Transactions)
                .select("*")
                .eq("customerId", customerId)
                .order("createdAt", { ascending: false });

            if (error) throw error;
            return data as ITransaction[];
        },
        enabled: !!customerId,
    });

    if (error) {
        toast.error("Failed to load transactions");
    }

    if (isLoading) {
        return (
            <TransactionsSkeleton />
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <Card>
                <CardContent className="space-y-3 p-3">
                    <h3 className="font-medium text-foreground text-sm">Transactions</h3>
                    
                    <BalanceSummary transactions={[]} />
                    
                    <div className="flex min-h-[120px] items-center justify-center">
                        <p className="text-center text-muted-foreground text-xs">
                            No transactions yet
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="space-y-3 p-3">
                <h3 className="font-medium text-foreground text-sm">Transactions</h3>

                <BalanceSummary transactions={transactions} />

                <div className="space-y-2">
                    {transactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionListing;