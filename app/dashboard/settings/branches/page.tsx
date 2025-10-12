"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { IBranch } from "@/types/store";
import CustomSearchInput from "~/CustomSearchInput";

const BranchManagement = () => {
	const router = useRouter();
	const { user } = useAuth();
	const supabase = createClient();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: branchesData, isLoading } = useQuery({
		queryKey: [QueryKeys.Branches, user?.id],
		queryFn: async () => {
			const { data: branches, error: branchesError } = await supabase
				.from(Tables.Branches)
				.select("*")
				.eq("ownerId", user?.id)
				.order("isMain", { ascending: false });

			if (branchesError) throw branchesError;

			return {
				branches: branches || [],
			};
		},
		enabled: !!user?.id,
	});
	const filteredBranches =
		branchesData?.branches?.filter((branch: IBranch) => {
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
					<div className="flex w-full items-center gap-2">
						<CustomSearchInput
							placeholder="Search branches..."
							value={searchQuery}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setSearchQuery(e.target.value)
							}
							className="flex-1"
						/>
						<Button variant="outline" size="icon" className="shrink-0 bg-transparent">
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<div className="space-y-3 p-3 md:p-6">
				<div className="space-y-3">
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
			</div>
		</div>
	);
};

export default BranchManagement;
