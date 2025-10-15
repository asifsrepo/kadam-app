"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { ICustomer } from "@/types/customers";
import type { ITransaction } from "@/types/transaction";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const TRANSACTION_TYPES = [
	{ value: "credit", label: "Credit (Customer takes goods)" },
	{ value: "payment", label: "Payment (Customer pays back)" },
];

interface TransactionDialogProps {
	defaultType?: "credit" | "payment";
	trigger?: ReactNode;
}

const DEMO_CUSTOMER:ICustomer = {
	id: "1",
	name: "John Doe",
	address: "123 Main St",
	email: "john.doe@example.com",
	phone: "1234567890",
	status: "active",
	createdAt: new Date().toISOString(),
	createdBy: "1",
	branchId: "1",
	limit: 1000,
	idNumber: "1234567890",
}

export const TransactionDialog = ({
	defaultType = "credit",
	trigger,
}: TransactionDialogProps) => {
	const [open, setOpen] = useState(false);
	const formId = useId();
	const customer = DEMO_CUSTOMER;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const supabase = createClient();
	const { user } = useAuth();
	const { activeBranch } = useStores();
	const queryClient = useQueryClient();

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
			type: defaultType,
		},
	});

	const watchedAmount = watch("amount");
	const watchedType = watch("type");

	useEffect(() => {
		if (!customer?.limit || watchedType !== "credit") return;
		if (watchedAmount > customer?.limit) {
			setError("amount", {
				message: "Amount cannot be greater than credit limit",
			});
		} else {
			setError("amount", {
				message: undefined,
			});
		}
	}, [watchedAmount, watchedType, customer, setError]);

	const onSubmit = async (data: TransactionFormData) => {
		if (!user?.id) {
			toast.error("You must be logged in to create a transaction");
			return;
		}

		setIsSubmitting(true);
		try {
			const { error } = await supabase.from(Tables.Transactions).insert({
				customerId: customer.id,
				amount: data.amount,
				type: data.type,
				notes: data.notes || "",
				createdAt: new Date().toISOString(),
				createdBy: user.id,
				branchId: activeBranch?.id,
			} as ITransaction);

			if (error) throw error;

			toast.success("Transaction created successfully");
			setOpen(false);
			reset();

			setTimeout(async () => {
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: [QueryKeys.CustomerDetails, customer.id],
					}),
					queryClient.invalidateQueries({
						queryKey: [QueryKeys.TransactionsList],
					}),
				]);
			}, 200);
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
		}
		setOpen(newOpen);
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				side="bottom"
				className="h-[90vh] rounded-t-xl p-0"
			>
				<div className="flex h-full flex-col">
					<SheetHeader className="border-b border-border px-4 py-4 text-left">
						<SheetTitle>New Transaction</SheetTitle>
						<SheetDescription>
							Create a new transaction for {customer.name}
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex h-full flex-col"
							id={formId}
						>
							<div className="flex-1 space-y-4 p-4">
								{/* Customer Info Card */}
								<div className="rounded-lg border border-border bg-muted/30 p-4">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<h3 className="font-medium text-sm text-foreground">
												{customer.name}
											</h3>
										</div>
										<div className="flex items-center justify-between border-t border-border pt-2">
											<span className="text-xs text-muted-foreground">
												Credit Limit
											</span>
											<span className="text-xs font-medium text-foreground">
												{formatCurrency(customer.limit)}
											</span>
										</div>
									</div>
								</div>

								{/* Form Fields */}
								<div className="space-y-4">
									<CustomSelect
										className="w-full"
										label="Transaction Type"
										placeholder="Select type"
										required
										options={TRANSACTION_TYPES}
										value={watch("type")}
										onValueChange={(value) =>
											setValue("type", value as "credit" | "payment")
										}
										error={errors.type?.message}
									/>

									<CustomInput
										label="Amount"
										type="number"
										placeholder="0.00"
										required
										step="0.01"
										min="0.01"
										error={errors.amount?.message}
										{...register("amount", { valueAsNumber: true })}
									/>

									<CustomTextArea
										label="Notes (Optional)"
										className="min-h-24"
										placeholder="Add notes about this transaction..."
										rows={4}
										error={errors.notes?.message}
										{...register("notes")}
									/>
								</div>
							</div>

							{/* Bottom Action Buttons */}
							<div className="border-t border-border bg-background p-4">
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
										disabled={isSubmitting}
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