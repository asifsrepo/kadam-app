"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
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

	const { data: customers, isLoading: customersLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id],
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

			const customersWithBalance = (customersData ?? []).map((customer) => {
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
	});

	const { data: allCustomersStats, isLoading: statsLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, "stats"],
		queryFn: async () => {
			if (!activeBranch?.id)
				return { totalCustomers: 0, totalDebt: 0, totalCredit: 0, netBalance: 0 };

			const { data: customersData, error: customersError } = await supabase
				.from(Tables.Customers)
				.select(`
					*,
					transactions:transactions(*)
				`)
				.eq("branchId", activeBranch.id);

			if (customersError) throw customersError;

			const customersWithBalance = (customersData ?? []).map((customer) => {
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

			const totalCustomers = customersWithBalance.length;
			const totalDebt = customersWithBalance.reduce(
				(sum, customer) => sum + Math.max(0, customer.balance),
				0,
			);
			const totalCredit = customersWithBalance.reduce(
				(sum, customer) => sum + Math.max(0, -customer.balance),
				0,
			);
			const netBalance = totalDebt - totalCredit;

			return { totalCustomers, totalDebt, totalCredit, netBalance };
		},
		enabled: !!activeBranch?.id,
	});

	const recentCustomers = customers || [];

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-3 py-3 md:px-6 md:py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
							<p className="text-muted-foreground text-xs md:text-sm">
								Overview of your business
							</p>
						</div>
						<TransactionDialog
							defaultType="credit"
							trigger={
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 md:h-8 md:w-8"
									aria-label="Add credit transaction"
								>
									<ShoppingCart className="h-5 w-5 md:h-4 md:w-4" />
									<span className="sr-only">Add credit transaction</span>
								</Button>
							}
						/>
					</div>
				</div>
			</div>

			<div className="p-3 md:p-6">
				<Stats
					totalCustomers={allCustomersStats?.totalCustomers || 0}
					totalDebt={allCustomersStats?.totalDebt || 0}
					totalCredit={allCustomersStats?.totalCredit || 0}
					netBalance={allCustomersStats?.netBalance || 0}
					isLoading={statsLoading}
				/>

				<Customers customers={recentCustomers} isLoading={customersLoading} />

				<Transactions />
			</div>
		</div>
	);
};

export default Dashboard;
