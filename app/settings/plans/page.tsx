"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import createCheckoutSession from "@/app/(server)/actions/subscriptions/createCheckoutSession";
import BillingToggle from "@/components/plans/BillingToggle";
import CurrentSubscriptionCard from "@/components/plans/CurrentSubscriptionCard";
import PlanCard from "@/components/plans/PlanCard";
import SubscriptionHistory from "@/components/plans/SubscriptionHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLANS } from "@/constants";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { useSubscriptionHistory } from "@/hooks/queries/useSubscriptionHistory";
import { getPlanDisplayName } from "@/lib/utils/subscriptions";
import { Plan } from "@/types";
import type { BillingPeriod, SubscriptionName } from "@/types/subscription";
import BackButton from "~/BackButton";

const PlansPage = () => {
	const { subscription, isLoading: subscriptionLoading, isActive } = useSubscription();
	const { subscriptionHistory, isLoading: isHistoryLoading } = useSubscriptionHistory(
		isActive && !!subscription,
	);
	const [isYearly, setIsYearly] = useState(subscription?.billingPeriod === "yearly");
	const [isLoading, setIsLoading] = useState(false);
	const [showChangePlan, setShowChangePlan] = useState(false);

	useEffect(() => {
		if (subscription?.billingPeriod) {
			setIsYearly(subscription.billingPeriod === "yearly");
		}
	}, [subscription?.billingPeriod]);

	const currentPlanProductId = subscription?.productId || null;
	const isCurrentBillingPeriod =
		subscription?.billingPeriod === (isYearly ? "yearly" : "monthly");

	const findPlanByProductId = (productId: string): Plan | null => {
		return PLANS.find((plan) => plan.id === productId) || null;
	};

	const planNameToSubscriptionName = (planName: string): SubscriptionName | null => {
		const normalized = planName.toLowerCase();
		if (normalized === "basic" || normalized === "pro" || normalized === "enterprise") {
			return normalized as SubscriptionName;
		}
		return null;
	};

	const getPlanTier = (planName: SubscriptionName): number => {
		const plan = PLANS.find((p) => planNameToSubscriptionName(p.name) === planName);
		return plan ? PLANS.indexOf(plan) + 1 : 0;
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
		const plan = findPlanByProductId(planId);
		const planName = plan ? planNameToSubscriptionName(plan.name) : null;

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
			const plan = findPlanByProductId(planId);

			if (!plan) {
				toast.error("Invalid plan selected");
				return;
			}

			const planName = planNameToSubscriptionName(plan.name);
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
								<h1 className="font-semibold text-base md:text-2xl">
									Plans & Billing
								</h1>
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
					<>
						<CurrentSubscriptionCard
							subscription={subscription}
							onManageClick={handleOpenCustomerPortal}
							planName={getPlanDisplayName(subscription.planName)}
						/>

						{!showChangePlan && (
							<>
								<div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 md:p-4">
									<div className="min-w-0 flex-1">
										<h3 className="font-semibold text-sm md:text-base">
											Subscription History
										</h3>
										<p className="text-muted-foreground text-xs md:text-sm">
											View all your past and current subscriptions
										</p>
									</div>
									<Button
										onClick={() => setShowChangePlan(true)}
										variant="outline"
										className="h-9 shrink-0 text-xs md:h-10 md:text-sm"
									>
										Change Plan
									</Button>
								</div>

								{isHistoryLoading ? (
									<Card className="border-border">
										<CardContent className="px-3 py-6 md:px-6 md:py-8">
											<p className="text-center text-muted-foreground text-xs md:text-sm">
												Loading subscription history...
											</p>
										</CardContent>
									</Card>
								) : (
									<SubscriptionHistory
										subscriptions={subscriptionHistory}
										formatPrice={formatPrice}
									/>
								)}
							</>
						)}

						{showChangePlan && (
							<div className="space-y-3 md:space-y-4">
								<div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 md:p-4">
									<div className="min-w-0 flex-1">
										<h3 className="font-semibold text-sm md:text-base">
											Change Your Plan
										</h3>
										<p className="text-muted-foreground text-xs md:text-sm">
											Select a new plan to upgrade or downgrade
										</p>
									</div>
									<Button
										onClick={() => setShowChangePlan(false)}
										variant="outline"
										className="h-9 shrink-0 text-xs md:h-10 md:text-sm"
									>
										Cancel
									</Button>
								</div>

								<BillingToggle isYearly={isYearly} onChange={setIsYearly} />

								<div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
									{PLANS.map((plan) => {
										const isCurrentPlan =
											currentPlanProductId === plan.id &&
											isCurrentBillingPeriod;
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
										All plans include a 14-day free trial. Cancel anytime. No
										credit card required for trial.
									</p>
								</div>
							</div>
						)}
					</>
				)}

				{(!subscription || !isActive) && (
					<>
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
								All plans include a 14-day free trial. Cancel anytime. No credit
								card required for trial.
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PlansPage;
