"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitPersonalInfo } from "@/app/onboarding/actions/submitPersonalInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { userInfoSchema } from "@/lib/schema/onboarding";
import { UserInfoFormData } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

interface PersonalInfoStepProps {
    onNext: () => void;
    isSubmitting: boolean;
    setIsSubmitting: (loading: boolean) => void;
}

const PersonalInfoStep = ({ onNext, isSubmitting, setIsSubmitting }: PersonalInfoStepProps) => {
    const { user } = useAuth();
    const form = useForm<UserInfoFormData>({
        resolver: zodResolver(userInfoSchema),
        defaultValues: {
            name: user?.name || "",
            phone: "",
            address: "",
        },
    });
    console.log(user);
    

    useEffect(() => {
        if (user) {
            form.setValue("name", user.name || "");
        }
    }, [user, form]);

    const handleSubmit = async (formData: UserInfoFormData) => {
        if (!user?.id) {
            toast.error("You must be logged in to continue");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitPersonalInfo(formData);

            toast.success("Profile updated successfully!");
            onNext();
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <CustomInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        required
                        error={form.formState.errors.name?.message}
                        {...form.register("name")}
                    />

                    <CustomInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={user?.email ?? ""}
                        disabled
                    />

                    <CustomInput
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        error={form.formState.errors.phone?.message}
                        {...form.register("phone")}
                    />

                    <CustomTextArea
                        label="Address"
                        placeholder="Enter your address"
                        required
                        error={form.formState.errors.address?.message}
                        {...form.register("address")}
                    />

                    <div className="flex justify-end">
                        <SubmitButton
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </SubmitButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default PersonalInfoStep;
