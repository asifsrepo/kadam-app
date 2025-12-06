import { Webhooks } from "@dodopayments/nextjs";
import { DODO_PAYMENTS_WEBHOOK_SECRET } from "@/config";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types";

type WebhookPayload = any;

const updateSubscriptionInDB = async (payload: WebhookPayload) => {
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
		failed: "cancelled",
		pending: "active",
	};

	let status = "active";
	if (eventType?.includes("subscription")) {
		status = statusMap[eventData.status] || "active";
	} else if (eventType === "payment.succeeded" && eventData.subscription_id) {
		status = "active";
	} else if (eventType === "payment.failed" && eventData.subscription_id) {
		status = "on_hold";
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

	const planIdFromMetadata = eventData.metadata?.plan_id;
	const billingPeriodFromMetadata = eventData.metadata?.billing_period;

	let planId = "basic";
	if (planIdFromMetadata) {
		planId = planIdFromMetadata;
	}

	const billingPeriod = billingPeriodFromMetadata || "monthly";

	const currentPeriodStart = eventData.current_period_start
		? new Date(
			typeof eventData.current_period_start === "number"
				? eventData.current_period_start * 1000
				: eventData.current_period_start,
		)
		: new Date();

	const currentPeriodEnd = eventData.current_period_end
		? new Date(
			typeof eventData.current_period_end === "number"
				? eventData.current_period_end * 1000
				: eventData.current_period_end,
		)
		: new Date();

	const cancelledAt = eventData.cancelled_at
		? new Date(
			typeof eventData.cancelled_at === "number"
				? eventData.cancelled_at * 1000
				: eventData.cancelled_at,
		)
		: null;

	const subscriptionRecord: any = {
		subscriptionId: subscriptionId,
		customerId: customerId || undefined,
		status,
		currentPeriodStart,
		currentPeriodEnd,
		cancelAtPeriodEnd: eventData.cancel_at_period_end ?? false,
		cancelledAt,
		planId,
		billingPeriod,
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

