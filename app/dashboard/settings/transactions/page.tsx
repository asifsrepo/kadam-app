"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TransactionCard from "@/components/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useStores from "@/hooks/store/useStores";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { ITransactionWithCustomer } from "@/types/transaction";
import CustomSearchInput from "~/CustomSearchInput";
import { toast } from "sonner";

const TransactionsPage = () => {
    const router = useRouter();
    const { activeBranch } = useStores();
    const supabase = createClient();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: transactionsData, isLoading } = useQuery({
        queryKey: [QueryKeys.TransactionsList,],
        queryFn: async () => {
            if (!activeBranch?.id) return [];

            const { data: transactions, error: transactionsError } = await supabase
                .from(Tables.Transactions)
                .select(`
                    *,
                    customer:customerId (
                        id,
                        name,
                        phone,
                        email
                    )
                `)
                .eq("branchId", activeBranch.id)
                .order("createdAt", { ascending: false });

            if (transactionsError) throw transactionsError;

            return transactions as ITransactionWithCustomer[];
        },
        enabled: !!activeBranch?.id,
    });

    const filteredTransactions = transactionsData?.filter((transaction) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            transaction.customer.name.toLowerCase().includes(query) ||
            transaction.customer.phone.toLowerCase().includes(query) ||
            transaction.notes.toLowerCase().includes(query)
        );
    }) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-24">
                <div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="px-3 py-3 md:px-6 md:py-4">
                        <div className="mb-2 flex items-center gap-3 md:mb-3">
                            <div className="h-8 w-8 animate-pulse rounded bg-muted md:h-9 md:w-9" />
                            <div className="h-6 w-32 animate-pulse rounded bg-muted md:h-8" />
                        </div>
                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                    </div>
                </div>
                <div className="space-y-2 p-3 md:space-y-3 md:p-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded bg-muted md:h-20" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-3 py-3 md:px-6 md:py-4">
                    <div className="mb-2 flex items-center gap-3 md:mb-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="h-8 w-8 md:h-9 md:w-9"
                        >
                            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="sr-only">Go back</span>
                        </Button>
                        <h1 className="font-semibold text-lg md:text-2xl">All Transactions</h1>
                    </div>
                    <div className="flex w-full items-center gap-2">
                        <CustomSearchInput
                            placeholder="Search by customer name, phone, or notes..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchQuery(e.target.value)
                            }
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={() => {
                                // TODO: Add filter logic
                                toast.warning("Filter clicked");
                            }}
                        >
                            <Filter className="h-4 w-4" />
                            <span className="sr-only">Filter transactions</span>
                        </Button>
                        <Button
                            variant={"outline"}
                            className="h-10 w-10 shrink-0"
                            onClick={() => {
                                // TODO: Add create transaction logic
                                toast.warning("Create transaction clicked");
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Create new transaction</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2 p-3 md:space-y-3 md:p-6">
                {filteredTransactions.length === 0 ? (
                    <Card>
                        <CardContent className="p-4 text-center md:p-6">
                            <p className="text-muted-foreground text-sm">
                                {searchQuery ? "No transactions found matching your search" : "No transactions yet"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2 md:space-y-3">
                        {filteredTransactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default TransactionsPage;