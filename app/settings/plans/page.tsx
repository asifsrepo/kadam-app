"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { changePlan, createCheckoutSession } from "@/app/(server)/actions/subscriptions";
import ActionRequiredCard from "@/components/plans/ActionRequiredCard";
import BillingToggle from "@/components/plans/BillingToggle";
import ExpiredSubscriptionCard from "@/components/plans/ExpiredSubscriptionCard";
import PlanCard from "@/components/plans/PlanCard";
import PlansPageHeader from "@/components/plans/PlansPageHeader";
import TrialInfoCard from "@/components/plans/TrialInfoCard";
import { PLANS } from "@/constants";
import { useSubscription } from "@/hooks/queries/useSubscription";
import type { Plan } from "@/types";
import type { BillingPeriod, SubscriptionName } from "@/types/subscription";

const PlansPage = () => {
	const { subscription, isLoading: subscriptionLoading, isActive, refetch: refetchSubscription } =
		useSubscription();

	const status = subscription?.status;
	const isPastDue = status === "past_due";
	const isOnHold = status === "on_hold";
	const isExpired = status === "expired";
	const requiresAction = isPastDue || isOnHold;

	const [isYearly, setIsYearly] = useState(subscription?.billingPeriod === "yearly");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (subscription?.billingPeriod) {
			setIsYearly(subscription.billingPeriod === "yearly");
		}
	}, [subscription?.billingPeriod]);

	const currentPlanProductId = subscription?.productId ?? null;
	const isCurrentBillingPeriod =
		subscription?.billingPeriod === (isYearly ? "yearly" : "monthly");

	const planNameToSubscriptionName = (planName: string): SubscriptionName | null => {
		const normalized = planName.toLowerCase();
		if (["basic", "pro", "enterprise"].includes(normalized)) {
			return normalized as SubscriptionName;
		}
		return null;
	};

	const getButtonText = (planId: string): string => {
		if (isActive && currentPlanProductId === planId && isCurrentBillingPeriod) {
			return "Current Plan";
		}
		return isYearly ? "Subscribe Yearly" : "Subscribe Monthly";
	};

	const handleSubscribe = async (planId: string) => {
		if (isLoading) return;

		if (isActive && currentPlanProductId === planId && isCurrentBillingPeriod) {
			toast.info("This is your current plan");
			return;
		}

		setIsLoading(true);

		const billingPeriod: BillingPeriod = isYearly ? "yearly" : "monthly";
		const plan = PLANS.find((p) => p.id === planId);
		const planName = plan ? planNameToSubscriptionName(plan.name) : null;

		if (!plan || !planName) {
			toast.error("Invalid plan selected");
			setIsLoading(false);
			return;
		}

		// Change plan if active subscription with same billing period
		if (
			isActive &&
			subscription?.subscriptionId &&
			subscription.billingPeriod === billingPeriod &&
			currentPlanProductId !== planId
		) {
			const { error } = await changePlan({
				subscriptionId: subscription.subscriptionId,
				productId: planId,
				prorationMode: "prorated_immediately",
			});

			if (error) {
				toast.error("Failed to change plan", { description: error });
			} else {
				toast.success("Plan changed successfully");
				await refetchSubscription();
			}
			setIsLoading(false);
			return;
		}

		// Create checkout session for new subscriptions or billing period changes
		const { data, error } = await createCheckoutSession({
			productId: planId,
			billingPeriod,
			planName,
		});

		if (error) {
			toast.error("Failed to create checkout session", { description: error });
		} else if (data?.checkout_url) {
			window.location.href = data.checkout_url;
		} else {
			toast.error("Invalid checkout URL received");
		}

		setIsLoading(false);
	};

	const handleOpenCustomerPortal = () => {
		if (!subscription?.customerId) {
			toast.error("Customer ID not found");
			return;
		}
		window.location.href = `/customer-portal?customer_id=${subscription.customerId}`;
	};

	const handleRenewSubscription = async () => {
		if (isLoading || !subscription) return;

		setIsLoading(true);
		const { data, error } = await createCheckoutSession({
			productId: subscription.productId,
			billingPeriod: subscription.billingPeriod,
			planName: subscription.planName,
		});

		if (error) {
			toast.error("Failed to create checkout session", { description: error });
		} else if (data?.checkout_url) {
			window.location.href = data.checkout_url;
		} else {
			toast.error("Invalid checkout URL received");
		}
		setIsLoading(false);
	};

	const formatPrice = (price: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(price);

	const getCurrentPrice = (plan: Plan) => (isYearly ? plan.yearlyPrice : plan.monthlyPrice);

	const getSavings = (plan: Plan) => {
		if (!isYearly) return 0;
		const savings = plan.monthlyPrice * 12 - plan.yearlyPrice;
		return savings > 0 ? savings : 0;
	};

	if (subscriptionLoading) {
		return (
			<div className="min-h-screen bg-background pb-24">
				<PlansPageHeader subtitle="Loading..." />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			<PlansPageHeader />

			<div className="flex flex-col gap-3 p-3 md:gap-4 md:p-6">
				{requiresAction && (
					<ActionRequiredCard
						isPastDue={isPastDue}
						onUpdatePayment={handleOpenCustomerPortal}
					/>
				)}

				{isExpired && (
					<ExpiredSubscriptionCard
						onRenew={handleRenewSubscription}
						isLoading={isLoading}
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

				<TrialInfoCard />
			</div>
		</div>
	);
};

export default PlansPage;
