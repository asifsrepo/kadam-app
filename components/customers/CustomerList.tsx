"use client";

import { useMemo } from "react";
import CustomerCard from "@/components/customers/CustomerCard";
import CustomerListSkeleton from "@/components/customers/CustomerListSkeleton";
import EmptyState from "@/components/customers/EmptyState";
import usePaginationState from "@/hooks/pagination/usePaginationState";
import { CustomerWithBalance } from "@/types/customers";
import CustomPagination from "~/CustomPagination";

interface CustomerListProps {
	customers: CustomerWithBalance[];
	isLoading?: boolean;
	searchQuery?: string;
}

const CustomerList = ({ customers, isLoading = false, searchQuery = "" }: CustomerListProps) => {
	const { currentPage, pageSize } = usePaginationState({
		defaultPageSize: 16,
	});

	const filteredCustomers = useMemo(() => {
		if (!customers) return [];
		if (!searchQuery.trim()) return customers;

		const query = searchQuery.toLowerCase();
		return customers.filter(
			(customer) =>
				customer.name.toLowerCase().includes(query) ||
				customer.email.toLowerCase().includes(query) ||
				customer.phone.toLowerCase().includes(query) ||
				customer.address.toLowerCase().includes(query),
		);
	}, [customers, searchQuery]);

	const paginatedCustomers = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return filteredCustomers.slice(startIndex, endIndex);
	}, [filteredCustomers, currentPage, pageSize]);

	const totalPages = Math.ceil((filteredCustomers?.length || 0) / pageSize);

	if (isLoading) {
		return <CustomerListSkeleton />;
	}

	if (paginatedCustomers.length === 0) {
		return <EmptyState hasSearch={!!searchQuery.trim()} />;
	}

	return (
		<>
			<div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{paginatedCustomers.map((customer) => (
					<CustomerCard key={customer.id} customer={customer} />
				))}
			</div>

			{totalPages > 1 && (
				<div className="mt-6">
					<CustomPagination
						totalPages={totalPages}
						showPageInfo={true}
						showPageSizeSelector={true}
					/>
				</div>
			)}
		</>
	);
};

export default CustomerList;
