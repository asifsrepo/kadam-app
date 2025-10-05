"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";
import type { CustomerFormData } from "@/lib/schema/customer";
import { customerSchema } from "@/lib/schema/customer";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import { ICustomer } from "@/types/customers";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const COUNTRIES = [
    "United States",
    "United Kingdom",
    "India",
    "Pakistan",
    "Saudi Arabia",
    "United Arab Emirates",
];

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

const NewCustomerPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();
    const { user, initialize } = useAuth();

    useEffect(()=>{
        initialize()
    },[initialize])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            status: "active",
            limit: 0,
        },
    });
    
    const onSubmit = async (data: CustomerFormData) => {
        setIsSubmitting(true);
        try {
            const { data: response, error } = await supabase
                .from(Tables.Customers)
                .insert({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    country: data.country,
                    idNumber: data.idNumber,
                    status: data.status,
                    limit: data.limit,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id
                } as ICustomer);

            if (error) throw error;
            
            console.log(response);


            toast.success("Customer created successfully!");
            router.back();
        } catch (error) {
            toast.error("Failed to create customer. Please try again.");
            console.error("Error creating customer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4 px-4 py-3 md:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Go back</span>
                    </Button>
                    <h1 className="font-semibold text-lg">New Customer</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl p-4 md:p-6">
                <div className="space-y-6">
                    <div className="space-y-4">
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
                            required
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
                            required
                            error={errors.idNumber?.message}
                            {...register("idNumber")}
                        />
                    </div>

                    <div className="space-y-4">
                        <CustomTextArea
                            label="Street Address"
                            placeholder="Enter full address"
                            required
                            rows={3}
                            error={errors.address?.message}
                            {...register("address")}
                        />

                        <CustomSelect
                            label="Country"
                            placeholder="Select country"
                            required
                            options={COUNTRIES}
                            value={watch("country")}
                            onValueChange={(value) => setValue("country", value)}
                            error={errors.country?.message}
                            creatable
                            createButtonText="Add a new country"
                            createInputPlaceholder="Enter country name"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-4">
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
                            error={errors.limit?.message}
                            {...register("limit", { valueAsNumber: true })}
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="w-full md:w-auto"
                        >
                            Cancel
                        </Button>
                        <SubmitButton
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full md:w-auto"
                        >
                            Create Customer
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewCustomerPage;

