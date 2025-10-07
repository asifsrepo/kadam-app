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

	const { data: customers, isLoading } = useQuery({
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

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
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
					customers={customers || []}
					isLoading={isLoading}
					searchQuery={searchQuery}
				/>
			</div>
		</div>
	);
};

export default CustomersPage;
