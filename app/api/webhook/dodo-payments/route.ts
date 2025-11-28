import { Webhooks } from "@dodopayments/nextjs";
import { DODO_PAYMENTS_WEBHOOK_SECRET } from "@/config";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types";

type WebhookPayload = any;

const updateSubscriptionInDB = async (payload: WebhookPayload) => {
	const supabase = await createClient();

	// Extract subscription data from payload
	// The payload structure depends on Dodo Payments API
	const subscriptionData = payload.data as any;

	if (!subscriptionData?.subscription_id || !subscriptionData?.customer_id) {
		console.error("Missing subscription_id or customer_id in webhook payload");
		return;
	}

	// Handle null values by converting to undefined
	const subscriptionId = subscriptionData.subscription_id ?? undefined;
	const customerId = subscriptionData.customer_id ?? undefined;

	if (!subscriptionId || !customerId) {
		console.error("Invalid subscription_id or customer_id in webhook payload");
		return;
	}

	// Map Dodo Payments status to our status enum
	const statusMap: Record<string, string> = {
		active: "active",
		cancelled: "cancelled",
		expired: "expired",
		on_hold: "on_hold",
		past_due: "past_due",
		trialing: "trialing",
	};

	const status = statusMap[subscriptionData.status] || "active";

	// Get userId from metadata (set during checkout) or look up existing subscription
	let userId = subscriptionData.metadata?.user_id;

	if (!userId) {
		// Try to find existing subscription to get userId
		const { data: existingSubscription } = await supabase
			.from(Tables.Subscriptions)
			.select("userId")
			.eq("subscriptionId", subscriptionData.subscription_id)
			.single();

		if (existingSubscription?.userId) {
			userId = existingSubscription.userId;
		} else {
			console.error("Could not determine userId for subscription:", subscriptionData.subscription_id);
			return;
		}
	}

	// Determine plan from product_id or metadata
	// This assumes you'll store plan info in metadata or product mapping
	const planId = subscriptionData.metadata?.plan_id || "basic";
	const billingPeriod =
		subscriptionData.metadata?.billing_period || subscriptionData.interval || "monthly";

	// Upsert subscription
	const subscriptionRecord = {
		userId,
		subscriptionId: subscriptionId,
		customerId: customerId,
		status,
		currentPeriodStart: subscriptionData.current_period_start
			? new Date(subscriptionData.current_period_start * 1000)
			: new Date(),
		currentPeriodEnd: subscriptionData.current_period_end
			? new Date(subscriptionData.current_period_end * 1000)
			: new Date(),
		cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? false,
		cancelledAt: subscriptionData.cancelled_at
			? new Date(subscriptionData.cancelled_at * 1000)
			: null,
		planId,
		billingPeriod,
		updatedAt: new Date(),
	};

	const { error } = await supabase.from(Tables.Subscriptions).upsert(subscriptionRecord, {
		onConflict: "subscriptionId",
	});

	if (error) {
		console.error("Error updating subscription in database:", error);
		throw error;
	}
};

export const POST = Webhooks({
	webhookKey: DODO_PAYMENTS_WEBHOOK_SECRET,
	onPayload: async (payload: WebhookPayload) => {
		console.log("Webhook payload received:", payload.type);
		await updateSubscriptionInDB(payload);
	},
	onPaymentSucceeded: async (payload: WebhookPayload) => {
		console.log("Payment succeeded:", payload);
		await updateSubscriptionInDB(payload);
	},
	onPaymentFailed: async (payload: WebhookPayload) => {
		console.log("Payment failed:", payload);
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionActive: async (payload: WebhookPayload) => {
		console.log("Subscription active:", payload);
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionCancelled: async (payload: WebhookPayload) => {
		console.log("Subscription cancelled:", payload);
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionRenewed: async (payload: WebhookPayload) => {
		console.log("Subscription renewed:", payload);
		await updateSubscriptionInDB(payload);
	},
	onSubscriptionExpired: async (payload: WebhookPayload) => {
		console.log("Subscription expired:", payload);
		await updateSubscriptionInDB(payload);
	},
});

