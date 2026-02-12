"use client";

import { ArrowDownAZ, ArrowUpAZ, Check, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface CustomerFilters {
	status: "all" | "active" | "inactive";
	balance: "all" | "positive" | "negative" | "zero";
	sortBy: "name" | "createdAt" | "balance";
	sortOrder: "asc" | "desc";
}

interface CustomerFiltersProps {
	filters: CustomerFilters;
	onFiltersChange: (filters: CustomerFilters) => void;
	onClearFilters: () => void;
	hasActiveFilters: boolean;
}

const CustomerFilters = ({
	filters,
	onFiltersChange,
	onClearFilters,
	hasActiveFilters,
}: CustomerFiltersProps) => {
	const [open, setOpen] = useState(false);
	const [localFilters, setLocalFilters] = useState<CustomerFilters>(filters);

	// Update local filters when props change
	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	const updateLocalFilter = <K extends keyof CustomerFilters>(
		key: K,
		value: CustomerFilters[K],
	) => {
		setLocalFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleApplyFilters = () => {
		onFiltersChange(localFilters);
		setOpen(false);
	};

	const handleClearFilters = () => {
		const defaultFilters: CustomerFilters = {
			status: "all",
			balance: "all",
			sortBy: "name",
			sortOrder: "asc",
		};
		setLocalFilters(defaultFilters);
		onClearFilters();
		setOpen(false);
	};

	const statusOptions = [
		{ value: "all", label: "All Customers", description: "Show everyone" },
		{ value: "active", label: "Active", description: "Currently active" },
		{ value: "inactive", label: "Inactive", description: "Not active" },
	];

	const balanceOptions = [
		{ value: "all", label: "All Balances", description: "Any amount" },
		{ value: "positive", label: "Owes Money", description: "Positive balance" },
		{ value: "negative", label: "Has Credit", description: "Negative balance" },
		{ value: "zero", label: "Zero Balance", description: "No balance" },
	];

	const sortOptions = [
		{ value: "name", label: "Name", description: "Alphabetically" },
		{ value: "createdAt", label: "Date", description: "By creation" },
		{ value: "balance", label: "Balance", description: "By amount" },
	];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant={hasActiveFilters ? "tonal" : "outline"}
					size="sm"
					className="relative h-11 gap-2 px-3"
				>
					<Filter className="h-4 w-4" />
					<span className="hidden sm:inline">Filter</span>
					{hasActiveFilters && (
						<div className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-destructive font-bold text-[10px] text-destructive-foreground">
							{[
								localFilters.status !== "all" ? 1 : 0,
								localFilters.balance !== "all" ? 1 : 0,
							].reduce((a, b) => a + b, 0)}
						</div>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
				<div className="flex h-full flex-col">
					<SheetHeader className="border-border/60 border-b px-5 py-4 text-left">
						<div className="flex items-center justify-between">
							<div>
								<SheetTitle>Filters & Sort</SheetTitle>
								<SheetDescription>Customize your customer view</SheetDescription>
							</div>
							{hasActiveFilters && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClearFilters}
									className="h-8 gap-1.5 text-xs"
								>
									<X className="h-3.5 w-3.5" />
									Clear
								</Button>
							)}
						</div>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto">
						<div className="space-y-5 p-5">
							{/* Status Filter */}
							<div className="space-y-2.5">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-foreground text-sm">
										Customer Status
									</h3>
									{localFilters.status !== "all" && (
										<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
											Active
										</span>
									)}
								</div>
								<div className="space-y-2">
									{statusOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() =>
												updateLocalFilter(
													"status",
													option.value as CustomerFilters["status"],
												)
											}
										className={cn(
											"group relative flex w-full items-start gap-3 rounded-2xl border border-border/60 p-3 text-left transition-all",
											localFilters.status === option.value
												? "border-primary bg-primary/5"
												: "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/40",
										)}
										>
											<div
												className={cn(
													"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
													localFilters.status === option.value
														? "border-primary bg-primary"
														: "border-muted-foreground/30 group-hover:border-primary/50",
												)}
											>
												{localFilters.status === option.value && (
													<Check className="h-2.5 w-2.5 text-primary-foreground" />
												)}
											</div>

											<div className="min-w-0 flex-1">
												<div
													className={cn(
														"font-medium text-sm",
														localFilters.status === option.value
															? "text-primary"
															: "text-foreground",
													)}
												>
													{option.label}
												</div>
												<div className="mt-0.5 text-muted-foreground text-xs">
													{option.description}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>

							<div className="border-border/60 border-t" />

							{/* Balance Filter */}
							<div className="space-y-2.5">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-foreground text-sm">
										Balance Status
									</h3>
									{localFilters.balance !== "all" && (
										<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
											Active
										</span>
									)}
								</div>
								<div className="space-y-2">
									{balanceOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() =>
												updateLocalFilter(
													"balance",
													option.value as CustomerFilters["balance"],
												)
											}
										className={cn(
											"group relative flex w-full items-start gap-3 rounded-2xl border border-border/60 p-3 text-left transition-all",
											localFilters.balance === option.value
												? "border-primary bg-primary/5"
												: "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/40",
										)}
										>
											<div
												className={cn(
													"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
													localFilters.balance === option.value
														? "border-primary bg-primary"
														: "border-muted-foreground/30 group-hover:border-primary/50",
												)}
											>
												{localFilters.balance === option.value && (
													<Check className="h-2.5 w-2.5 text-primary-foreground" />
												)}
											</div>

											<div className="min-w-0 flex-1">
												<div
													className={cn(
														"font-medium text-sm",
														localFilters.balance === option.value
															? "text-primary"
															: "text-foreground",
													)}
												>
													{option.label}
												</div>
												<div className="mt-0.5 text-muted-foreground text-xs">
													{option.description}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>

							<div className="border-border/60 border-t" />

							{/* Sort Options */}
							<div className="space-y-2.5">
								<h3 className="font-semibold text-foreground text-sm">Sort By</h3>
								<div className="grid grid-cols-3 gap-2">
									{sortOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() =>
												updateLocalFilter(
													"sortBy",
													option.value as CustomerFilters["sortBy"],
												)
											}
											className={cn(
												"flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border/60 p-2.5 transition-all",
												localFilters.sortBy === option.value
													? "border-primary bg-primary/5"
													: "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/40",
											)}
										>
											<div
												className={cn(
													"flex h-6 w-6 items-center justify-center rounded-full",
													localFilters.sortBy === option.value
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground",
												)}
											>
												{localFilters.sortBy === option.value && (
													<Check className="h-3 w-3" />
												)}
											</div>
											<div className="text-center">
												<div
													className={cn(
														"font-medium text-xs",
														localFilters.sortBy === option.value
															? "text-primary"
															: "text-foreground",
													)}
												>
													{option.label}
												</div>
												<div className="text-[10px] text-muted-foreground">
													{option.description}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Sort Order */}
							<div className="space-y-2.5">
								<h3 className="font-semibold text-foreground text-sm">
									Sort Order
								</h3>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										onClick={() => updateLocalFilter("sortOrder", "asc")}
										className={cn(
											"flex items-center gap-2.5 rounded-xl border border-border/60 p-3 transition-all",
											localFilters.sortOrder === "asc"
												? "border-primary bg-primary/5"
												: "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/40",
										)}
									>
										<ArrowUpAZ
											className={cn(
												"h-4 w-4 shrink-0",
												localFilters.sortOrder === "asc"
													? "text-primary"
													: "text-muted-foreground",
											)}
										/>
										<div className="text-left">
											<div
												className={cn(
													"font-medium text-sm",
													localFilters.sortOrder === "asc"
														? "text-primary"
														: "text-foreground",
												)}
											>
												Ascending
											</div>
											<div className="text-muted-foreground text-xs">
												A → Z, 0 → 9
											</div>
										</div>
									</button>
									<button
										type="button"
										onClick={() => updateLocalFilter("sortOrder", "desc")}
										className={cn(
											"flex items-center gap-2.5 rounded-xl border border-border/60 p-3 transition-all",
											localFilters.sortOrder === "desc"
												? "border-primary bg-primary/5"
												: "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/40",
										)}
									>
										<ArrowDownAZ
											className={cn(
												"h-4 w-4 shrink-0",
												localFilters.sortOrder === "desc"
													? "text-primary"
													: "text-muted-foreground",
											)}
										/>
										<div className="text-left">
											<div
												className={cn(
													"font-medium text-sm",
													localFilters.sortOrder === "desc"
														? "text-primary"
														: "text-foreground",
												)}
											>
												Descending
											</div>
											<div className="text-muted-foreground text-xs">
												Z → A, 9 → 0
											</div>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="border-border/60 border-t bg-background p-4">
						<Button onClick={handleApplyFilters} className="h-11 w-full font-semibold">
							<Check className="mr-2 h-4 w-4" />
							Apply Filters
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default CustomerFilters;
