"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

// Shop Information Schema
const shopInfoSchema = z.object({
    shopName: z.string().min(2, "Shop name must be at least 2 characters"),
    shopLocation: z.string().min(5, "Please enter a valid location"),
});

type ShopInfoFormData = z.infer<typeof shopInfoSchema>;

interface ShopInfoStepProps {
    onPrevious: () => void;
    onComplete: () => void;
    isSubmitting: boolean;
    setIsSubmitting: (loading: boolean) => void;
}

const ShopInfoStep = ({ onPrevious, onComplete, isSubmitting, setIsSubmitting }: ShopInfoStepProps) => {
    const { user } = useAuth();
    const supabase = createClient();
    const queryClient = useQueryClient();

    const form = useForm<ShopInfoFormData>({
        resolver: zodResolver(shopInfoSchema),
        defaultValues: {
            shopName: "",
            shopLocation: "",
        },
    });

    const handleSubmit = async (data: ShopInfoFormData) => {
        if (!user?.id) {
            toast.error("You must be logged in to continue");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create or update store information
            const { error } = await supabase
                .from(Tables.Stores)
                .upsert({
                    name: data.shopName,
                    location: data.shopLocation,
                    ownerId: user.id,
                });

            if (error) throw error;

            toast.success("Welcome to Kadam! Your account is ready.");
            
            // Invalidate queries and redirect to dashboard
            await queryClient.invalidateQueries();
            onComplete();
        } catch (error) {
            toast.error("Failed to create store. Please try again.");
            console.error("Error creating store:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Shop Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <CustomInput
                        label="Shop Name"
                        placeholder="Enter your shop name"
                        required
                        error={form.formState.errors.shopName?.message}
                        {...form.register("shopName")}
                    />

                    <CustomInput
                        label="Shop Location"
                        placeholder="Enter your shop address"
                        required
                        error={form.formState.errors.shopLocation?.message}
                        {...form.register("shopLocation")}
                    />

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onPrevious}
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <SubmitButton
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Complete Setup
                            <Check className="ml-2 h-4 w-4" />
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ShopInfoStep;
