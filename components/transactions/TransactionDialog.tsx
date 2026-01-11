"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { InfiniteData } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import TransactionTypeSelector from "@/components/transactions/TransactionTypeSelector";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/store/useAuth";
import useStores from "@/hooks/store/useStores";
import type { TransactionFormData } from "@/lib/schema/transaction";
import { transactionSchema } from "@/lib/schema/transaction";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { QueryKeys, Tables } from "@/types";
import type { CustomerWithBalance, ICustomer } from "@/types/customers";
import type { ITransaction, ITransactionWithCustomer } from "@/types/transaction";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

interface TransactionDialogProps {
	defaultCustomer?: ICustomer;
	trigger?: ReactNode;
}

const TransactionDialog = ({ defaultCustomer, trigger }: TransactionDialogProps) => {
	const [open, setOpen] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
		defaultCustomer || null,
	);
	const formId = useId();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const supabase = createClient();
	const { user } = useAuth();
	const { activeBranch } = useStores();
	const queryClient = useQueryClient();

	const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
		queryKey: [QueryKeys.CustomersList, activeBranch?.id],
		queryFn: async () => {
			if (!activeBranch?.id) return [];
			const { data, error } = await supabase
				.from(Tables.Customers)
				.select("id,name,phone,limit")
				.eq("branchId", activeBranch.id)
				.eq("status", "active")
				.order("name");

			if (error) throw error;
			return data as ICustomer[];
		},
		enabled: !!activeBranch?.id && !defaultCustomer,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		setError,
		reset,
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			type: "credit",
		},
	});

	const watchedAmount = watch("amount");
	const watchedType = watch("type");

	// Always sync selectedCustomer with defaultCustomer when it changes
	useEffect(() => {
		if (defaultCustomer) {
			setSelectedCustomer(defaultCustomer);
		}
	}, [defaultCustomer]);

	// When dialog opens, ensure we have the latest customer data
	useEffect(() => {
		if (open && defaultCustomer) {
			setSelectedCustomer(defaultCustomer);
		}
	}, [open, defaultCustomer]);

	useEffect(() => {
		if (!selectedCustomer?.limit || watchedType !== "credit") return;
		if (watchedAmount > selectedCustomer?.limit) {
			setError("amount", {
				message: "Amount cannot be greater than credit limit",
			});
		} else {
			setError("amount", {
				message: undefined,
			});
		}
	}, [watchedAmount, watchedType, selectedCustomer, setError]);

	const onSubmit = async (data: TransactionFormData) => {
		if (!user?.id) {
			toast.error("You must be logged in to create a transaction");
			return;
		}

		if (!selectedCustomer) {
			toast.error("Please select a customer");
			return;
		}

		setIsSubmitting(true);
		try {
			const newTransaction: ITransaction = {
				customerId: selectedCustomer.id,
				amount: data.amount,
				type: data.type,
				notes: data.notes || "",
				createdAt: new Date().toISOString(),
				createdBy: user.id,
				branchId: activeBranch?.id,
			} as ITransaction;

			const { error, data: insertedData } = await supabase
				.from(Tables.Transactions)
				.insert(newTransaction)
				.select()
				.single();

			if (error) throw error;

			const balanceChange = data.type === "credit" ? data.amount : -data.amount;

			// 1. Update dashboard "recent" customers cache
			queryClient.setQueryData<CustomerWithBalance[]>(
				[QueryKeys.CustomersList, activeBranch?.id, "recent"],
				(oldData) => {
					if (!oldData) return oldData;

					return oldData.map((customer) => {
						if (customer.id !== selectedCustomer.id) return customer;

						return {
							...customer,
							balance: customer.balance + balanceChange,
						};
					});
				},
			);

			// 2. Update dashboard "stats" cache
			queryClient.setQueryData<{
				totalCustomers: number;
				totalDebt: number;
				totalCredit: number;
				netBalance: number;
			}>([QueryKeys.CustomersList, activeBranch?.id, "stats"], (oldStats) => {
				if (!oldStats) return oldStats;

				if (data.type === "credit") {
					return {
						...oldStats,
						totalDebt: oldStats.totalDebt + data.amount,
						netBalance: oldStats.netBalance + data.amount,
					};
				}
				return {
					...oldStats,
					totalCredit: oldStats.totalCredit + data.amount,
					netBalance: oldStats.netBalance - data.amount,
				};
			});

			// 3. Update all CustomersList infinite queries (customers page with filters)
			// Get all customer list queries and update only the infinite ones
			const customerListQueries = queryClient.getQueriesData<
				InfiniteData<CustomerWithBalance[]>
			>({
				queryKey: [QueryKeys.CustomersList, activeBranch?.id],
			});

			customerListQueries.forEach(([queryKey, oldData]) => {
				// Skip if not an infinite query (check if it has pages property)
				if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) return;

				// Skip the "recent" and "stats" queries
				if (queryKey.includes("recent") || queryKey.includes("stats")) return;

				queryClient.setQueryData<InfiniteData<CustomerWithBalance[]>>(queryKey, {
					...oldData,
					pages: oldData.pages.map((page) =>
						page.map((customer) => {
							if (customer.id !== selectedCustomer.id) return customer;

							return {
								...customer,
								balance: customer.balance + balanceChange,
							};
						}),
					),
				});
			});

			// 4. Update dashboard TransactionsList infinite query
			queryClient.setQueryData<InfiniteData<ITransactionWithCustomer[]>>(
				[QueryKeys.TransactionsList, activeBranch?.id],
				(oldData) => {
					if (!oldData || !oldData.pages.length) return oldData;

					const newTransactionWithCustomer: ITransactionWithCustomer = {
						...insertedData,
						customer: {
							id: selectedCustomer.id,
							name: selectedCustomer.name,
							phone: selectedCustomer.phone,
							email: selectedCustomer.email,
						},
					} as ITransactionWithCustomer;

					return {
						...oldData,
						pages: [
							[newTransactionWithCustomer, ...oldData.pages[0]],
							...oldData.pages.slice(1),
						],
					};
				},
			);

			// 5. Update customer details TransactionsList query
			queryClient.setQueryData<ITransaction[]>(
				[QueryKeys.TransactionsList, selectedCustomer.id],
				(oldData) => {
					if (!oldData) return [insertedData as ITransaction];

					return [insertedData as ITransaction, ...oldData];
				},
			);

			toast.success("Transaction created successfully");
			setOpen(false);
			reset();
			setSelectedCustomer(null);
		} catch (error) {
			toast.error("Failed to create transaction. Please try again.");
			console.error("Error creating transaction:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			reset();
			setSelectedCustomer(defaultCustomer || null);
		}
		setOpen(newOpen);
	};

	const customerOptions = !defaultCustomer
		? customers.map((customer) => ({
				value: customer.id,
				label: `${customer.name} (${customer.phone})`,
			}))
		: [];

	const onSheetContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange} modal={true}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				side="bottom"
				className="h-[90vh] rounded-t-xl p-0"
				onClick={onSheetContentClick}
			>
				<div className="flex h-full flex-col">
					<SheetHeader className="border-border border-b px-4 py-4 text-left">
						<SheetTitle>New Transaction</SheetTitle>
						<SheetDescription>Create a new transaction for a customer</SheetDescription>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex h-full flex-col"
							id={formId}
						>
							<div className="flex-1 space-y-4 p-4">
								{!defaultCustomer && (
									<CustomSelect
										className="w-full"
										label="Select Customer"
										placeholder="Search and select a customer..."
										required
										options={customerOptions}
										value={selectedCustomer?.id || ""}
										onValueChange={(value) => {
											const customer = customers.find((c) => c.id === value);
											setSelectedCustomer(customer || null);
										}}
										error={
											!selectedCustomer
												? "Please select a customer"
												: undefined
										}
										disabled={isLoadingCustomers}
									/>
								)}

								{selectedCustomer && (
									<div className="rounded-lg border border-border bg-muted/30 p-4">
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-foreground text-sm">
													{selectedCustomer.name}
												</h3>
											</div>
											<div className="flex items-center justify-between border-border border-t pt-2">
												<span className="text-muted-foreground text-xs">
													Credit Limit
												</span>
												<span className="font-medium text-foreground text-xs">
													{formatCurrency(selectedCustomer.limit)}
												</span>
											</div>
										</div>
									</div>
								)}

								<div className="space-y-4">
									<TransactionTypeSelector
										value={watch("type")}
										onValueChange={(value: "credit" | "payment") =>
											setValue("type", value)
										}
										error={errors.type?.message}
										disabled={!selectedCustomer}
									/>

									<CustomInput
										label="Amount"
										type="number"
										placeholder="0.00"
										required
										step="0.01"
										min="0.01"
										disabled={!selectedCustomer}
										error={errors.amount?.message}
										{...register("amount", { valueAsNumber: true })}
									/>

									<CustomTextArea
										label="Notes (Optional)"
										className="min-h-24"
										placeholder="Add notes about this transaction..."
										rows={4}
										disabled={!selectedCustomer}
										error={errors.notes?.message}
										{...register("notes")}
									/>
								</div>
							</div>

							{/* Bottom Action Buttons */}
							<div className="border-border border-t bg-background p-4">
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => setOpen(false)}
										disabled={isSubmitting}
										className="flex-1"
									>
										Cancel
									</Button>
									<SubmitButton
										isLoading={isSubmitting}
										disabled={isSubmitting || !selectedCustomer}
										className="flex-1"
										form={formId}
									>
										Create Transaction
									</SubmitButton>
								</div>
							</div>
						</form>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default TransactionDialog;
