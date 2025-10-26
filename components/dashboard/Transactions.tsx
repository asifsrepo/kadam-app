import { useInfiniteQuery } from "@tanstack/react-query";
import { CreditCard, Phone } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useStores from "@/hooks/store/useStores";
import { createClient } from "@/lib/supabase/client";
import { getDateLabel } from "@/lib/utils";
import { QueryKeys, Tables } from "@/types";
import type { ITransactionWithCustomer } from "@/types/transaction";

const PAGE_SIZE = 10;

const Transactions = () => {
	const { activeBranch } = useStores();
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: [QueryKeys.TransactionsList, activeBranch?.id],
		queryFn: async ({ pageParam = 0 }) => {
			if (!activeBranch?.id) return [];
			const supabase = createClient();

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
				.order("createdAt", { ascending: false })
				.range(pageParam, pageParam + PAGE_SIZE - 1);

			if (transactionsError) throw transactionsError;

			return transactions as ITransactionWithCustomer[];
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage?.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
		enabled: !!activeBranch?.id,
	});

	const transactions = data?.pages.flat() ?? [];

	const groupedTransactions = transactions.reduce(
		(groups, transaction) => {
			const dateLabel = getDateLabel(transaction.createdAt);

			if (!groups[dateLabel]) {
				groups[dateLabel] = [];
			}
			groups[dateLabel].push(transaction);
			return groups;
		},
		{} as Record<string, ITransactionWithCustomer[]>,
	);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	useEffect(() => {
		const element = loadMoreRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});
		observer.observe(element);

		return () => observer.unobserve(element);
	}, [handleObserver]);

	return (
		<div className="mb-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-foreground text-lg">Transactions</h2>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i}>
							<div className="mb-2 h-4 w-20 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								{Array.from({ length: 2 }).map((_, j) => (
									<div key={j} className="flex items-center gap-3">
										<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
										<div className="flex-1 space-y-1">
											<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
											<div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
										</div>
										<div className="h-4 w-16 animate-pulse rounded bg-muted" />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : transactions.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-8">
						<CreditCard className="mb-2 h-8 w-8 text-muted-foreground" />
						<h3 className="mb-1 font-medium text-foreground">No Transactions</h3>
						<p className="text-center text-muted-foreground text-sm">
							No recent transactions found
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
						<div key={date}>
							<h3 className="mb-2 font-medium text-muted-foreground text-sm">
								{date}
							</h3>
							<div className="space-y-2">
								{dayTransactions.map((transaction) => (
									<Card
										className="transition-shadow hover:shadow-md"
										key={transaction.id}
									>
										<CardContent className="p-3">
											<div className="flex items-center gap-3">
												<div
													className={`h-2 w-2 shrink-0 rounded-full ${transaction.type === "credit" ? "bg-destructive" : "bg-primary"}`}
												/>
												<div className="min-w-0 flex-1">
													<Link
														href={`/customers/${transaction.customer.id}`}
													>
														<h4 className="truncate font-medium text-foreground text-sm">
															{transaction.customer.name}
														</h4>
														<div className="flex items-center gap-1 text-muted-foreground text-xs">
															<Phone className="h-3 w-3" />
															<span className="truncate">
																{transaction.customer.phone}
															</span>
														</div>
													</Link>
												</div>
												<div className="shrink-0 text-right">
													<p
														className={`font-bold text-sm ${transaction.type === "credit" ? "text-destructive" : "text-primary"}`}
													>
														{transaction.amount.toFixed(2)}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					))}

					{hasNextPage && (
						<div ref={loadMoreRef} className="flex justify-center py-4">
							{isFetchingNextPage ? (
								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
									Loading more transactions...
								</div>
							) : (
								<div className="h-4" />
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Transactions;
