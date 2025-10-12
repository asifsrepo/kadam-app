"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, Phone } from "lucide-react";
import EditStoreDialog from "@/components/stores/EditStoreDialog";
import { CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency } from "@/lib/utils";
import { QueryKeys, Tables } from "@/types";

interface ShopInfoProps {
	variant?: "default" | "settings";
}

const ShopInfo = ({ variant = "default" }: ShopInfoProps) => {
	const { user } = useAuth();
	const supabase = createClient();

	const { data: storeData, isLoading } = useQuery({
		queryKey: [QueryKeys.StoreWithBranches, user?.id],
		queryFn: async () => {
			const { data: store, error: storeError } = await supabase
				.from(Tables.Stores)
				.select("*")
				.eq("ownerId", user?.id)
				.limit(1);

			if (storeError) throw storeError;

			return {
				store: store ? store[0] : null,
			};
		},
		enabled: !!user?.id,
	});

	if (isLoading) {
		return (
			<div
				className={cn(
					"rounded-lg border p-4",
					variant === "settings"
						? "border-border bg-card"
						: "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10",
				)}
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
						<div className="mb-2 flex items-center gap-2">
							<div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
						</div>
						<div className="space-y-1.5">
							<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							<div className="h-4 w-20 animate-pulse rounded bg-muted" />
							<div className="h-4 w-16 animate-pulse rounded bg-muted" />
						</div>
					</div>
					<div className="h-8 w-8 animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}

	if (!storeData?.store) {
		return null;
	}

	return (
		<div
			className={cn(
				"rounded-lg border p-4",
				variant === "settings"
					? "border-border bg-card"
					: "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10",
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-center gap-2">
						<div
							className={cn(
								"h-2 w-2 rounded-full",
								variant === "settings" ? "bg-muted-foreground/60" : "bg-primary",
							)}
						/>
						<CardTitle
							className={cn(
								"truncate font-semibold",
								variant === "settings"
									? "text-base text-card-foreground"
									: "text-lg",
							)}
						>
							{storeData.store.name}
						</CardTitle>
					</div>
					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-sm">
							<Phone
								className={cn(
									"h-3.5 w-3.5",
									variant === "settings"
										? "text-muted-foreground"
										: "text-primary/70",
								)}
							/>
							<span className="text-muted-foreground">{storeData.store.phone}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<CreditCard
								className={cn(
									"h-3.5 w-3.5",
									variant === "settings"
										? "text-muted-foreground"
										: "text-primary/70",
								)}
							/>
							<span className="text-muted-foreground">
								Debt Limit: {formatCurrency(storeData.store.debtLimit || 0)}
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">
								ID: {storeData.store.storeId}
							</span>
						</div>
					</div>
				</div>
				<EditStoreDialog
					storeName={storeData.store.name}
					storePhone={storeData.store.phone}
					storeId={storeData.store.id}
					storeDebtLimit={storeData.store.debtLimit}
				/>
			</div>
		</div>
	);
};

export default ShopInfo;
