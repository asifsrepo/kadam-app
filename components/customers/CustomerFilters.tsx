"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
	const [showFilters, setShowFilters] = useState(false);

	const updateFilter = <K extends keyof CustomerFilters>(key: K, value: CustomerFilters[K]) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const handleClearFilters = () => {
		onClearFilters();
		setShowFilters(false);
	};

	return (
		<>
			{/* Filter Toggle Button */}
			<Button
				variant={hasActiveFilters ? "default" : "outline"}
				size="sm"
				onClick={() => setShowFilters(!showFilters)}
				className="relative h-9 gap-2 px-3"
			>
				<Filter className="h-4 w-4" />
				<span className="hidden sm:inline">Filter</span>
				{hasActiveFilters && (
					<div className="-right-1 -top-1 absolute h-3 w-3 rounded-full bg-destructive" />
				)}
			</Button>

			{/* Filter Options Panel */}
			{showFilters && (
				<div className="mt-3 space-y-4 rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-card-foreground text-sm">
							Filter & Sort Options
						</h3>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClearFilters}
								className="h-8 gap-1 text-muted-foreground text-xs hover:text-foreground"
							>
								<X className="h-3 w-3" />
								Clear
							</Button>
						)}
					</div>

					{/* Status Filter */}
					<div className="space-y-2">
						<label className="font-medium text-card-foreground text-sm">Status</label>
						<RadioGroup
							value={filters.status}
							onValueChange={(value) =>
								updateFilter("status", value as CustomerFilters["status"])
							}
							className="flex flex-wrap gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="all" id="status-all" />
								<label htmlFor="status-all" className="font-normal text-sm">
									All
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="active" id="status-active" />
								<label htmlFor="status-active" className="font-normal text-sm">
									Active
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="inactive" id="status-inactive" />
								<label htmlFor="status-inactive" className="font-normal text-sm">
									Inactive
								</label>
							</div>
						</RadioGroup>
					</div>

					{/* Balance Filter */}
					<div className="space-y-2">
						<label className="font-medium text-card-foreground text-sm">Balance</label>
						<RadioGroup
							value={filters.balance}
							onValueChange={(value) =>
								updateFilter("balance", value as CustomerFilters["balance"])
							}
							className="flex flex-wrap gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="all" id="balance-all" />
								<label htmlFor="balance-all" className="font-normal text-sm">
									All
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="positive" id="balance-positive" />
								<label htmlFor="balance-positive" className="font-normal text-sm">
									Owes Money
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="negative" id="balance-negative" />
								<label htmlFor="balance-negative" className="font-normal text-sm">
									Has Credit
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="zero" id="balance-zero" />
								<label htmlFor="balance-zero" className="font-normal text-sm">
									Zero Balance
								</label>
							</div>
						</RadioGroup>
					</div>

					{/* Sort Options */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-medium text-card-foreground text-sm">
								Sort By
							</label>
							<Select
								value={filters.sortBy}
								onValueChange={(value) =>
									updateFilter("sortBy", value as CustomerFilters["sortBy"])
								}
							>
								<SelectTrigger className="h-9">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="createdAt">Date Added</SelectItem>
									<SelectItem value="balance">Balance</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between space-x-2">
							<label
								htmlFor="sort-order"
								className="font-medium text-card-foreground text-sm"
							>
								Descending
							</label>
							<Switch
								id="sort-order"
								checked={filters.sortOrder === "desc"}
								onCheckedChange={(checked) =>
									updateFilter("sortOrder", checked ? "desc" : "asc")
								}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CustomerFilters;
