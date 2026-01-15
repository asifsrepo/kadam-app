import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import submitPassword from "@/actions/onboarding/submitPassword";
import { useAuth } from "@/hooks/store/useAuth";
import { passwordSchema } from "@/lib/schema/onboarding";
import { PasswordFormData } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PasswordStepProps {
	onComplete: () => void;
	onPrevious: () => void;
	isSubmitting: boolean;
	setIsSubmitting: (loading: boolean) => void;
}

const PasswordStep = ({
	onComplete,
	onPrevious,
	isSubmitting,
	setIsSubmitting,
}: PasswordStepProps) => {
	const { loadUser } = useAuth();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: PasswordFormData) => {
		setIsSubmitting(true);
		try {
			const { success, error, data: result } = await submitPassword(data);
			if (!success) throw new Error(error);
			await loadUser();

			// Check if password was already set
			if (result?.passwordAlreadySet) {
				toast.info("Password is already set. You can continue with the setup.", {
					description: "If you want to change your password, you can do so later in settings.",
				});
			} else {
				toast.success("Password created successfully!");
			}

			onComplete();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create password. Please try again.";
			toast.error("Failed to create password", {
				description: errorMessage,
			});
			console.error("Error creating password:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Lock className="h-4 w-4" />
					Create Password
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<CustomInput
						label="Password"
						type="password"
						placeholder="Enter your password"
						required
						error={errors.password?.message}
						{...register("password")}
					/>
					<CustomInput
						label="Confirm Password"
						type="password"
						placeholder="Confirm your password"
						required
						error={errors.confirmPassword?.message}
						{...register("confirmPassword")}
					/>
					<div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
						<Button
							type="button"
							variant="outline"
							onClick={onPrevious}
							disabled={isSubmitting}
							className="order-2 h-9 text-sm sm:order-1"
						>
							<ArrowLeft className="mr-2 h-3 w-3" />
							Previous
						</Button>
						<SubmitButton
							isLoading={isSubmitting}
							disabled={isSubmitting}
							className="order-1 h-9 text-sm sm:order-2"
						>
							Continue
							<ArrowRight className="ml-2 h-3 w-3" />
						</SubmitButton>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
export default PasswordStep;
