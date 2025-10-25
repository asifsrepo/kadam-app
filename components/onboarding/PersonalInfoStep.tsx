"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import submitPersonalInfo from "@/actions/onboarding/submitPersonalInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { userInfoSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/client";
import { Tables, UserInfoFormData } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

interface PersonalInfoStepProps {
	onComplete: () => void;
	isSubmitting: boolean;
	setIsSubmitting: (loading: boolean) => void;
}

const PersonalInfoStep = ({ onComplete, isSubmitting, setIsSubmitting }: PersonalInfoStepProps) => {
	const { user: authUser, loadUser } = useAuth();
	const {
		setValue,
		handleSubmit,
		formState: { errors },
		register,
	} = useForm<UserInfoFormData>({
		resolver: zodResolver(userInfoSchema),
		defaultValues: {
			name: "",
			phone: "",
			address: "",
		},
	});

	const { data: user } = useQuery({
		queryKey: ["user-onboarding-profile"],
		queryFn: async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from(Tables.UserProfiles)
				.select("id,name,email,phone,address")
				.eq("id", authUser?.id)
				.single();

			if (error) throw error;

			setValue("name", data.name || "");
			setValue("phone", data.phone || "");
			setValue("address", data.address || "");

			return data;
		},
		enabled: !!authUser?.id,
	});

	const onSubmit = async (formData: UserInfoFormData) => {
		if (!user?.id) {
			toast.error("You must be logged in to continue");
			return;
		}

		setIsSubmitting(true);
		try {
			const { success, error } = await submitPersonalInfo(formData);

			if (!success) {
				toast.error(error);
				throw new Error(error);
			}
			await loadUser();
			toast.success("Profile updated successfully!");
			onComplete();
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
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<CustomInput
						label="Full Name"
						placeholder="Enter your full name"
						required
						error={errors.name?.message}
						{...register("name")}
					/>

					<CustomInput
						label="Email"
						type="email"
						placeholder="Enter your email"
						required
						value={authUser?.email ?? ""}
						disabled
					/>

					<CustomInput
						label="Phone Number"
						type="tel"
						placeholder="Enter your phone number"
						required
						error={errors.phone?.message}
						{...register("phone")}
					/>

					<CustomTextArea
						label="Address"
						placeholder="Enter your address"
						required
						error={errors.address?.message}
						{...register("address")}
					/>

					<div className="flex justify-end">
						<SubmitButton isLoading={isSubmitting} disabled={isSubmitting}>
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
