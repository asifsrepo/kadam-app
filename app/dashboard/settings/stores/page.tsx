"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

// Branch Schema
const branchSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(2, "Branch name must be at least 2 characters"),
	location: z.string().min(5, "Please enter a valid location"),
	isMain: z.boolean().optional(),
});

// Store Management Schema
const storeManagementSchema = z.object({
	branches: z.array(branchSchema).min(1, "At least one branch is required"),
});

type StoreManagementFormData = z.infer<typeof storeManagementSchema>;

const StoreManagementPage = () => {
	const { user } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	// Fetch existing stores
	const { data: stores, isLoading } = useQuery({
		queryKey: ["stores", user?.id],
		queryFn: async () => {
			if (!user?.id) return [];
			const { data, error } = await supabase
				.from(Tables.Stores)
				.select("*")
				.eq("ownerId", user.id)
				.order("isMain", { ascending: false });

			if (error) throw error;
			return data || [];
		},
		enabled: !!user?.id,
	});

	const form = useForm<StoreManagementFormData>({
		resolver: zodResolver(storeManagementSchema),
		defaultValues: {
			branches: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "branches",
	});

	// Update form when stores data is loaded
	React.useEffect(() => {
		if (stores && stores.length > 0) {
			form.reset({
				branches: stores.map((store) => ({
					id: store.id,
					name: store.name,
					location: store.location,
					isMain: store.isMain || false,
				})),
			});
		}
	}, [stores, form]);

	const handleSubmit = async (data: StoreManagementFormData) => {
		if (!user?.id) {
			toast.error("You must be logged in to continue");
			return;
		}

		try {
			// Get existing store IDs
			const existingStoreIds = stores?.map((store) => store.id) || [];
			const formStoreIds = data.branches
				.map((branch) => branch.id)
				.filter(Boolean) as string[];

			// Find stores to delete
			const storesToDelete = existingStoreIds.filter((id) => !formStoreIds.includes(id));

			// Delete removed stores
			if (storesToDelete.length > 0) {
				const { error: deleteError } = await supabase
					.from(Tables.Stores)
					.delete()
					.in("id", storesToDelete);

				if (deleteError) throw deleteError;
			}

			// Update or create stores
			for (const branch of data.branches) {
				if (branch.id) {
					// Update existing store
					const { error } = await supabase
						.from(Tables.Stores)
						.update({
							name: branch.name,
							location: branch.location,
							isMain: branch.isMain || false,
						})
						.eq("id", branch.id);

					if (error) throw error;
				} else {
					// Create new store
					const { error } = await supabase.from(Tables.Stores).insert({
						name: branch.name,
						location: branch.location,
						ownerId: user.id,
						isMain: branch.isMain || false,
					});

					if (error) throw error;
				}
			}

			toast.success("Store branches updated successfully!");
			await queryClient.invalidateQueries({ queryKey: ["stores"] });
		} catch (error) {
			toast.error("Failed to update stores. Please try again.");
			console.error("Error updating stores:", error);
		}
	};

	const addNewBranch = () => {
		append({
			name: "",
			location: "",
			isMain: false,
		});
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-6 w-40 animate-pulse rounded bg-muted" />
				<div className="h-48 animate-pulse rounded bg-muted" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="font-bold text-xl">Store Management</h1>
				<p className="text-muted-foreground text-sm">
					Manage your store branches and locations
				</p>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<Building2 className="h-4 w-4" />
						Store Branches
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-sm">Your Branches</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addNewBranch}
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
													{field.isMain && (
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
													error={
														form.formState.errors.branches?.[index]
															?.name?.message
													}
													{...form.register(`branches.${index}.name`)}
												/>

												<CustomInput
													label="Branch Location"
													placeholder="Enter branch address"
													required
													error={
														form.formState.errors.branches?.[index]
															?.location?.message
													}
													{...form.register(`branches.${index}.location`)}
												/>
											</div>
										</div>
									</Card>
								))}
							</div>

							{form.formState.errors.branches && (
								<p className="text-destructive text-xs">
									{form.formState.errors.branches.message}
								</p>
							)}
						</div>
						<div className="flex justify-end pt-2">
							<SubmitButton
								isLoading={form.formState.isSubmitting}
								disabled={form.formState.isSubmitting}
								className="h-9 text-sm"
							>
								Save Changes
							</SubmitButton>
						</div>
						zz
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default StoreManagementPage;
