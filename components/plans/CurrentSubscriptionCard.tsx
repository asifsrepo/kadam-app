import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatSubscriptionStatus } from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface CurrentSubscriptionCardProps {
	subscription: ISubscription;
	onManageClick: () => void;
	planName: string;
}

const CurrentSubscriptionCard = ({
	subscription,
	onManageClick,
	planName,
}: CurrentSubscriptionCardProps) => {
	return (
		<Card className="border-primary/20 bg-primary/5">
			<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
				<CardTitle className="text-base md:text-lg">Current Subscription</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					You are subscribed to the {planName} plan
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2 px-3 md:space-y-2.5 md:px-6">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-xs md:text-sm">Status</span>
					<Badge variant="default" className="text-xs">
						{formatSubscriptionStatus(subscription.status)}
					</Badge>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-xs md:text-sm">Billing Period</span>
					<span className="text-foreground text-xs capitalize md:text-sm">
						{subscription.billingPeriod}
					</span>
				</div>
				{subscription.currentPeriodEnd && (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-xs md:text-sm">Renews On</span>
						<span className="text-foreground text-xs md:text-sm">
							{new Date(subscription.currentPeriodEnd).toLocaleDateString()}
						</span>
					</div>
				)}
			</CardContent>
			<CardFooter className="px-3 pt-2 pb-3 md:px-6 md:pt-3 md:pb-4">
				<Button
					onClick={onManageClick}
					variant="outline"
					className="h-9 w-full text-xs md:h-10 md:text-sm"
				>
					<ExternalLink className="mr-2 h-3 w-3 md:h-4 md:w-4" />
					Manage Subscription
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CurrentSubscriptionCard;
