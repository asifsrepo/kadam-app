"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { ICustomer } from "@/types/customers";

const CustomerDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id as string;
    const supabase = createClient();

    const {
        data: customer,
        isLoading,
        error,
    } = useQuery({
        queryKey: [Tables.Customers, customerId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(Tables.Customers)
                .select("*")
                .eq("id", customerId)
                .single();

            if (error) throw error;
            return data as ICustomer;
        },
        enabled: !!customerId,
    });

    if (error) {
        toast.error("Failed to load customer details");
    }

    if (isLoading) {
        return <CustomerDetailsSkeleton />;
    }

    if (!customer) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <h2 className="mb-2 font-semibold text-foreground text-xl">
                    Customer not found
                </h2>
                <Button onClick={() => router.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="h-8 w-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="min-w-0 flex-1">
                            <h1 className="truncate font-semibold text-base">
                                {customer.name}
                            </h1>
                        </div>
                    </div>
                    <Button size="sm" className="h-8 shrink-0 text-xs" asChild>
                        <Link href={`/dashboard/customers/${customer.id}/transactions/new`}>
                            <Plus className="mr-1 h-3 w-3" />
                            Add
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-3 p-3">
                <Card>
                    <CardContent className="space-y-2 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs">Status</span>
                            <Badge
                                variant={customer.status === "active" ? "default" : "secondary"}
                                className="h-5 text-[10px]"
                            >
                                {customer.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between border-border border-t pt-2">
                            <span className="text-muted-foreground text-xs">Phone</span>
                            <span className="font-medium text-foreground text-xs">
                                {customer.phone}
                            </span>
                        </div>
                        <div className="flex justify-between border-border border-t pt-2">
                            <span className="text-muted-foreground text-xs">Email</span>
                            <span className="truncate pl-2 font-medium text-foreground text-xs">
                                {customer.email}
                            </span>
                        </div>
                        <div className="flex justify-between border-border border-t pt-2">
                            <span className="text-muted-foreground text-xs">ID Number</span>
                            <span className="font-medium text-foreground text-xs">
                                {customer.idNumber}
                            </span>
                        </div>
                        <div className="flex justify-between border-border border-t pt-2">
                            <span className="text-muted-foreground text-xs">Credit Limit</span>
                            <span className="font-medium text-foreground text-xs">
                                ${customer.limit?.toFixed(2) || "0.00"}
                            </span>
                        </div>
                        <div className="border-border border-t pt-2">
                            <span className="mb-1 block text-muted-foreground text-xs">
                                Address
                            </span>
                            <p className="text-foreground text-xs">{customer.address}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3">
                        <h3 className="mb-2 font-medium text-foreground text-sm">Transactions</h3>
                        <div className="flex min-h-[120px] items-center justify-center">
                            <p className="text-center text-muted-foreground text-xs">
                                Transaction listing will be added here
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const CustomerDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-10 border-border border-b bg-background/95">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            <div className="space-y-3 p-3">
                <Card>
                    <CardContent className="space-y-2 p-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex justify-between border-border border-t pt-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CustomerDetailsPage;

