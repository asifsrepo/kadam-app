"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { ITransaction } from "@/types/transaction";

interface TransactionItemProps {
    transaction: ITransaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const supabase = createClient();
    console.log(transaction);
    

    const { data: creatorProfile, isLoading: isLoadingCreator } = useQuery({
        queryKey: [Tables.UserProfiles, transaction?.createdBy],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(Tables.UserProfiles)
                .select("name,email")
                .eq("id", transaction.createdBy)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: isExpanded && !!transaction?.createdBy,
    });

    if (!transaction) return null;

    const isCredit = transaction.type === "credit";
    const formattedDate = format(new Date(transaction.createdAt), "MMM d, yyyy");

    return (
        <div
            className={`flex items-start gap-3 rounded-lg border p-3 ${
                isCredit 
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-primary/20 bg-primary/5"
            }`}
        >
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isCredit ? "bg-destructive/10" : "bg-primary/10"
                }`}
            >
                {isCredit ? (
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                ) : (
                    <ArrowDownLeft className="h-4 w-4 text-primary" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isCredit ? "destructive" : "default"}
                                className="h-5 text-[10px]"
                            >
                                {isCredit ? "Debt" : "Payment"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{formattedDate}</span>
                        </div>
                        {!isExpanded && transaction.notes && (
                            <p className="truncate text-muted-foreground text-xs">
                                {transaction.notes}
                            </p>
                        )}
                    </div>
                    <div className="shrink-0 text-right">
                        <p
                            className={`font-bold text-base ${
                                isCredit ? "text-destructive" : "text-primary"
                            }`}
                        >
                            {isCredit ? "+" : "-"}
                            {transaction.amount.toFixed(2)}
                        </p>
                        {transaction.currency && (
                            <p className="text-[10px] text-muted-foreground">
                                {transaction.currency}
                            </p>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 space-y-3 border-border border-t pt-3">
                        {transaction.notes && (
                            <div>
                                <p className="mb-1 font-medium text-muted-foreground text-xs">
                                    Notes
                                </p>
                                <p className="text-foreground text-xs">{transaction.notes}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            {transaction.paybackDate && (
                                <div>
                                    <p className="mb-1 font-medium text-[10px] text-muted-foreground">
                                        Payback Date
                                    </p>
                                    <p className="text-foreground text-xs">
                                        {format(new Date(transaction.paybackDate), "MMM d, yyyy")}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="mb-1 font-medium text-[10px] text-muted-foreground">
                                Created By
                            </p>
                            {isLoadingCreator ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                <p className="text-foreground text-xs">
                                    {creatorProfile?.name || creatorProfile?.email || "Unknown User"}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="mb-1 font-medium text-[10px] text-muted-foreground">
                                    Created
                                </p>
                                <p className="text-foreground text-xs">
                                    {format(
                                        new Date(transaction.createdAt),
                                        "MMM d, yyyy 'at' h:mm a",
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 h-6 w-full text-[10px]"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="mr-1 h-3 w-3" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-1 h-3 w-3" />
                            Show More
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TransactionItem;

