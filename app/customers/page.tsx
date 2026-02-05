"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CustomerFilters, {
	type CustomerFilters as CustomerFiltersType,
} from "@/components/customers/CustomerFilters";
import CustomerList from "@/components/customers/CustomerList";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/store/useStores";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { CustomerWithBalance } from "@/types/customers";
import CustomSearchInput from "~/CustomSearchInput";

const PAGE_SIZE = 10;

const CustomersPage = () => {
	const router = useRouter();
	const supabase = createClient();
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<CustomerFiltersType>({
		status: "all",
		balance: "all",
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const { activeBranch } = useStores();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, searchQuery, filters],
		queryFn: async ({ pageParam = 0 }) => {
			// First, get all customers with their transactions
			let query = supabase
				.from(Tables.Customers)
				.select("*, transactions:transactions(*)")
				.eq("branchId", activeBranch?.id);

			if (filters.status !== "all") {
				query = query.eq("status", filters.status);
			}

			if (searchQuery.trim()) {
				query = query.or(
					`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
				);
			}

			// For non-balance sorting, apply server-side sorting
			if (filters.sortBy !== "balance") {
				const ascending = filters.sortOrder === "asc";
				query = query.order(filters.sortBy, { ascending });
			}

			// Get a larger batch to account for balance filtering
			const batchSize = filters.balance !== "all" ? PAGE_SIZE * 3 : PAGE_SIZE;
			query = query.range(pageParam, pageParam + batchSize - 1);

			const { data: customers, error } = await query;

			if (error) throw error;

			// Calculate balances for all customers
			let processedCustomers = (customers ?? []).map((customer) => {
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
			}) as CustomerWithBalance[];

			// Apply balance filter
			if (filters.balance !== "all") {
				processedCustomers = processedCustomers.filter((customer) => {
					switch (filters.balance) {
						case "positive":
							return customer.balance > 0;
						case "negative":
							return customer.balance < 0;
						case "zero":
							return customer.balance === 0;
						default:
							return true;
					}
				});
			}

			// Apply sorting (including balance sorting)
			if (filters.sortBy === "balance") {
				processedCustomers.sort((a, b) => {
					const result = a.balance - b.balance;
					return filters.sortOrder === "asc" ? result : -result;
				});
			}

			// Return only the requested page size
			return processedCustomers.slice(0, PAGE_SIZE);
		},

		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			// If we got fewer results than requested, we've reached the end
			if (!lastPage || lastPage.length < PAGE_SIZE) {
				return undefined;
			}

			// For balance filtering, we need to account for the larger batch size
			const batchSize = filters.balance !== "all" ? PAGE_SIZE * 3 : PAGE_SIZE;
			return allPages.length * batchSize;
		},
		enabled: !!activeBranch?.id,
		refetchOnMount: true,
	});

	const customers = data?.pages.flat() ?? [];

	const handleSearchChange = useCallback((val: string) => {
		setSearchQuery(val);
	}, []);

	const handleFiltersChange = useCallback((newFilters: CustomerFiltersType) => {
		setFilters(newFilters);
	}, []);

	const handleClearFilters = useCallback(() => {
		setFilters({
			status: "all",
			balance: "all",
			sortBy: "createdAt",
			sortOrder: "desc",
		});
	}, []);

	const hasActiveFilters =
		filters.status !== "all" ||
		filters.balance !== "all" ||
		filters.sortBy !== "createdAt" ||
		filters.sortOrder !== "desc";

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="px-4 py-4 md:px-6">
					<div className="mb-3 flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.back()}
							className="h-10 w-10"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Go back</span>
						</Button>
						<div>
							<p className="text-muted-foreground text-xs">All Customers</p>
							<h1 className="font-semibold text-xl">Customers</h1>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<CustomSearchInput
							placeholder="Search customers..."
							value={searchQuery}
							onSearch={handleSearchChange}
							className="flex-1"
						/>
						<div className="shrink-0">
							<CustomerFilters
								filters={filters}
								onFiltersChange={handleFiltersChange}
								onClearFilters={handleClearFilters}
								hasActiveFilters={hasActiveFilters}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 py-5 md:px-6">
				<CustomerList
					customers={customers}
					isLoading={isLoading || !activeBranch}
					fetchNextPage={fetchNextPage}
					hasNextPage={!!hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			</div>
		</div>
	);
};

export default CustomersPage;
