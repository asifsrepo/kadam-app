"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Eye,
	Plus,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import CustomerCard from "@/components/customers/CustomerCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { CustomerWithBalance } from "@/types/customers";

const Dashboard = () => {
	const supabase = createClient();

	const { data: customers, isLoading: customersLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList],
		queryFn: async () => {
			const { data: customersData, error: customersError } = await supabase
				.from(Tables.Customers)
				.select("*")
				.order("createdAt", { ascending: false });

			if (customersError) throw customersError;

			const { data: transactionsData, error: transactionsError } = await supabase
				.from(Tables.Transactions)
				.select("*");

			if (transactionsError) throw transactionsError;

			const customersWithBalance = customersData.map((customer) => {
				const customerTransactions =
					transactionsData?.filter((t) => t.customerId === customer.id) || [];

				const totalDebt =
					customerTransactions
						.filter((t) => t.type === "credit")
						.reduce((sum, t) => sum + t.amount, 0) || 0;

				const totalPaid =
					customerTransactions
						.filter((t) => t.type === "payment")
						.reduce((sum, t) => sum + t.amount, 0) || 0;

				const balance = totalDebt - totalPaid;

				return {
					...customer,
					balance,
				};
			});

			return customersWithBalance as CustomerWithBalance[];
		},
	});

	// Calculate stats
	const totalCustomers = customers?.length || 0;
	const totalDebt =
		customers?.reduce((sum, customer) => sum + Math.max(0, customer.balance), 0) || 0;
	const totalCredit =
		customers?.reduce((sum, customer) => sum + Math.max(0, -customer.balance), 0) || 0;
	const recentCustomers = customers?.slice(0, 10) || [];

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
				{/* Stats Cards - Mobile Optimized */}
				<div className="mb-6 space-y-3">
					{/* First Row - 2 cards on mobile */}
					<div className="grid grid-cols-2 gap-3">
						<Card className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
										Customers
									</p>
									<p className="font-bold text-foreground text-lg">
										{totalCustomers}
									</p>
								</div>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<Users className="h-4 w-4 text-primary" />
								</div>
							</div>
						</Card>

						<Card className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
										Net Balance
									</p>
									<p
										className={`font-bold text-lg ${totalDebt - totalCredit > 0
												? "text-destructive"
												: "text-primary"
											}`}
									>
										${(totalDebt - totalCredit).toFixed(2)}
									</p>
								</div>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
									<DollarSign className="h-4 w-4 text-muted-foreground" />
								</div>
							</div>
						</Card>
					</div>

					{/* Second Row - 2 cards on mobile */}
					<div className="grid grid-cols-2 gap-3">
						<Card className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
										Total Debt
									</p>
									<p className="font-bold text-destructive text-lg">
										${totalDebt.toFixed(2)}
									</p>
								</div>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
									<TrendingUp className="h-4 w-4 text-destructive" />
								</div>
							</div>
						</Card>

						<Card className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
										Total Credit
									</p>
									<p className="font-bold text-lg text-primary">
										${totalCredit.toFixed(2)}
									</p>
								</div>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<TrendingDown className="h-4 w-4 text-primary" />
								</div>
							</div>
						</Card>
					</div>
				</div>

				{/* Recent Customers Section */}
				<div className="mb-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-foreground text-lg">Recent Customers</h2>
						<Button variant="outline" asChild>
							<Link href="/dashboard/customers">
								<ArrowUpRight className="mr-2 h-4 w-4" />
								View All
							</Link>
						</Button>
					</div>

					{customersLoading ? (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<Card key={i}>
									<CardContent className="p-3">
										<Skeleton className="mb-2 h-4 w-3/4" />
										<Skeleton className="mb-1 h-3 w-1/2" />
										<Skeleton className="h-3 w-2/3" />
										<div className="mt-3 rounded-lg border p-2">
											<Skeleton className="mx-auto h-6 w-16" />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : recentCustomers.length > 0 ? (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{recentCustomers.map((customer) => (
								<CustomerCard key={customer.id} customer={customer} />
							))}
						</div>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-8">
								<Users className="mb-2 h-8 w-8 text-muted-foreground" />
								<h3 className="mb-1 font-medium text-foreground">
									No customers yet
								</h3>
								<p className="text-center text-muted-foreground text-sm">
									Get started by adding your first customer
								</p>
								<Button className="mt-3" asChild>
									<Link href="/dashboard/customers/new">
										<Plus className="mr-2 h-4 w-4" />
										Add Customer
									</Link>
								</Button>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Reserved Space for Future Features */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Recent Transactions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Recent Transactions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center py-8">
								<CreditCard className="mb-2 h-8 w-8 text-muted-foreground" />
								<h3 className="mb-1 font-medium text-foreground">Coming Soon</h3>
								<p className="text-center text-muted-foreground text-sm">
									Recent transactions will appear here
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Plus className="h-5 w-5" />
								Quick Actions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<Button className="w-full justify-start" asChild>
									<Link href="/dashboard/customers/new">
										<Plus className="mr-2 h-4 w-4" />
										Add New Customer
									</Link>
								</Button>
								<Button variant="outline" className="w-full justify-start" asChild>
									<Link href="/dashboard/customers">
										<Eye className="mr-2 h-4 w-4" />
										View All Customers
									</Link>
								</Button>
								<Button variant="outline" className="w-full justify-start" asChild>
									<Link href="/dashboard/settings">
										<Users className="mr-2 h-4 w-4" />
										Manage Settings
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
