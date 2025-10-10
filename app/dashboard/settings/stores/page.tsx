"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { IBranch } from "@/types/IStore";
import CustomSearchInput from "~/CustomSearchInput";

const StoreManagementPage = () => {
	const router = useRouter();
	const { user } = useAuth();
	const supabase = createClient();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: storeData, isLoading } = useQuery({
		queryKey: ["stores-with-branches", user?.id],
		queryFn: async () => {
			// Fetch stores
			const { data: stores, error: storesError } = await supabase
				.from(Tables.Stores)
				.select("*")
				.eq("ownerId", user?.id);

			if (storesError) throw storesError;

			// Fetch branches for each store
			const { data: branches, error: branchesError } = await supabase
				.from(Tables.Branches)
				.select("*")
				.eq("ownerId", user?.id)
				.order("isMain", { ascending: false });

			if (branchesError) throw branchesError;

			// Combine stores with their branches
			const storesWithBranches = stores?.map((store) => ({
				...store,
				branches: branches?.filter((branch) => branch.storeId === store.id) || [],
			})) || [];

			return storesWithBranches;
		},
		enabled: !!user?.id,
	});
	const filteredStores = storeData?.filter((store) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		return (
			store.name.toLowerCase().includes(query) ||
			store.branches.some((branch: IBranch) =>
				branch.name.toLowerCase().includes(query) ||
				branch.location.toLowerCase().includes(query)
			)
		);
	});

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
				<div className="p-3 md:p-6">
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-32 animate-pulse rounded bg-muted" />
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

			<div className="p-3 md:p-6">
				{filteredStores && filteredStores.length > 0 ? (
					<div className="space-y-6">
						{filteredStores.map((store) => (
							<div key={store.id} className="space-y-3">
								{/* Store Header */}
								<div className="flex items-center gap-2">
									<Building2 className="h-4 w-4 text-muted-foreground" />
									<h2 className="font-semibold text-lg">{store.name}</h2>
									<Badge variant="outline" className="text-xs">
										{store.branches.length} branch{store.branches.length !== 1 ? 'es' : ''}
									</Badge>
								</div>

								{/* Branches Grid */}
								{store.branches.length > 0 ? (
									<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
										{store.branches.map((branch: IBranch) => (
											<Card key={branch.id} className="transition-shadow hover:shadow-md">
												<CardContent className="p-3">
													<div className="mb-2 flex items-start justify-between gap-2">
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-1.5">
																<h3 className="truncate font-semibold text-foreground text-sm">
																	{branch.name}
																</h3>
															</div>
															<div className="mt-1 flex items-center gap-1.5 text-xs">
																<MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
																<span className="truncate text-muted-foreground">
																	{branch.location}
																</span>
															</div>
														</div>
														{branch.isMain && (
															<Badge variant="secondary" className="text-xs">
																Main
															</Badge>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<Card className="p-4 text-center">
										<div className="space-y-2">
											<Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
											<p className="text-muted-foreground text-sm">
												No branches for this store yet
											</p>
										</div>
									</Card>
								)}
							</div>
						))}
					</div>
				) : (
					<Card className="p-8 text-center">
						<div className="space-y-3">
							<Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
							<div>
								<h3 className="font-medium text-lg">
									{searchQuery.trim() ? "No stores found" : "No stores yet"}
								</h3>
								<p className="text-muted-foreground text-sm">
									{searchQuery.trim()
										? "Try adjusting your search terms"
										: "Add your first store to get started"}
								</p>
							</div>
							{!searchQuery.trim() && (
								<Button className="mt-4">
									<Plus className="mr-2 h-4 w-4" />
									Add Your First Store
								</Button>
							)}
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

export default StoreManagementPage;
