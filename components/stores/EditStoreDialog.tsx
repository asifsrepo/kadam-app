"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/store/useAuth";
import useStores from "@/hooks/store/useStores";
import { CURRENCIES } from "@/lib/currencies";
import { editStoreSchema } from "@/lib/schema/onboarding";
import { createClient } from "@/lib/supabase/client";
import { EditStoreFormData, QueryKeys, Tables } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import SubmitButton from "~/form-elements/SubmitButton";
import { Button } from "../ui/button";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";

interface EditStoreDialogProps {
	storeName?: string;
	storePhone?: string;
	storeCurrency?: string;
	storeId?: string;
}

const currencyOptions = Object.values(CURRENCIES).map((c) => ({
	value: c.code,
	label: `${c.symbol} ${c.name}`,
}));

const EditStoreDialog = ({
	storeName = "",
	storePhone = "",
	storeCurrency = "AED",
	storeId,
}: EditStoreDialogProps) => {
	const [open, setOpen] = useState(false);

	const { user } = useAuth();
	const { loadStores } = useStores();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<EditStoreFormData>({
		resolver: zodResolver(editStoreSchema),
		defaultValues: {
			name: storeName,
			phone: storePhone,
			currency: storeCurrency,
		},
	});

	const selectedCurrency = watch("currency");

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: EditStoreFormData) => {
			if (!storeId || !user?.id) {
				throw new Error("Missing store ID or user ID");
			}

			const { data: storeData, error } = await supabase
				.from(Tables.Stores)
				.update({
					name: data.name.trim(),
					phone: data.phone.trim(),
					currency: data.currency,
				})
				.eq("id", storeId)
				.eq("ownerId", user.id);

			if (error) throw error;

			return storeData?.[0];
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.StoreWithBranches, user?.id],
			});
			// Force reload stores to update currency in zustand store
			if (user?.id) {
				await loadStores(user.id, true);
			}
			toast.success("Store updated successfully");
			setOpen(false);
		},
		onError: (error) => {
			console.error("Error updating store:", error);
			toast.error("Failed to update store. Please try again.");
		},
	});

	const onSubmit = (data: EditStoreFormData) => {
		mutate(data);
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			reset({
				name: storeName,
				phone: storePhone,
				currency: storeCurrency,
			});
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 shrink-0 border-primary/20 hover:bg-primary/10"
				>
					<Edit className="h-4 w-4" />
					<span className="sr-only">Edit store</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0">
				<div className="flex h-full flex-col">
					<SheetHeader className="border-border/60 border-b px-5 py-4">
						<SheetTitle className="text-lg">Edit Store</SheetTitle>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto px-5 py-4">
						<form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
							<div className="flex-1 space-y-3">
								<CustomInput
									label="Store Name"
									placeholder="Enter store name"
									className="text-sm"
									{...register("name")}
									error={errors.name?.message}
								/>
								<CustomInput
									label="Phone Number"
									type="tel"
									placeholder="Enter phone number"
									className="text-sm"
									{...register("phone")}
									error={errors.phone?.message}
								/>
								<CustomSelect
									label="Default Currency"
									placeholder="Select currency"
									options={currencyOptions}
									value={selectedCurrency}
									className="w-full"
									onValueChange={(value) => setValue("currency", value)}
									error={errors.currency?.message}
								/>
							</div>
							<SheetFooter className="gap-2 border-border/60 border-t px-5 py-4 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
									className="h-11 w-full flex-1 text-sm sm:w-auto"
								>
									Cancel
								</Button>
								<SubmitButton
									isLoading={isPending}
									className="h-11 w-full flex-1 text-sm sm:w-auto"
								>
									Save
								</SubmitButton>
							</SheetFooter>
						</form>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default EditStoreDialog;
