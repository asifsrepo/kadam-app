import { Badge } from "@/components/ui/badge";
import { getPlanDisplayName } from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface CurrentPlanSectionProps {
	subscription: ISubscription | null;
}

const CurrentPlanSection = ({ subscription }: CurrentPlanSectionProps) => {
	if (!subscription) return null;

	const planName = getPlanDisplayName(subscription.planName);
	const billingPeriod = subscription.billingPeriod;

	return (
		<div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 md:gap-3 md:px-4 md:py-3">
			<span className="text-muted-foreground text-xs md:text-sm">Current Plan:</span>
			<Badge variant="default" className="text-xs">
				{planName}
			</Badge>
			<span className="text-muted-foreground text-xs capitalize md:text-sm">
				({billingPeriod})
			</span>
		</div>
	);
};

export default CurrentPlanSection;

