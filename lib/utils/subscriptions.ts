import type { ISubscription, SubscriptionName, SubscriptionStatus } from "@/types/subscription";

/**
 * Gets the plan display name
 */
export const getPlanDisplayName = (planName: SubscriptionName): string => {
	const planNames: Record<SubscriptionName, string> = {
		basic: "Basic",
		pro: "Pro",
		enterprise: "Enterprise",
	};
	return planNames[planName] || planName;
};

/**
 * Formats subscription status for display
 */
export const formatSubscriptionStatus = (status: SubscriptionStatus): string => {
	const statusMap: Record<SubscriptionStatus, string> = {
		active: "Active",
		cancelled: "Cancelled",
		expired: "Expired",
		on_hold: "On Hold",
		past_due: "Past Due",
		trialing: "Trial",
		upgraded: "Upgraded",
		downgraded: "Downgraded",
	};
	return statusMap[status] || status;
};

/**
 * Checks if a subscription is currently active
 */
export const isSubscriptionActive = (subscription: ISubscription | null): boolean => {
	if (!subscription) return false;
	return subscription.status === "active" || subscription.status === "trialing";
};

/**
 * Checks if subscription is cancelled but still active until period end
 */
export const isCancellingAtPeriodEnd = (subscription: ISubscription | null): boolean => {
	if (!subscription) return false;
	return subscription.cancelAtPeriodEnd && subscription.status === "active";
};
