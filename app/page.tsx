"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Customers from "@/components/dashboard/Customers";
import Stats from "@/components/dashboard/Stats";
import Transactions from "@/components/dashboard/Transactions";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/store/useStores";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { CustomerWithBalance } from "@/types/customers";

const Dashboard = () => {
	const supabase = createClient();
	const { activeBranch } = useStores();

	const { data: customers = [], isLoading: customersLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, "recent"],
		queryFn: async () => {
			if (!activeBranch?.id) return [];

			const { data: customersData, error: customersError } = await supabase
				.from(Tables.Customers)
				.select(`
					*,
					transactions:transactions(*)
				`)
				.eq("branchId", activeBranch.id)
				.order("createdAt", { ascending: false })
				.limit(5);

			if (customersError) throw customersError;

			const customersWithBalance = customersData.map((customer) => {
				const transactions = customer.transactions ?? [];

				const totalCredit = transactions
					.filter((t: { type: string }) => t.type === "credit")
					.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

				const totalPaid = transactions
					.filter((t: { type: string }) => t.type === "payment")
					.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

				return {
					...customer,
					balance: totalCredit - totalPaid,
				};
			});

			return customersWithBalance as CustomerWithBalance[];
		},
		enabled: !!activeBranch?.id,
		refetchOnMount: true,
	});

	const { data: monthlyStats, isLoading: statsLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, "monthly-stats"],
		queryFn: async () => {
			if (!activeBranch?.id) return { currentMonthCredit: 0, previousMonthCredit: 0 };

			// Get current date info
			const now = new Date();
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth();

			// Calculate date ranges
			const currentMonthStart = new Date(currentYear, currentMonth, 1);
			const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
			const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
			const previousMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

			// Fetch all transactions for the branch
			const { data: transactionsData, error: transactionsError } = await supabase
				.from(Tables.Transactions)
				.select("*")
				.eq("branchId", activeBranch.id)
				.eq("type", "credit")
				.gte("createdAt", previousMonthStart.toISOString())
				.lte("createdAt", currentMonthEnd.toISOString());

			if (transactionsError) throw transactionsError;

			// Calculate current month credit
			const currentMonthCredit = (transactionsData ?? [])
				.filter((t: { createdAt: string }) => {
					const date = new Date(t.createdAt);
					return date >= currentMonthStart && date <= currentMonthEnd;
				})
				.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

			// Calculate previous month credit
			const previousMonthCredit = (transactionsData ?? [])
				.filter((t: { createdAt: string }) => {
					const date = new Date(t.createdAt);
					return date >= previousMonthStart && date <= previousMonthEnd;
				})
				.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

			return { currentMonthCredit, previousMonthCredit };
		},
		enabled: !!activeBranch?.id,
		refetchOnMount: true,
	});

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="px-3 py-3 md:px-6 md:py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
							<p className="text-muted-foreground text-xs md:text-sm">
								Overview of your business
							</p>
						</div>
						<TransactionDialog
							trigger={
								<Button
									variant="default"
									size="icon"
									className="h-10 w-10 md:h-8 md:w-8"
									aria-label="Add credit transaction"
								>
									<Plus className="h-5 w-5 md:h-4 md:w-4" />
									<span className="sr-only">Add credit transaction</span>
								</Button>
							}
						/>
					</div>
				</div>
			</div>

			<div className="p-3 md:p-6">
				<Stats
					currentMonthCredit={monthlyStats?.currentMonthCredit || 0}
					previousMonthCredit={monthlyStats?.previousMonthCredit || 0}
					isLoading={statsLoading || !activeBranch}
				/>

				<Customers customers={customers} isLoading={customersLoading || !activeBranch} />

				<Transactions />
			</div>
		</div>
	);
};

export default Dashboard;
