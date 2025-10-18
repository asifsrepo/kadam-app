"use client";

import { useQuery } from "@tanstack/react-query";
import { Phone, Store } from "lucide-react";
import EditStoreDialog from "@/components/stores/EditStoreDialog";
import { CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
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
				.single();

			if (storeError) throw storeError;

			return { store };
		},
		enabled: !!user?.id,
	});

	const isSettings = variant === "settings";

	if (isLoading) {
		return (
			<div
				className={cn(
					"rounded-lg border p-3.5 md:p-4",
					isSettings
						? "border-border bg-card"
						: "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10",
				)}
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
							<div className="h-5 w-32 animate-pulse rounded bg-muted md:h-6" />
						</div>
						<div className="space-y-1.5">
							<div className="h-3.5 w-28 animate-pulse rounded bg-muted md:h-4" />
							<div className="h-3.5 w-24 animate-pulse rounded bg-muted md:h-4" />
						</div>
					</div>
					<div className="h-8 w-8 shrink-0 animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}

	if (!storeData?.store) {
		return null;
	}

	const { store } = storeData;

	return (
		<div
			className={cn(
				"rounded-lg border p-3.5 md:p-4",
				isSettings
					? "border-border bg-card"
					: "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10",
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="mb-1.5 flex items-center gap-2 md:mb-2">
						<div
							className={cn(
								"h-2 w-2 shrink-0 rounded-full",
								isSettings ? "bg-muted-foreground/60" : "bg-primary",
							)}
						/>
						<CardTitle
							className={cn(
								"truncate font-semibold",
								isSettings
									? "text-sm text-card-foreground md:text-base"
									: "text-base md:text-lg",
							)}
						>
							{store.name}
						</CardTitle>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs md:text-sm">
							<Phone
								className={cn(
									"h-3.5 w-3.5 shrink-0",
									isSettings ? "text-muted-foreground" : "text-primary/70",
								)}
							/>
							<span className="truncate text-muted-foreground">{store.phone}</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs md:text-sm">
							<Store className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							<span className="truncate text-muted-foreground">ID: {store.storeId}</span>
						</div>
					</div>
				</div>
				<div className="shrink-0">
					<EditStoreDialog
						storeName={store.name}
						storePhone={store.phone}
						storeId={store.id}
					/>
				</div>
			</div>
		</div>
	);
};

export default ShopInfo;