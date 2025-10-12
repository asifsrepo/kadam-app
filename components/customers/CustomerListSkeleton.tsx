import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CustomerListSkeleton = () => {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: 8 }).map((_, index) => (
				<Card key={index}>
					<CardContent className="p-3">
						<div className="mb-2 flex items-start justify-between gap-2">
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-1.5">
									<Skeleton className="h-4 w-20" />
								</div>
								<div className="mt-1 space-y-0.5">
									<div className="flex items-center gap-1.5">
										<Skeleton className="h-3 w-3 shrink-0" />
										<Skeleton className="h-3 w-16" />
									</div>
									<div className="flex items-center gap-1.5">
										<Skeleton className="h-3 w-3 shrink-0" />
										<Skeleton className="h-3 w-20" />
									</div>
								</div>
							</div>
							<div className="flex shrink-0 items-start gap-1">
								<Skeleton className="h-8 w-8" />
								<Skeleton className="h-8 w-8" />
							</div>
						</div>

						{/* Balance Section */}
						<div className="mt-3 rounded-lg border p-2">
							<div className="text-center">
								<Skeleton className="mx-auto h-2.5 w-12" />
								<Skeleton className="mx-auto mt-1 h-6 w-16" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default CustomerListSkeleton;
