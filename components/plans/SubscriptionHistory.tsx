import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSubscriptionStatus, getPlanDisplayName } from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface SubscriptionHistoryProps {
	subscriptions: ISubscription[];
	formatPrice: (price: number) => string;
}

const SubscriptionHistory = ({ subscriptions, formatPrice }: SubscriptionHistoryProps) => {
	if (subscriptions.length === 0) {
		return (
			<Card className="border-border">
				<CardContent className="px-3 py-6 md:px-6 md:py-8">
					<p className="text-center text-muted-foreground text-xs md:text-sm">
						No subscription history found.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3 md:space-y-4">
			{subscriptions.map((sub) => (
				<Card key={sub.id} className="border-border">
					<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
						<div className="flex items-start justify-between">
							<div className="min-w-0 flex-1">
								<CardTitle className="text-base md:text-lg">
									{getPlanDisplayName(sub.planName)} Plan
								</CardTitle>
								<CardDescription className="text-xs md:text-sm">
									{new Date(sub.createdAt).toLocaleDateString()}
								</CardDescription>
							</div>
							<Badge
								variant={
									sub.status === "active" || sub.status === "trialing"
										? "default"
										: "secondary"
								}
								className="text-xs"
							>
								{formatSubscriptionStatus(sub.status)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-2 px-3 md:space-y-2.5 md:px-6">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs md:text-sm">Price</span>
							<span className="font-medium text-foreground text-xs md:text-sm">
								{formatPrice(sub.price)} / {sub.billingPeriod}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs md:text-sm">
								Billing Period
							</span>
							<span className="text-foreground text-xs capitalize md:text-sm">
								{sub.billingPeriod}
							</span>
						</div>
						{sub.currentPeriodStart && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-xs md:text-sm">
									Period Start
								</span>
								<span className="text-foreground text-xs md:text-sm">
									{new Date(sub.currentPeriodStart).toLocaleDateString()}
								</span>
							</div>
						)}
						{sub.currentPeriodEnd && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-xs md:text-sm">
									Period End
								</span>
								<span className="text-foreground text-xs md:text-sm">
									{new Date(sub.currentPeriodEnd).toLocaleDateString()}
								</span>
							</div>
						)}
						{sub.cancelledAt && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-xs md:text-sm">
									Cancelled On
								</span>
								<span className="text-foreground text-xs md:text-sm">
									{new Date(sub.cancelledAt).toLocaleDateString()}
								</span>
							</div>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default SubscriptionHistory;
