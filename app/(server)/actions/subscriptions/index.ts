"use server";

import DodoPayments from "dodopayments";
import {
	DODO_PAYMENTS_API_KEY,
	DODO_PAYMENTS_ENVIRONMENT,
	DODO_PAYMENTS_RETURN_URL,
} from "@/config";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables } from "@/types";
import type { BillingPeriod, SubscriptionName } from "@/types/subscription";

interface CreateCheckoutSessionParams {
	productId: string;
	billingPeriod: BillingPeriod;
	planName: SubscriptionName;
}

const client = new DodoPayments({
	bearerToken: DODO_PAYMENTS_API_KEY,
	environment: DODO_PAYMENTS_ENVIRONMENT,
});

export const createCheckoutSession = async ({
	productId,
	billingPeriod,
	planName,
}: CreateCheckoutSessionParams) => {
	return await tryCatch<{ checkout_url: string }>(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { data: profile } = await supabase
			.from(Tables.UserProfiles)
			.select("name, phone")
			.eq("id", user.id)
			.single();

		const session = await client.checkoutSessions.create({
			product_cart: [
				{
					product_id: productId,
					quantity: 1,
				},
			],
			customer: {
				email: user.email || "",
				name: profile?.name || user.user_metadata?.name || "",
			},
			return_url: DODO_PAYMENTS_RETURN_URL || undefined,
			metadata: {
				user_id: user.id,
				plan_name: planName,
				billing_period: billingPeriod,
			},
		});

		if (!session.checkout_url) {
			throw new Error("Invalid response from Dodo Payments API");
		}

		return session;
	});
};

interface ChangePlanParams {
	subscriptionId: string;
	productId: string;
	prorationMode?: "prorated_immediately" | "full_immediately" | "difference_immediately";
}

export const changePlan = async ({
	subscriptionId,
	productId,
	prorationMode = "prorated_immediately",
}: ChangePlanParams) => {
	return await tryCatch(async () => {
		const session = await client.subscriptions.changePlan(subscriptionId, {
			product_id: productId,
			proration_billing_mode: prorationMode,
			quantity: 1,
		});

		return session;
	});
};
