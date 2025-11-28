"use server";

import { BASE_URL } from "@/config";
import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
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

		// Get product ID based on plan and billing period
		// This should match the product IDs configured in Dodo Payments dashboard
		const productId = `${planId}_${billingPeriod}`;

		// Determine the checkout URL - use BASE_URL if available, otherwise construct from request
		const checkoutUrl = BASE_URL
			? `${BASE_URL}/checkout`
			: process.env.NEXT_PUBLIC_BASE_URL
				? `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`
				: "/checkout";

		// Create checkout session via POST to /checkout
		// The checkout route handler will process this and call Dodo Payments API
		const response = await fetch(checkoutUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				product_id: productId,
				metadata: {
					user_id: user.id,
					plan_id: planId,
					billing_period: billingPeriod,
				},
				// For subscription products, include subscription details
				subscription: {
					interval: billingPeriod === "yearly" ? "year" : "month",
					interval_count: 1,
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = "Failed to create checkout session";
			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.message || errorJson.error || errorMessage;
			} catch {
				errorMessage = errorText || errorMessage;
			}
			throw new Error(errorMessage);
		}

		const data = await response.json();
		if (!data.checkout_url) {
			throw new Error("Invalid response from checkout endpoint");
		}

		return data;
	});
};

export default createCheckoutSession;

