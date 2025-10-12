import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Check, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import submitShopInfo from "@/app/onboarding/actions/submitShopInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import useStores from "@/hooks/store/useStores";
import { shopInfoSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/client";
import { ShopInfoFormData, Tables } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

interface ShopInfoStepProps {
	onPrevious: () => void;
	onComplete: () => void;
	isSubmitting: boolean;
	setIsSubmitting: (loading: boolean) => void;
}

const ShopInfoStep = ({
	onPrevious,
	onComplete,
	isSubmitting,
	setIsSubmitting,
}: ShopInfoStepProps) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const supabase = createClient();
	const { setActiveBranch } = useStores();

	// State for checking storeId
	const [isCheckingStoreId, setIsCheckingStoreId] = useState(false);

	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
		watch,
		setError,
	} = useForm<ShopInfoFormData>({
		resolver: zodResolver(shopInfoSchema),
		defaultValues: {
			name: "",
			phone: "",
			storeId: "",
			branches: [
				{
					name: "",
					location: "",
					isMain: true,
					debtLimit: "10"
				},
			],
		},
	});

	const storeId = watch("storeId");
	const [debouncedStoreId] = useDebounce(storeId, 500);

	useEffect(() => {
		if (!debouncedStoreId || debouncedStoreId.length < 4) return;
		let isMounted = true;
		setIsCheckingStoreId(true);

		(async () => {
			const { data, error } = await supabase
				.from(Tables.Stores)
				.select("id")
				.eq("storeId", debouncedStoreId)
				.single();

			if (!isMounted) return;

			if (error && error.code !== "PGRST116" && error.message) {
				toast.error("Failed to fetch Store Id. Please try again.");
				setIsCheckingStoreId(false);
				return;
			}

			if (data) {
				setError("storeId", {
					message: "This Store Id is already taken. Please choose another one.",
				});
			} else {
				setError("storeId", { message: undefined });
			}

			setIsCheckingStoreId(false);
		})();

		return () => {
			isMounted = false;
		};
	}, [debouncedStoreId, supabase, setError]);

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "branches",
	});

	const onSubmit = async (data: ShopInfoFormData) => {
		if (!user?.id) {
			toast.error("You must be logged in to continue");
			return;
		}

		setIsSubmitting(true);
		try {
			const { success, error, data: branchData } = await submitShopInfo(data);

			if (!success) throw new Error(error);
			toast.success("Welcome to Kadam! Your account is ready.");

			await queryClient.invalidateQueries();
			onComplete();
			setActiveBranch(branchData ?? null);
		} catch (error) {
			toast.error("Failed to create stores. Please try again.");
			console.error("Error creating stores:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const createBranch = () => {
		append({ name: "", location: "", isMain: false, debtLimit: "0" });
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Building2 className="h-4 w-4" />
					Shop Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<CustomInput
						label="Business Name"
						placeholder="Enter your business name"
						required
						error={errors.name?.message}
						{...register("name")}
					/>
					<CustomInput
						label="Business Phone"
						placeholder="Enter your business phone number"
						required
						error={errors.phone?.message}
						{...register("phone")}
					/>
					<CustomInput
						label="Store Id"
						placeholder="Enter your Store Id"
						required
						error={errors.storeId?.message}
						disabled={isCheckingStoreId || isSubmitting}
						{...register("storeId")}
					/>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-sm">Store Branches</h3>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={createBranch}
								disabled={isSubmitting}
								className="h-8 px-3 text-xs"
							>
								<Plus className="mr-1 h-3 w-3" />
								Add Branch
							</Button>
						</div>
						<div className="space-y-2">
							{fields.map((field, index) => (
								<Card key={field.id} className="p-3">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<h4 className="font-medium text-sm">
													Branch {index + 1}
												</h4>
												{index === 0 && (
													<span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
														Main
													</span>
												)}
											</div>
											{fields.length > 1 && (
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => remove(index)}
													disabled={isSubmitting}
													className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											)}
										</div>
										<div className="space-y-2">
											<CustomInput
												label="Branch Name"
												placeholder="Enter branch name"
												required
												error={errors.branches?.[index]?.name?.message}
												{...register(`branches.${index}.name`)}
											/>
											<CustomInput
												label="Branch Debt Limit"
												placeholder="Enter branch debt limit"
												required
												type="number"
												error={errors.branches?.[index]?.debtLimit?.message}
												{...register(`branches.${index}.debtLimit`)}
											/>
											<CustomInput
												label="Branch Location"
												placeholder="Enter branch address"
												required
												error={errors.branches?.[index]?.location?.message}
												{...register(`branches.${index}.location`)}
											/>
										</div>
									</div>
								</Card>
							))}
						</div>
						{errors.branches && (
							<p className="text-destructive text-xs">{errors.branches.message}</p>
						)}
					</div>
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
							Complete Setup
							<Check className="ml-2 h-3 w-3" />
						</SubmitButton>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default ShopInfoStep;
