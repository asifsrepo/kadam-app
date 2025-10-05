"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";
import type { TransactionFormData } from "@/lib/schema/transaction";
import { transactionSchema } from "@/lib/schema/transaction";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { ICustomer } from "@/types/customers";
import type { ITransaction } from "@/types/transaction";
import CustomDatePicker from "~/form-elements/CustomDatePicker";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "SAR", "AED"];

const TRANSACTION_TYPES = [
    { value: "credit", label: "Credit (Customer takes goods)" },
    { value: "payment", label: "Payment (Customer pays back)" },
];

const NewTransactionPage = () => {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();
    const { user } = useAuth();

    const { data: customer, error: customerError } = useQuery({
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

    useEffect(() => {
        if (customerError) {
            toast.error("Failed to load customer details");
            router.back();
        }
    }, [customerError, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            currency: "USD",
            type: "credit",
            paybackDate: new Date().toISOString()
        },
    });

    const onSubmit = async (data: TransactionFormData) => {
        if (!user?.id) {
            toast.error("You must be logged in to create a transaction");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from(Tables.Transactions).insert({
                customerId: customerId,
                amount: data.amount,
                currency: data.currency,
                type: data.type,
                notes: data.notes || "",
                paybackDate: data.paybackDate,
                createdAt: new Date().toISOString(),
                createdBy: user.id,
            } as ITransaction);

            if (error) throw error;

            toast.success("Transaction created successfully!");
            router.push(`/dashboard/customers/${customerId}`);
        } catch (error) {
            toast.error("Failed to create transaction. Please try again.");
            console.error("Error creating transaction:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3 px-4 py-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate font-semibold text-base">New Transaction</h1>
                        {customer && (
                            <p className="truncate text-muted-foreground text-xs">
                                {customer.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-3">
                {customer && (
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">
                                {customer.name} • Limit: {customer.limit?.toFixed(2) || "0.00"}
                            </span>
                        </div>
                    </div>
                )}
                <div className="space-y-3">
                    <CustomSelect
                    className="w-full"
                        label="Type"
                        placeholder="Select type"
                        required
                        options={TRANSACTION_TYPES}
                        value={watch("type")}
                        onValueChange={(value) => setValue("type", value as "credit" | "payment")}
                        error={errors.type?.message}
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
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

                        <CustomSelect
                        className="w-full"
                            label="Currency"
                            placeholder="Select"
                            required
                            options={CURRENCIES}
                            value={watch("currency")}
                            onValueChange={(value) => setValue("currency", value)}
                            error={errors.currency?.message}
                        />
                    </div>

                    <CustomDatePicker
                        label="Payback Date (Optional)"
                        value={
                            watch("paybackDate") ? new Date(watch("paybackDate")!) : undefined
                        }
                        onSelect={(date) => setValue("paybackDate", date?.toISOString())}
                        error={errors.paybackDate?.message}
                    />

                    <CustomTextArea
                        label="Notes (Optional)"
                        placeholder="Add notes..."
                        rows={3}
                        error={errors.notes?.message}
                        {...register("notes")}
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <SubmitButton
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Create
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
};

export default NewTransactionPage;

