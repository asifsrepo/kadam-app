"use client";

import { Phone, User } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import usePaginationState from "@/hooks/pagination/usePaginationState";
import type { ICustomer } from "@/types/customers";
import CustomPagination from "~/CustomPagination";

interface CustomerListProps {
    customers: ICustomer[];
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
                customer.country.toLowerCase().includes(query),
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

const CustomerCard = ({ customer }: { customer: ICustomer }) => {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-foreground text-sm">
                            {customer.name}
                        </h3>
                    </div>
                    <Badge
                        variant={customer.status === "active" ? "default" : "secondary"}
                        className="h-5 shrink-0 text-[10px]"
                    >
                        {customer.status}
                    </Badge>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground">{customer.phone}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CustomerListSkeleton = () => {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                    <CardContent className="p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <Skeleton className="h-5 w-14 shrink-0" />
                        </div>
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 font-semibold text-foreground text-xl">
                {hasSearch ? "No customers found" : "No customers yet"}
            </h2>
            <p className="mb-6 max-w-md text-muted-foreground">
                {hasSearch
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "Get started by adding your first customer using the button below."}
            </p>
            {!hasSearch && (
                <div className="text-muted-foreground text-sm">
                    Click the <strong className="text-foreground">+</strong> button at the bottom
                    right to add a customer
                </div>
            )}
        </div>
    );
};

export default CustomerList;

