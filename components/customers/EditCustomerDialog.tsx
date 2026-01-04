"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
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
import useStores from "@/hooks/store/useStores";
import type { CustomerFormData } from "@/lib/schema/customer";
import { customerSchema } from "@/lib/schema/customer";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { ICustomer } from "@/types/customers";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

interface EditCustomerDialogProps {
    customer: ICustomer;
    trigger?: ReactNode;
}

const EditCustomerDialog = ({ customer, trigger }: EditCustomerDialogProps) => {
    const [open, setOpen] = useState(false);
    const formId = useId();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const { debtLimit } = useStores();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CustomerFormData) => {
            const { error } = await supabase
                .from(Tables.Customers)
                .update({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    idNumber: data.idNumber,
                    status: data.status,
                    limit: data.limit,
                })
                .eq("id", customer.id);

            if (error) throw error;

            return data;
        },
        onSuccess: async () => {
            toast.success("Customer updated successfully!");

            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.CustomerDetails, customer.id],
            });

            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.CustomersList],
            });

            setOpen(false);
        },
        onError: () => {
            toast.error("Failed to update customer. Please try again.");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone,
            address: customer.address,
            idNumber: customer.idNumber || "",
            status: customer.status as "active" | "inactive",
            limit: customer.limit,
        },
    });

    const watchedLimit = watch("limit");

    useEffect(() => {
        if (open) {
            reset({
                name: customer.name,
                email: customer.email || "",
                phone: customer.phone,
                address: customer.address,
                idNumber: customer.idNumber || "",
                status: customer.status as "active" | "inactive",
                limit: customer.limit,
            });
        }
    }, [open, customer, reset]);

    const onSubmit = async (data: CustomerFormData) => {
        mutate(data);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isPending) {
            reset();
        }
        setOpen(newOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange} modal={true}>
            {trigger ? (
                <SheetTrigger asChild>{trigger}</SheetTrigger>
            ) : (
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </SheetTrigger>
            )}
            <SheetContent side="bottom" className="h-[90vh] rounded-t-xl p-0">
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-border border-b px-4 py-4 text-left">
                        <SheetTitle>Edit Customer</SheetTitle>
                        <SheetDescription>
                            Update customer information and details
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex h-full flex-col"
                            id={formId}
                        >
                            <div className="flex-1 space-y-4 p-4">
                                <CustomInput
                                    label="Full Name"
                                    placeholder="Enter customer name"
                                    required
                                    error={errors.name?.message}
                                    {...register("name")}
                                />

                                <CustomInput
                                    label="Email"
                                    type="email"
                                    placeholder="customer@example.com"
                                    error={errors.email?.message}
                                    {...register("email")}
                                />

                                <CustomInput
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    required
                                    error={errors.phone?.message}
                                    {...register("phone")}
                                />

                                <CustomInput
                                    label="ID Number"
                                    placeholder="Enter ID/Passport number"
                                    error={errors.idNumber?.message}
                                    {...register("idNumber")}
                                />

                                <CustomTextArea
                                    label="Address"
                                    placeholder="Enter full address"
                                    rows={3}
                                    required
                                    error={errors.address?.message}
                                    {...register("address")}
                                />

                                <CustomSelect
                                    label="Customer Status"
                                    placeholder="Select status"
                                    required
                                    options={STATUS_OPTIONS}
                                    className="w-full"
                                    value={watch("status")}
                                    onValueChange={(value) =>
                                        setValue("status", value as "active" | "inactive")
                                    }
                                    error={errors.status?.message}
                                />

                                <CustomInput
                                    label="Credit Limit"
                                    type="number"
                                    placeholder="0.00"
                                    required
                                    step="0.01"
                                    min="0"
                                    description={
                                        watchedLimit > debtLimit
                                            ? `Exceeds branch debt limit of ${debtLimit}`
                                            : ""
                                    }
                                    showHint
                                    error={errors.limit?.message}
                                    {...register("limit", { valueAsNumber: true })}
                                />
                            </div>

                            {/* Bottom Action Buttons */}
                            <div className="border-border border-t bg-background p-4">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        disabled={isPending}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <SubmitButton
                                        isLoading={isPending}
                                        disabled={isPending}
                                        className="flex-1"
                                        form={formId}
                                    >
                                        Save Changes
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

export default EditCustomerDialog;

