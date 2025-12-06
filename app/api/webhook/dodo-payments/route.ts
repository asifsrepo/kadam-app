import { Webhooks } from "@dodopayments/nextjs";
import { DODO_PAYMENTS_WEBHOOK_SECRET } from "@/config";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types";

type WebhookPayload = any;

const updateSubscriptionInDB = async (payload: WebhookPayload) => {
	console.log("Payload received:", payload);

	const supabase = await createClient();

	const eventData = payload.data as any;
	const eventType = payload.type as string;

	const subscriptionId = eventData.subscription_id;

	const customerId = eventData.customer?.customer_id;

	let userId = eventData.metadata?.user_id ?? eventData.metadata?.user_id ?? undefined;

	if (!subscriptionId) {
		return;
	}

	const statusMap: Record<string, string> = {
		active: "active",
		cancelled: "cancelled",
		expired: "expired",
		on_hold: "on_hold",
		past_due: "past_due",
		trialing: "trialing",
		upgraded: "upgraded",
		downgraded: "downgraded",
		failed: "cancelled",
		pending: "active",
	};

	let status = "active";
	if (eventType?.includes("subscription")) {
		status = statusMap[eventData.status] || "active";
	} else if (eventType === "payment.succeeded" && eventData.subscription_id) {
		status = "active";
	} else {
		status = statusMap[eventData.status] || "active";
	}

	if (!userId) {
		const { data: existingSubscription } = await supabase
			.from(Tables.Subscriptions)
			.select("userId")
			.eq("subscriptionId", subscriptionId)
			.single();

		userId = existingSubscription?.userId;
	}

	const planNameFromMetadata = eventData.metadata?.plan_name;
	const billingPeriodFromMetadata = eventData.metadata?.billing_period;

	const productId = eventData.product_id;

	// Validate planName - should be "basic", "pro", or "enterprise"
	const validPlanNames = ["basic", "pro", "enterprise"];
	const planName =
		planNameFromMetadata && validPlanNames.includes(planNameFromMetadata)
			? planNameFromMetadata
			: "basic";

	const billingPeriod = billingPeriodFromMetadata || "monthly";

	// Check if this subscription already exists to determine if it's new
	const { data: existingSubscription } = await supabase
		.from(Tables.Subscriptions)
		.select("id, status, price")
		.eq("subscriptionId", subscriptionId)
		.single();

	const isNewSubscription = !existingSubscription;

	// Extract price from webhook payload
	// For subscription events: use recurring_pre_tax_amount (in cents)
	// For payment events: use total_amount or settlement_amount (in cents)
	// Convert from cents to dollars
	let priceFromWebhook = 0;
	if (eventData.recurring_pre_tax_amount) {
		// Subscription event - price is in cents
		priceFromWebhook = eventData.recurring_pre_tax_amount / 100;
	} else if (eventData.total_amount) {
		// Payment event - total_amount is in cents
		priceFromWebhook = eventData.total_amount / 100;
	} else if (eventData.settlement_amount) {
		// Payment event - settlement_amount is in cents
		priceFromWebhook = eventData.settlement_amount / 100;
	}

	// If this is a new active subscription, update old subscriptions based on upgrade/downgrade
	// This ensures only one active subscription per user
	if (isNewSubscription && status === "active" && userId) {
		// Get all existing active subscriptions for this user
		const { data: existingActiveSubscriptions } = await supabase
			.from(Tables.Subscriptions)
			.select("id, planName, subscriptionId")
			.eq("userId", userId)
			.in("status", ["active", "trialing"])
			.neq("subscriptionId", subscriptionId);

		if (existingActiveSubscriptions && existingActiveSubscriptions.length > 0) {
			// Plan tier mapping: basic = 1, pro = 2, enterprise = 3
			const planTierMap: Record<string, number> = {
				basic: 1,
				pro: 2,
				enterprise: 3,
			};

			const newPlanTier = planTierMap[planName] || 0;

			// Update each existing subscription based on tier comparison
			for (const oldSubscription of existingActiveSubscriptions) {
				const oldPlanTier = planTierMap[oldSubscription.planName] || 0;
				let newStatus: string;

				if (newPlanTier > oldPlanTier) {
					// New plan is higher tier - old subscription was upgraded
					newStatus = "upgraded";
				} else if (newPlanTier < oldPlanTier) {
					// New plan is lower tier - old subscription was downgraded
					newStatus = "downgraded";
				} else {
					// Same tier - just cancelled (billing period change or other reason)
					newStatus = "cancelled";
				}

				await supabase
					.from(Tables.Subscriptions)
					.update({
						status: newStatus,
						updatedAt: new Date(),
					})
					.eq("subscriptionId", oldSubscription.subscriptionId);
			}
		}
	}

	// Extract period dates from webhook payload
	// For subscription events: use previous_billing_date and next_billing_date
	// For payment events: may not have these fields, so calculate from billing_period
	let currentPeriodStart: Date;
	let currentPeriodEnd: Date;

	if (eventData.previous_billing_date && eventData.next_billing_date) {
		// Subscription event - use the dates from webhook
		currentPeriodStart = new Date(eventData.previous_billing_date);
		currentPeriodEnd = new Date(eventData.next_billing_date);
	} else if (eventData.created_at) {
		// Payment event or fallback - calculate from created_at and billing_period
		currentPeriodStart = new Date(eventData.created_at);
		const periodStart = new Date(currentPeriodStart);
		
		if (billingPeriod === "yearly") {
			periodStart.setFullYear(periodStart.getFullYear() + 1);
		} else {
			periodStart.setMonth(periodStart.getMonth() + 1);
		}
		currentPeriodEnd = periodStart;
	} else {
		// Final fallback
		currentPeriodStart = new Date();
		const periodStart = new Date();
		if (billingPeriod === "yearly") {
			periodStart.setFullYear(periodStart.getFullYear() + 1);
		} else {
			periodStart.setMonth(periodStart.getMonth() + 1);
		}
		currentPeriodEnd = periodStart;
	}

	// Extract cancelled_at date
	const cancelledAt = eventData.cancelled_at
		? new Date(eventData.cancelled_at)
		: null;

	// Determine price: use existing price if subscription exists, otherwise use webhook price
	// This preserves the original subscription price even if prices change
	const price =
		existingSubscription?.price && existingSubscription.price > 0
			? existingSubscription.price
			: priceFromWebhook > 0
				? priceFromWebhook
				: 0;

	const subscriptionRecord: any = {
		subscriptionId: subscriptionId,
		customerId: customerId || undefined,
		productId: productId || undefined,
		planName,
		billingPeriod,
		status,
		price,
		currentPeriodStart,
		currentPeriodEnd,
		cancelAtPeriodEnd: eventData.cancel_at_next_billing_date ?? false,
		cancelledAt,
		updatedAt: new Date(),
	};

	if (userId) {
		subscriptionRecord.userId = userId;
	}

	const { error } = await supabase.from(Tables.Subscriptions).upsert(subscriptionRecord, {
		onConflict: "subscriptionId",
	});

	if (error) {
		console.error("Error updating subscription in database:", error);
		console.error("Subscription record:", subscriptionRecord);
		throw error;
	}
};

export const POST = Webhooks({
	webhookKey: DODO_PAYMENTS_WEBHOOK_SECRET,
	onPayload: async (payload: WebhookPayload) => {
		console.log("Webhook payload received");
		await updateSubscriptionInDB(payload);
	},
	onPaymentSucceeded: async (payload: WebhookPayload) => {
		console.log("Payment succeeded");
		await updateSubscriptionInDB(payload);
	},
	onPaymentFailed: async (payload: WebhookPayload) => {
		console.log("Payment failed");
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionActive: async (payload: WebhookPayload) => {
		console.log("Subscription active");
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionCancelled: async (payload: WebhookPayload) => {
		console.log("Subscription cancelled");
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionRenewed: async (payload: WebhookPayload) => {
		console.log("Subscription renewed");
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionExpired: async (payload: WebhookPayload) => {
		console.log("Subscription expired");
		await updateSubscriptionInDB(payload);
	},
});
