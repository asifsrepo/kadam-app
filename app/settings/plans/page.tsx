"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import createCheckoutSession from "@/app/(server)/actions/subscriptions/createCheckoutSession";
import BillingToggle from "@/components/plans/BillingToggle";
import CurrentSubscriptionCard from "@/components/plans/CurrentSubscriptionCard";
import PlanCard from "@/components/plans/PlanCard";
import { PLANS } from "@/constants";
import { useSubscription } from "@/hooks/store/useSubscription";
import { getPlanDisplayName } from "@/lib/utils/subscriptions";
import { Plan } from "@/types";
import type { BillingPeriod, SubscriptionName } from "@/types/subscription";
import BackButton from "~/BackButton";

const PlansPage = () => {
	const { subscription, isLoading: subscriptionLoading, isActive } = useSubscription();
	const [isYearly, setIsYearly] = useState(
		subscription?.billingPeriod === "yearly" ? true : false,
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (subscription?.billingPeriod) {
			setIsYearly(subscription.billingPeriod === "yearly");
		}
	}, [subscription?.billingPeriod]);

	// Get current plan product ID from subscription
	const currentPlanProductId = subscription?.productId || null;
	const isCurrentBillingPeriod =
		subscription?.billingPeriod === (isYearly ? "yearly" : "monthly");

	// Map product IDs to plan names for comparison
	const getPlanNameFromProductId = (productId: string): SubscriptionName | null => {
		const productIdToPlan: Record<string, SubscriptionName> = {
			"pdt_JceCn4OiEZ625soqXm2BR": "basic",
			"pdt_sW8b7BMWOAgX1cq0T9vVD": "pro",
			enterprise: "enterprise",
		};
		return productIdToPlan[productId] || null;
	};

	// Get plan tier for upgrade/downgrade comparison
	const getPlanTier = (planName: SubscriptionName): number => {
		const planTiers: Record<SubscriptionName, number> = {
			basic: 1,
			pro: 2,
			enterprise: 3,
		};
		return planTiers[planName] || 0;
	};

	const getButtonText = (planId: string): string => {
		if (!subscription || !isActive) {
			return isYearly ? "Subscribe Yearly" : "Subscribe Monthly";
		}

		const isCurrentPlan = currentPlanProductId === planId && isCurrentBillingPeriod;
		if (isCurrentPlan) {
			return "Current Plan";
		}

		const currentPlanName = subscription.planName;
		const planName = getPlanNameFromProductId(planId);

		if (!planName || !currentPlanName) {
			return isYearly ? "Subscribe Yearly" : "Subscribe Monthly";
		}

		const currentTier = getPlanTier(currentPlanName);
		const planTier = getPlanTier(planName);

		if (planTier > currentTier) {
			return "Upgrade";
		}
		if (planTier < currentTier) {
			return "Downgrade";
		}
		// Same tier but different billing period
		return isYearly ? "Switch to Yearly" : "Switch to Monthly";
	};

	const handleSubscribe = async (planId: string) => {
		if (isLoading) return;

		// If it's the current plan, don't do anything
		if (subscription && isActive && currentPlanProductId === planId && isCurrentBillingPeriod) {
			toast.info("This is your current plan");
			return;
		}

		setIsLoading(true);
		try {
			const billingPeriod: BillingPeriod = isYearly ? "yearly" : "monthly";
			const planName = getPlanNameFromProductId(planId);

			if (!planName) {
				toast.error("Invalid plan selected");
				return;
			}

			const { data, error } = await createCheckoutSession({
				productId: planId,
				billingPeriod,
				planName,
			});

			if (error) {
				toast.error("Failed to create checkout session", {
					description: error,
				});
				return;
			}

			if (data?.checkout_url) {
				window.location.href = data.checkout_url;
			} else {
				toast.error("Invalid checkout URL received");
			}
		} catch (error) {
			console.error("Error creating checkout session:", error);
			toast.error("Failed to create checkout session");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenCustomerPortal = () => {
		if (!subscription?.customerId) {
			toast.error("Customer ID not found");
			return;
		}

		const portalUrl = `/customer-portal?customer_id=${subscription.customerId}`;
		window.location.href = portalUrl;
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(price);
	};

	const getCurrentPrice = (plan: Plan) => {
		return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
	};

	const getSavings = (plan: Plan) => {
		if (isYearly) {
			const monthlyTotal = plan.monthlyPrice * 12;
			const savings = monthlyTotal - plan.yearlyPrice;
			return savings > 0 ? savings : 0;
		}
		return 0;
	};

	if (subscriptionLoading) {
		return (
			<div className="min-h-screen bg-background pb-24">
				<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="px-3 py-2.5 md:px-6 md:py-4">
						<div className="flex items-center gap-2 md:gap-3">
							<BackButton />
							<div className="min-w-0 flex-1">
								<h1 className="font-semibold text-base md:text-2xl">Plans & Billing</h1>
								<p className="truncate text-muted-foreground text-xs md:text-sm">
									Loading...
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-3 py-2.5 md:px-6 md:py-4">
					<div className="flex items-center gap-2 md:gap-3">
						<BackButton />
						<div className="min-w-0 flex-1">
							<h1 className="font-semibold text-base md:text-2xl">Plans & Billing</h1>
							<p className="truncate text-muted-foreground text-xs md:text-sm">
								Choose the perfect plan
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3 p-3 md:gap-4 md:p-6">
				{subscription && isActive && (
					<CurrentSubscriptionCard
						subscription={subscription}
						onManageClick={handleOpenCustomerPortal}
						planName={getPlanDisplayName(subscription.planName)}
					/>
				)}

				<BillingToggle isYearly={isYearly} onChange={setIsYearly} />

				<div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
					{PLANS.map((plan) => {
						const isCurrentPlan =
							currentPlanProductId === plan.id && isCurrentBillingPeriod;
						const buttonText = getButtonText(plan.id);
						const isDisabled = isCurrentPlan || isLoading;

						return (
							<PlanCard
								key={plan.id}
								plan={plan}
								isYearly={isYearly}
								isCurrentPlan={isCurrentPlan}
								isPopular={plan.popular || false}
								buttonText={isLoading ? "Loading..." : buttonText}
								isDisabled={isDisabled}
								onSubscribe={handleSubscribe}
								formatPrice={formatPrice}
								getCurrentPrice={getCurrentPrice}
								getSavings={getSavings}
							/>
						);
					})}
				</div>

				<div className="rounded-lg border border-border bg-card p-3 md:p-4">
					<p className="text-center text-[10px] text-muted-foreground leading-relaxed md:text-xs">
						All plans include a 14-day free trial. Cancel anytime. No credit card
						required for trial.
					</p>
				</div>
			</div>
		</div>
	);
};

export default PlansPage;
