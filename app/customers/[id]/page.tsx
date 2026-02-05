"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Phone, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import EditCustomerDialog from "@/components/customers/EditCustomerDialog";
import RemindCustomerButton from "@/components/customers/RemindCustomerButton";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import TransactionListing from "@/components/transactions/TransactionListing";
import TransactionsSkeleton from "@/components/transactions/TransactionsSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrency from "@/hooks/store/useCurrency";
import { useCustomerTransactions } from "@/hooks/useTransactions";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { ICustomer } from "@/types/customers";

const CustomerDetailsPage = () => {
	const router = useRouter();
	const params = useParams();
	const customerId = params.id as string;
	const supabase = createClient();
	const { formatAmountWithCode } = useCurrency();

	const {
		data: customer,
		isLoading,
		error,
	} = useQuery({
		queryKey: [QueryKeys.CustomerDetails, customerId],
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

	const { data: transactions } = useCustomerTransactions(customerId);

	const totalDebt =
		transactions?.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) ||
		0;
	const totalPaid =
		transactions?.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0) ||
		0;
	const balance = totalDebt - totalPaid;

	if (error) {
		toast.error("Failed to load customer details");
	}

	if (isLoading) {
		return <CustomerDetailsSkeleton />;
	}

	if (!customer) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<h2 className="mb-2 font-semibold text-foreground text-xl">Customer not found</h2>
				<Button onClick={() => router.back()} variant="outline">
					Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="flex items-center justify-between gap-3 px-4 py-4">
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.back()}
							className="h-10 w-10"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div className="min-w-0 flex-1">
							<p className="text-muted-foreground text-xs">Customer</p>
							<h1 className="truncate font-semibold text-lg">{customer.name}</h1>
						</div>
					</div>
					<TransactionDialog
						trigger={
							<Button
								variant="default"
								size="icon"
								className="h-11 w-11"
								aria-label="Add credit transaction"
							>
								<Plus className="h-5 w-5" />
								<span className="sr-only">Add credit transaction</span>
							</Button>
						}
						defaultCustomer={customer}
					/>
				</div>
			</div>

			<div className="space-y-4 px-4 py-5">
				<Card className="border-border/60">
					<CardContent className="space-y-4 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-xs">Current Balance</p>
								<p
									className={`font-semibold text-2xl ${
										balance > 0
											? "text-destructive"
											: balance < 0
												? "text-primary"
												: "text-foreground"
									}`}
								>
									{formatAmountWithCode(Math.abs(balance || 0))}
								</p>
								<p className="text-muted-foreground text-xs">
									{balance > 0
										? "Customer owes you"
										: balance < 0
											? "You owe customer"
											: "Settled"}
								</p>
							</div>
							<Badge
								variant={customer.status === "active" ? "default" : "secondary"}
								className="h-6 text-[10px]"
							>
								{customer.status}
							</Badge>
						</div>

						<div className="grid grid-cols-3 gap-2">
							<TransactionDialog
								defaultCustomer={customer}
								trigger={
									<Button variant="tonal" className="w-full">
										<Plus className="h-4 w-4" />
										Add
									</Button>
								}
							/>
							<Button variant="outline" className="w-full" asChild>
								<a href={`tel:${customer.phone}`}>
									<Phone className="h-4 w-4" />
									Call
								</a>
							</Button>
							<RemindCustomerButton customer={customer} balance={balance} />
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardContent className="space-y-2 p-4">
						<div className="flex justify-between border-border/60 border-b pb-2">
							<span className="text-muted-foreground text-xs">Phone</span>
							<span className="font-medium text-foreground text-xs">
								{customer.phone || "N/A"}
							</span>
						</div>
						<div className="flex justify-between border-border/60 border-b pb-2">
							<span className="text-muted-foreground text-xs">Email</span>
							<span className="truncate pl-2 font-medium text-foreground text-xs">
								{customer.email || "N/A"}
							</span>
						</div>
						<div className="flex justify-between border-border/60 border-b pb-2">
							<span className="text-muted-foreground text-xs">ID Number</span>
							<span className="font-medium text-foreground text-xs">
								{customer.idNumber || "N/A"}
							</span>
						</div>
						<div className="flex justify-between border-border/60 border-b pb-2">
							<span className="text-muted-foreground text-xs">Credit Limit</span>
							<span className="font-medium text-foreground text-xs">
								{formatAmountWithCode(customer.limit || 0)}
							</span>
						</div>
						<div className="pt-1">
							<span className="mb-1 block text-muted-foreground text-xs">Address</span>
							<p className="text-foreground text-xs">{customer.address || "N/A"}</p>
						</div>
						<div className="pt-2">
							<EditCustomerDialog
								customer={customer}
								trigger={
									<Button variant="outline" size="sm" className="w-full gap-2">
										<Pencil className="h-4 w-4" />
										Edit Customer Details
									</Button>
								}
							/>
						</div>
					</CardContent>
				</Card>

				<TransactionListing customerId={customer.id} />
			</div>
		</div>
	);
};

const CustomerDetailsSkeleton = () => {
	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/95">
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
							<div
								key={i}
								className="flex justify-between border-border/60 border-t pt-2"
							>
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-3 w-32" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
			<div className="space-y-3 p-3">
				<TransactionsSkeleton />
			</div>
		</div>
	);
};

export default CustomerDetailsPage;
