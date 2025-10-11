"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomerList from "@/components/customers/CustomerList";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { CustomerWithBalance } from "@/types/customers";
import CustomSearchInput from "~/CustomSearchInput";

const CustomersPage = () => {
	const router = useRouter();
	const supabase = createClient();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: customersData, isLoading: customersLoading } = useQuery({
		queryKey: [QueryKeys.CustomersList],
		queryFn: async () => {
			const { data, error } = await supabase
				.from(Tables.Customers)
				.select("*")
				.order("createdAt", { ascending: false });

			if (error) throw error;
			return data || [];
		},
	});

	const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
		queryKey: [QueryKeys.CustomersTransactions],
		queryFn: async () => {
			const { data, error } = await supabase
				.from(Tables.Transactions)
				.select("*");

			if (error) throw error;
			return data || [];
		},
	});

	const customers = customersData?.map((customer) => {
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
	}) as CustomerWithBalance[] || [];

	const isLoading = customersLoading || transactionsLoading;

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
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchQuery(e.target.value)
						}
						className="w-full"
					/>
				</div>
			</div>

			<div className="p-3 md:p-6">
				<CustomerList
					customers={customers}
					isLoading={isLoading}
					searchQuery={searchQuery}
				/>
			</div>
		</div>
	);
};

export default CustomersPage;
