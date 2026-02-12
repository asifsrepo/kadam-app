"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface TransactionTypeSelectorProps {
	value: "credit" | "payment";
	onValueChange: (value: "credit" | "payment") => void;
	error?: string;
	disabled?: boolean;
}

const TransactionTypeSelector = ({
	value,
	onValueChange,
	error,
	disabled = false,
}: TransactionTypeSelectorProps) => {
	const id = useId();

	return (
		<div className="space-y-2">
			<label htmlFor={id} className="font-medium text-foreground text-sm">
				Transaction Type <span className="text-destructive">*</span>
			</label>

			<div className="grid grid-cols-2 gap-2">
				<label className="relative">
					<input
						type="radio"
						name="transactionType"
						value="credit"
						checked={value === "credit"}
						onChange={() => onValueChange("credit")}
						disabled={disabled}
						className="sr-only"
					/>
					<div
						className={cn(
							"flex cursor-pointer flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
							"focus-within:ring-2 focus-within:ring-ring/40 hover:bg-muted/40",
							value === "credit"
								? "border-destructive bg-destructive/10 text-destructive"
								: "border-border/60 bg-card",
							disabled && "cursor-not-allowed opacity-50",
						)}
					>
						<div className="text-center">
							<div className="font-medium text-sm">Credit</div>
							<div className="text-muted-foreground text-xs">
								Customer takes goods
							</div>
						</div>
					</div>
				</label>

				<label className="relative">
					<input
						type="radio"
						name="transactionType"
						value="payment"
						checked={value === "payment"}
						onChange={() => onValueChange("payment")}
						disabled={disabled}
						className="sr-only"
					/>
					<div
						className={cn(
							"flex cursor-pointer flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
							"focus-within:ring-2 focus-within:ring-ring/40 hover:bg-muted/40",
							value === "payment"
								? "border-success bg-success/10 text-success"
								: "border-border/60 bg-card",
							disabled && "cursor-not-allowed opacity-50",
						)}
					>
						<div className="text-center">
							<div className="font-medium text-sm">Payment</div>
							<div className="text-muted-foreground text-xs">Customer pays back</div>
						</div>
					</div>
				</label>
			</div>

			{error && <p className="text-destructive text-sm">{error}</p>}
		</div>
	);
};

export default TransactionTypeSelector;
