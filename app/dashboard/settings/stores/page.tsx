"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Edit, MapPin, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	const filteredBranches = storeData?.branches?.filter((branch: IBranch) => {
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
				<div className="p-3 md:p-6 space-y-4">
					<div className="h-32 animate-pulse rounded bg-muted" />
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-24 animate-pulse rounded bg-muted" />
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

			<div className="p-3 md:p-6 space-y-4">
				{/* Store Details Card */}
				{storeData?.store ? (
					<Card className="transition-shadow hover:shadow-md">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5 text-muted-foreground" />
									<CardTitle className="text-lg">{storeData.store.name}</CardTitle>
								</div>
								<Button variant="outline" size="sm" className="h-8 px-3 text-xs">
									<Edit className="mr-1 h-3 w-3" />
									Edit Store
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-sm">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">{storeData.store.phone}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Badge variant="outline" className="text-xs">
									{storeData.branches.length} branch{storeData.branches.length !== 1 ? 'es' : ''}
								</Badge>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="p-6 text-center">
						<div className="space-y-3">
							<Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
							<div>
								<h3 className="font-medium text-lg">No store setup yet</h3>
								<p className="text-muted-foreground text-sm">
									Set up your store to start managing branches
								</p>
							</div>
							<Button className="mt-4">
								<Plus className="mr-2 h-4 w-4" />
								Setup Your Store
							</Button>
						</div>
					</Card>
				)}

				{/* Branches Section */}
				{storeData?.store && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-lg">Branches</h2>
							<Button size="sm" className="h-8 px-3 text-xs">
								<Plus className="mr-1 h-3 w-3" />
								Add Branch
							</Button>
						</div>

						{filteredBranches.length > 0 ? (
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{filteredBranches.map((branch: IBranch) => (
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
							<Card className="p-6 text-center">
								<div className="space-y-3">
									<Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
									<div>
										<h3 className="font-medium text-base">
											{searchQuery.trim() ? "No branches found" : "No branches yet"}
										</h3>
										<p className="text-muted-foreground text-sm">
											{searchQuery.trim()
												? "Try adjusting your search terms"
												: "Add your first branch to get started"}
										</p>
									</div>
									{!searchQuery.trim() && (
										<Button size="sm" className="mt-2">
											<Plus className="mr-2 h-4 w-4" />
											Add Your First Branch
										</Button>
									)}
								</div>
							</Card>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default StoreManagementPage;
