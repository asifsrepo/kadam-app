"use server";

import DodoPayments from "dodopayments";
import {
	DODO_PAYMENTS_API_KEY,
	DODO_PAYMENTS_RETURN_URL,
} from "@/config";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables } from "@/types";
import type { BillingPeriod, SubscriptionPlan } from "@/types/subscription";

interface CreateCheckoutSessionParams {
	planId: SubscriptionPlan;
	billingPeriod: BillingPeriod;
}

const createCheckoutSession = async ({
	planId,
	billingPeriod,
}: CreateCheckoutSessionParams) => {
	return await tryCatch<{ checkout_url: string }>(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		// Get user profile for name and email
		const { data: profile } = await supabase
			.from(Tables.UserProfiles)
			.select("name, phone")
			.eq("id", user.id)
			.single();

		// Get product ID based on plan and billing period
		// This should match the product IDs configured in Dodo Payments dashboard
		const productId = `${planId}`;

		// Initialize Dodo Payments client
		const client = new DodoPayments({
			bearerToken: DODO_PAYMENTS_API_KEY,
			environment:"test_mode"
		});

		// Create checkout session using SDK
		// Reference: https://docs.dodopayments.com/developer-resources/subscription-integration-guide
		const session = await client.checkoutSessions.create({
			product_cart: [
				{
					product_id: productId,
					quantity: 1,
				},
			],
			// Optional: configure trials for subscription products
			subscription_data: {
				// trial_period_days: 14, // Uncomment if you want to add trial period
			},
			customer: {
				email: user.email || "",
				name: profile?.name || user.user_metadata?.name || "",
			},
			return_url: DODO_PAYMENTS_RETURN_URL || undefined,
			metadata: {
				user_id: user.id,
				plan_id: planId,
				billing_period: billingPeriod,
			},
		});

		if (!session.checkout_url) {
			throw new Error("Invalid response from Dodo Payments API");
		}

		return session;
	});
};

export default createCheckoutSession;

