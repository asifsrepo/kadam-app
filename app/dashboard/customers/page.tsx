"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
	const { activeBranch } = useStores();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id, searchQuery],
		queryFn: async ({ pageParam = 0 }) => {
			const { data: customers, error } = await supabase
				.from(Tables.Customers)
				.select("*, transactions:transactions(*)")
				.eq("branchId", activeBranch?.id)
				.order("createdAt", { ascending: false })
				.range(pageParam, pageParam + PAGE_SIZE - 1);

			if (error) throw error;

			return (customers ?? []).map((customer) => {
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
			}) as CustomerWithBalance[];
		},

		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage?.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
		enabled: !!activeBranch?.id,
	});

	const customers = data?.pages.flat() ?? [];

	const handleSearchChange = useCallback((val: string) => {
		setSearchQuery(val);
	}, []);

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
						<h1 className="font-semibold text-lg md:text-2xl">Customers</h1>
					</div>
					<CustomSearchInput
						placeholder="Search customers..."
						value={searchQuery}
						onSearch={handleSearchChange}
						className="w-full"
					/>
				</div>
			</div>

			<div className="p-3 md:p-6">
				<CustomerList
					customers={customers}
					isLoading={isLoading}
					fetchNextPage={fetchNextPage}
					hasNextPage={!!hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			</div>
		</div>
	);
};

export default CustomersPage;
