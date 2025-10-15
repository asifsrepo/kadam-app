"use client";

import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { IBranch } from "@/types/store";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

interface BranchDialogProps {
	branch?: IBranch | null;
	mode: "create" | "edit";
}

const BranchDialog = ({ branch, mode }: BranchDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: branch?.name || "",
		location: branch?.location || "",
		debtLimit: branch?.debtLimit?.toString() || "",
		isMain: branch?.isMain || false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Branch name is required";
		}

		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		if (!formData.debtLimit.trim()) {
			newErrors.debtLimit = "Debt limit is required";
		} else {
			const limit = parseFloat(formData.debtLimit);
			if (Number.isNaN(limit) || limit < 0) {
				newErrors.debtLimit = "Please enter a valid positive number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const _branchData = {
				name: formData.name.trim(),
				location: formData.location.trim(),
				debtLimit: parseFloat(formData.debtLimit),
				isMain: formData.isMain,
			};

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setFormData({
				name: "",
				location: "",
				debtLimit: "",
				isMain: false,
			});
			setErrors({});
			setIsOpen(false);
		} catch (error) {
			console.error("Error saving branch:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(false);
	};

	const openDialog = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(true);
	};

	return (
		<>
			<Button onClick={openDialog} className="flex items-center gap-2" variant={"outline"}>
				{mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			</Button>

			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="mx-4 max-w-md p-4 sm:p-6">
					<DialogHeader className="space-y-2">
						<DialogTitle className="font-semibold text-foreground text-lg">
							{mode === "edit" ? "Edit Branch" : "Add New Branch"}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-sm">
							{mode === "edit"
								? "Update the branch information below."
								: "Enter the details for your new branch."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-4">
							<CustomInput
								label="Branch Name"
								name="name"
								value={formData.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("name", e.target.value)
								}
								placeholder="Enter branch name"
								error={errors.name}
								required
							/>

							<CustomInput
								label="Location"
								name="location"
								value={formData.location}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("location", e.target.value)
								}
								placeholder="Enter branch location"
								error={errors.location}
								required
							/>

							<CustomInput
								label="Debt Limit"
								name="debtLimit"
								type="number"
								value={formData.debtLimit}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("debtLimit", e.target.value)
								}
								placeholder="Enter debt limit amount"
								error={errors.debtLimit}
								required
								min="0"
								step="0.01"
							/>
						</div>

						<DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={handleClose}
								className="w-full rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto"
							>
								Cancel
							</button>
							<SubmitButton
								type="submit"
								isLoading={isLoading}
								className="w-full sm:w-auto"
							>
								{mode === "edit" ? "Update Branch" : "Add Branch"}
							</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BranchDialog;
