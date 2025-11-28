import { IUser } from "./user";

export type SubscriptionStatus =
	| "active"
	| "cancelled"
	| "expired"
	| "on_hold"
	| "past_due"
	| "trialing";

export type SubscriptionPlan = "basic" | "pro" | "enterprise";

export type BillingPeriod = "monthly" | "yearly";

export interface ISubscription {
	id: string;
	userId: IUser["id"];
	customerId: string; // Dodo Payments customer ID
	subscriptionId: string; // Dodo Payments subscription ID
	planId: SubscriptionPlan;
	billingPeriod: BillingPeriod;
	status: SubscriptionStatus;
	currentPeriodStart: Date;
	currentPeriodEnd: Date;
	cancelAtPeriodEnd: boolean;
	cancelledAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

