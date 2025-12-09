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

/**
 * Plan limits interface
 */
export interface PlanLimits {
	maxCustomers: number | null; // null means unlimited
	maxBranches: number | null; // null means unlimited
}

/**
 * Gets the effective plan name for a user
 * Returns "basic" if no active subscription, otherwise returns the subscription plan name
 */
export const getEffectivePlanName = (subscription: ISubscription | null): SubscriptionName => {
	if (!subscription || !isSubscriptionActive(subscription)) {
		return "basic";
	}
	return subscription.planName;
};

/**
 * Gets plan limits based on the subscription
 */
export const getPlanLimits = (subscription: ISubscription | null): PlanLimits => {
	const effectivePlan = getEffectivePlanName(subscription);

	const limits: Record<SubscriptionName, PlanLimits> = {
		basic: {
			maxCustomers: 10,
			maxBranches: 1,
		},
		pro: {
			maxCustomers: null, // unlimited
			maxBranches: null, // unlimited
		},
		enterprise: {
			maxCustomers: null, // unlimited
			maxBranches: null, // unlimited
		},
	};

	return limits[effectivePlan];
};

/**
 * Checks if user can create a new customer based on their plan limits
 */
export const canCreateCustomer = (
	subscription: ISubscription | null,
	currentCustomerCount: number,
): boolean => {
	const limits = getPlanLimits(subscription);

	// If maxCustomers is null, it's unlimited
	if (limits.maxCustomers === null) {
		return true;
	}

	return currentCustomerCount < limits.maxCustomers;
};

/**
 * Checks if user can create a new branch based on their plan limits
 */
export const canCreateBranch = (
	subscription: ISubscription | null,
	currentBranchCount: number,
): boolean => {
	const limits = getPlanLimits(subscription);

	// If maxBranches is null, it's unlimited
	if (limits.maxBranches === null) {
		return true;
	}

	return currentBranchCount < limits.maxBranches;
};
