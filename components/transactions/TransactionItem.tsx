"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrency from "@/hooks/store/useCurrency";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { ITransaction } from "@/types/transaction";

interface TransactionItemProps {
	transaction: ITransaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
	const supabase = createClient();
	const { formatAmountWithCode } = useCurrency();

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
		enabled: !!transaction?.createdBy,
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
						<div className="flex items-center gap-1 text-[10px] text-muted-foreground">
							<Calendar className="h-3 w-3" />
							<span>{formattedDate}</span>
						</div>
						{transaction.notes && (
							<p className="text-[10px] text-muted-foreground">{transaction.notes}</p>
						)}
					</div>
					<div className="shrink-0 text-right">
						<p
							className={`font-bold text-base ${
								isCredit ? "text-destructive" : "text-primary"
							}`}
						>
							{isCredit ? "+" : "-"}
							{formatAmountWithCode(transaction.amount)}
						</p>
					</div>
				</div>

				<div className="mt-2 space-y-1 border-border border-t pt-2">
					<div className="flex items-center justify-between">
						<span className="text-[9px] text-muted-foreground">Created By</span>
						{isLoadingCreator ? (
							<Skeleton className="h-3 w-24" />
						) : (
							<span className="text-[9px] text-foreground">
								{creatorProfile?.name || creatorProfile?.email || "Unknown User"}
							</span>
						)}
					</div>
					<div className="flex items-center justify-between">
						<span className="text-[9px] text-muted-foreground">Time</span>
						<span className="text-[9px] text-foreground">
							{format(new Date(transaction.createdAt), "MMM d, h:mm a")}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionItem;
