import { AlertTriangle, ExternalLink } from "lucide-react";
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
import { cn } from "@/lib/utils";
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
	const status = subscription.status;
	const isPastDue = status === "past_due";
	const isOnHold = status === "on_hold";
	const isExpired = status === "expired";
	const isTrouble = isPastDue || isOnHold || isExpired;

	const getStatusBadgeVariant = () => {
		if (isPastDue || isOnHold) return "destructive";
		if (isExpired) return "secondary";
		return "default";
	};

	const getCardStyling = () => {
		if (isPastDue || isOnHold) {
			return "border-destructive/20 bg-destructive/5";
		}
		if (isExpired) {
			return "border-muted bg-muted/30";
		}
		return "border-primary/20 bg-primary/5";
	};

	const getWarningMessage = () => {
		if (isPastDue) {
			return "Your payment failed. Please update your payment method to continue service.";
		}
		if (isOnHold) {
			return "Your subscription is on hold. Please contact support or update your payment method.";
		}
		if (isExpired) {
			return "Your subscription has expired. Please renew to continue using the service.";
		}
		return null;
	};

	return (
		<Card className={cn("border-border/60 bg-card", getCardStyling())}>
			<CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4">
				<CardTitle className="text-base md:text-lg">Current Subscription</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					You are subscribed to the {planName} plan
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2 px-4 md:space-y-2.5 md:px-6">
				{isTrouble && getWarningMessage() && (
					<div className="flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-2.5 md:p-3">
						<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive md:h-5 md:w-5" />
						<p className="text-destructive text-xs leading-relaxed md:text-sm">
							{getWarningMessage()}
						</p>
					</div>
				)}
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-xs md:text-sm">Status</span>
					<Badge variant={getStatusBadgeVariant()} className="text-xs">
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
			<CardFooter className="px-4 pt-2 pb-4 md:px-6 md:pt-3 md:pb-4">
				<Button
					onClick={onManageClick}
					variant="outline"
					className="h-11 w-full text-xs md:h-11 md:text-sm"
				>
					<ExternalLink className="mr-2 h-3 w-3 md:h-4 md:w-4" />
					Manage Subscription
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CurrentSubscriptionCard;
