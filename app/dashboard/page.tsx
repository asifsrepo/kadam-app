"use client";

import { useQuery } from "@tanstack/react-query";
import { Customers } from "@/components/dashboard/Customers";
import { Stats } from "@/components/dashboard/Stats";
import { Transactions } from "@/components/dashboard/Transactions";
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
					.filter((t: { type: string; }) => t.type === "credit")
					.reduce((sum: number, t: { amount: number; }) => sum + t.amount, 0);

				const totalPaid = transactions
					.filter((t: { type: string; }) => t.type === "payment")
					.reduce((sum: number, t: { amount: number; }) => sum + t.amount, 0);

				return {
					...customer,
					balance: totalCredit - totalPaid,
				};
			});

			return customersWithBalance as CustomerWithBalance[];
		},
		enabled: !!activeBranch?.id,
	});

	// Calculate stats from all customers (we need separate query for accurate stats)
	const { data: allCustomersStats, isLoading: statsLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, "stats"],
		queryFn: async () => {
			if (!activeBranch?.id) return { totalCustomers: 0, totalDebt: 0, totalCredit: 0, netBalance: 0 };

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
					.filter((t: { type: string; }) => t.type === "credit")
					.reduce((sum: number, t: { amount: number; }) => sum + t.amount, 0);

				const totalPaid = transactions
					.filter((t: { type: string; }) => t.type === "payment")
					.reduce((sum: number, t: { amount: number; }) => sum + t.amount, 0);

				return {
					...customer,
					balance: totalCredit - totalPaid,
				};
			});

			const totalCustomers = customersWithBalance.length;
			const totalDebt = customersWithBalance.reduce((sum, customer) => sum + Math.max(0, customer.balance), 0);
			const totalCredit = customersWithBalance.reduce((sum, customer) => sum + Math.max(0, -customer.balance), 0);
			const netBalance = totalDebt - totalCredit;

			return { totalCustomers, totalDebt, totalCredit, netBalance };
		},
		enabled: !!activeBranch?.id,
	});

	const recentCustomers = customers || [];

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-4 py-4 md:px-6 md:py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold text-2xl text-foreground md:text-3xl">
								Dashboard
							</h1>
							<p className="text-muted-foreground text-sm md:text-base">
								Overview of your business
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="p-4 md:p-6">
				<Stats
					totalCustomers={allCustomersStats?.totalCustomers || 0}
					totalDebt={allCustomersStats?.totalDebt || 0}
					totalCredit={allCustomersStats?.totalCredit || 0}
					netBalance={allCustomersStats?.netBalance || 0}
					isLoading={statsLoading}
				/>

				<Customers
					customers={recentCustomers}
					isLoading={customersLoading}
				/>

				<Transactions />
			</div>
		</div>
	);
};

export default Dashboard;