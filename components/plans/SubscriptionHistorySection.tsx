import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ISubscription } from "@/types/subscription";
import SubscriptionHistory from "./SubscriptionHistory";

interface SubscriptionHistorySectionProps {
	onChangePlanClick: () => void;
	isHistoryLoading: boolean;
	subscriptionHistory: ISubscription[];
	formatPrice: (price: number) => string;
}

const SubscriptionHistorySection = ({
	onChangePlanClick,
	isHistoryLoading,
	subscriptionHistory,
	formatPrice,
}: SubscriptionHistorySectionProps) => {
	return (
		<>
			<div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 md:p-4">
				<div className="min-w-0 flex-1">
					<h3 className="font-semibold text-sm md:text-base">Subscription History</h3>
					<p className="text-muted-foreground text-xs md:text-sm">
						View all your past and current subscriptions
					</p>
				</div>
				<Button
					onClick={onChangePlanClick}
					variant="outline"
					className="h-9 shrink-0 text-xs md:h-10 md:text-sm"
				>
					Change Plan
				</Button>
			</div>

			{isHistoryLoading ? (
				<Card className="border-border">
					<CardContent className="px-3 py-6 md:px-6 md:py-8">
						<p className="text-center text-muted-foreground text-xs md:text-sm">
							Loading subscription history...
						</p>
					</CardContent>
				</Card>
			) : (
				<SubscriptionHistory
					subscriptions={subscriptionHistory}
					formatPrice={formatPrice}
				/>
			)}
		</>
	);
};

export default SubscriptionHistorySection;
