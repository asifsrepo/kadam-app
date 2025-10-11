"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, MapPin, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { IBranch } from "@/types/store";
import CustomSearchInput from "~/CustomSearchInput";

const StoreManagementPage = () => {
	const router = useRouter();
	const { user } = useAuth();
	const supabase = createClient();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: storeData, isLoading } = useQuery({
		queryKey: ["store-with-branches", user?.id],
		queryFn: async () => {
			const { data: store, error: storeError } = await supabase
				.from(Tables.Stores)
				.select("*")
				.eq("ownerId", user?.id)
				.limit(1);

			if (storeError) throw storeError;

			const { data: branches, error: branchesError } = await supabase
				.from(Tables.Branches)
				.select("*")
				.eq("ownerId", user?.id)
				.eq("storeId", store?.[0]?.id)
				.order("isMain", { ascending: false });

			if (branchesError) throw branchesError;

			return {
				store: store ? store[0] : null,
				branches: branches || [],
			};
		},
		enabled: !!user?.id,
	});
	const filteredBranches =
		storeData?.branches?.filter((branch: IBranch) => {
			if (!searchQuery.trim()) return true;
			const query = searchQuery.toLowerCase();
			return (
				branch.name.toLowerCase().includes(query) ||
				branch.location.toLowerCase().includes(query)
			);
		}) || [];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background pb-24">
				<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="px-3 py-3 md:px-6 md:py-4">
						<div className="mb-2 flex items-center gap-3 md:mb-3">
							<div className="h-8 w-8 animate-pulse rounded bg-muted md:h-9 md:w-9" />
							<div className="h-6 w-32 animate-pulse rounded bg-muted md:h-8" />
						</div>
						<div className="h-10 w-full animate-pulse rounded bg-muted" />
					</div>
				</div>
				<div className="space-y-3 p-3 md:p-6">
					<div className="h-20 animate-pulse rounded bg-muted" />
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-16 animate-pulse rounded bg-muted" />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-3 py-3 md:px-6 md:py-4">
					<div className="mb-2 flex items-center gap-3 md:mb-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.back()}
							className="h-8 w-8 md:h-9 md:w-9"
						>
							<ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
							<span className="sr-only">Go back</span>
						</Button>
						<h1 className="font-semibold text-lg md:text-2xl">Store Branches</h1>
					</div>
					<CustomSearchInput
						placeholder="Search branches..."
						value={searchQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchQuery(e.target.value)
						}
						className="w-full"
					/>
				</div>
			</div>

			<div className="space-y-3 p-3 md:p-6">
				{storeData?.store && (
					<div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<div className="mb-2 flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-primary" />
									<CardTitle className="truncate font-semibold text-lg">
										{storeData.store.name}
									</CardTitle>
								</div>
								<div className="space-y-1.5">
									<div className="flex items-center gap-2 text-sm">
										<Phone className="h-3.5 w-3.5 text-primary/70" />
										<span className="text-muted-foreground">
											{storeData.store.phone}
										</span>
									</div>
								</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 border-primary/20 hover:bg-primary/10"
							>
								<Edit className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}

				{storeData?.store && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
								<h2 className="font-semibold text-base">Branches</h2>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 border-primary/20 hover:bg-primary/10"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredBranches.map((branch: IBranch) => (
								<Card
									key={branch.id}
									className="border-border/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
								>
									<CardContent className="p-3">
										<div className="space-y-2">
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0 flex-1">
													<h3 className="truncate font-semibold text-foreground text-sm">
														{branch.name}
													</h3>
												</div>
												{branch.isMain && (
													<Badge
														variant="secondary"
														className="border-primary/20 bg-primary/10 text-primary text-xs"
													>
														Main
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-2 text-xs">
												<MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate text-muted-foreground">
													{branch.location}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StoreManagementPage;
