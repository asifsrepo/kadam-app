import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const TransactionsSkeleton = () => {
	return (
		<Card className="border-border/60">
			<CardContent className="space-y-2 p-4">
				<h3 className="mb-2 font-medium text-foreground text-sm">Transactions</h3>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-16 w-full" />
				))}
			</CardContent>
		</Card>
	);
};
export default TransactionsSkeleton;
