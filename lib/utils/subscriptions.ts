import type { ISubscription, SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

/**
 * Maps plan ID and billing period to Dodo Payments product ID
 * This should match the product IDs configured in Dodo Payments dashboard
 */
export const getPlanProductId = (planId: SubscriptionPlan, isYearly: boolean): string => {
	const period = isYearly ? "yearly" : "monthly";
	return `${planId}_${period}`;
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

/**
 * Gets the plan display name
 */
export const getPlanDisplayName = (planId: SubscriptionPlan): string => {
	const planNames: Record<SubscriptionPlan, string> = {
		basic: "Basic",
		pro: "Pro",
		enterprise: "Enterprise",
	};
	return planNames[planId] || planId;
};

