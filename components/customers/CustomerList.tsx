"use client";

import { useEffect, useRef } from "react";
import CustomerCard from "@/components/customers/CustomerCard";
import CustomerListSkeleton from "@/components/customers/CustomerListSkeleton";
import EmptyState from "@/components/customers/EmptyState";
import type { CustomerWithBalance } from "@/types/customers";

interface CustomerListProps {
	customers: CustomerWithBalance[];
	isLoading?: boolean;
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
}

const CustomerList = ({
	customers,
	isLoading = false,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}: CustomerListProps) => {
	const observerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!hasNextPage || isLoading) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1 }
		);
		if (observerRef.current) {
			observer.observe(observerRef.current);
		}
		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [hasNextPage, fetchNextPage, isLoading]);

	if (isLoading) {
		return <CustomerListSkeleton />;
	}

	if (customers.length === 0) {
		return <EmptyState hasSearch={false} />;
	}

	return (
		<>
			<div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{customers.map((customer) => (
					<CustomerCard key={customer.id} customer={customer} />
				))}
			</div>
			{hasNextPage && (
				<div ref={observerRef} className="flex min-h-[80px] w-full items-center justify-center">
					{isFetchingNextPage && <CustomerListSkeleton />}
				</div>
			)}
		</>
	);
};

export default CustomerList;
