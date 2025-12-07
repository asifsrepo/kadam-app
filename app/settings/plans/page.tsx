"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { changePlan, createCheckoutSession } from "@/app/(server)/actions/subscriptions";
import ActionRequiredCard from "@/components/plans/ActionRequiredCard";
import ChangePlanSection from "@/components/plans/ChangePlanSection";
import CurrentSubscriptionCard from "@/components/plans/CurrentSubscriptionCard";
import ExpiredSubscriptionCard from "@/components/plans/ExpiredSubscriptionCard";
import NewSubscriptionView from "@/components/plans/NewSubscriptionView";
import PlansPageHeader from "@/components/plans/PlansPageHeader";
import SubscriptionHistorySection from "@/components/plans/SubscriptionHistorySection";
import { PLANS } from "@/constants";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { useSubscriptionHistory } from "@/hooks/queries/useSubscriptionHistory";
import { getPlanDisplayName } from "@/lib/utils/subscriptions";
import type { Plan } from "@/types";
import type { BillingPeriod, SubscriptionName } from "@/types/subscription";

const PlansPage = () => {
	const {
		subscription,
		isLoading: subscriptionLoading,
		isActive,
		refetch: refetchSubscription,
	} = useSubscription();

	const { subscriptionHistory, isLoading: isHistoryLoading } = useSubscriptionHistory(
		!!subscription,
	);

	const [isYearly, setIsYearly] = useState(subscription?.billingPeriod === "yearly");
	const [isLoading, setIsLoading] = useState(false);
	const [showChangePlan, setShowChangePlan] = useState(false);

	useEffect(() => {
		if (subscription?.billingPeriod) {
			setIsYearly(subscription.billingPeriod === "yearly");
		}
	}, [subscription?.billingPeriod]);

	const status = subscription?.status;
	const isPastDue = status === "past_due";
	const isOnHold = status === "on_hold";
	const isExpired = status === "expired";
	const requiresAction = isPastDue || isOnHold;
	const hasSubscription = subscription && (isActive || isPastDue || isOnHold || isExpired);
	const currentPlanProductId = subscription?.productId ?? null;
	const isCurrentBillingPeriod =
		subscription?.billingPeriod === (isYearly ? "yearly" : "monthly");

	const findPlanByProductId = (productId: string) =>
		PLANS.find((plan) => plan.id === productId) ?? null;

	const planNameToSubscriptionName = (planName: string): SubscriptionName | null => {
		const normalized = planName.toLowerCase();
		if (["basic", "pro", "enterprise"].includes(normalized)) {
			return normalized as SubscriptionName;
		}
		return null;
	};

	const getPlanTier = (planName: SubscriptionName) => {
		const plan = PLANS.find((p) => planNameToSubscriptionName(p.name) === planName);
		return plan ? PLANS.indexOf(plan) + 1 : 0;
	};

	const getButtonText = (planId: string): string => {
		if (!isActive) {
			return isYearly ? "Subscribe Yearly" : "Subscribe Monthly";
		}

		if (currentPlanProductId === planId && isCurrentBillingPeriod) {
			return "Current Plan";
		}

		const plan = findPlanByProductId(planId);
		const planName = plan ? planNameToSubscriptionName(plan.name) : null;

		if (!planName || !subscription?.planName) {
			return isYearly ? "Subscribe Yearly" : "Subscribe Monthly";
		}

		const currentTier = getPlanTier(subscription.planName);
		const planTier = getPlanTier(planName);

		if (planTier > currentTier) return "Upgrade";
		if (planTier < currentTier) return "Downgrade";
		return isYearly ? "Switch to Yearly" : "Switch to Monthly";
	};

	const handleCheckout = (checkoutUrl: string | undefined) => {
		if (checkoutUrl) {
			window.location.href = checkoutUrl;
		} else {
			toast.error("Invalid checkout URL received");
		}
	};

	const handleSubscribe = async (planId: string) => {
		if (isLoading) return;

		if (isActive && currentPlanProductId === planId && isCurrentBillingPeriod) {
			toast.info("This is your current plan");
			return;
		}

		setIsLoading(true);

		const billingPeriod: BillingPeriod = isYearly ? "yearly" : "monthly";
		const plan = findPlanByProductId(planId);
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
		} else {
			handleCheckout(data?.checkout_url);
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
		} else {
			handleCheckout(data?.checkout_url);
		}
		setIsLoading(false);
	};

	const formatPrice = (price: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(price);

	const getCurrentPrice = (plan: Plan) =>
		isYearly ? plan.yearlyPrice : plan.monthlyPrice;

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
				{hasSubscription && (
					<>
						<CurrentSubscriptionCard
							subscription={subscription}
							onManageClick={handleOpenCustomerPortal}
							planName={getPlanDisplayName(subscription.planName)}
						/>

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

						{!showChangePlan && isActive && (
							<SubscriptionHistorySection
								onChangePlanClick={() => setShowChangePlan(true)}
								isHistoryLoading={isHistoryLoading}
								subscriptionHistory={subscriptionHistory}
								formatPrice={formatPrice}
							/>
						)}

						{showChangePlan && (
							<ChangePlanSection
								onCancel={() => setShowChangePlan(false)}
								isYearly={isYearly}
								onBillingToggleChange={setIsYearly}
								currentPlanProductId={currentPlanProductId}
								isCurrentBillingPeriod={isCurrentBillingPeriod}
								isLoading={isLoading}
								onSubscribe={handleSubscribe}
								formatPrice={formatPrice}
								getCurrentPrice={getCurrentPrice}
								getSavings={getSavings}
								getButtonText={getButtonText}
							/>
						)}
					</>
				)}

				{!hasSubscription && (
					<NewSubscriptionView
						isYearly={isYearly}
						onBillingToggleChange={setIsYearly}
						currentPlanProductId={currentPlanProductId}
						isCurrentBillingPeriod={isCurrentBillingPeriod}
						isLoading={isLoading}
						onSubscribe={handleSubscribe}
						formatPrice={formatPrice}
						getCurrentPrice={getCurrentPrice}
						getSavings={getSavings}
						getButtonText={getButtonText}
					/>
				)}
			</div>
		</div>
	);
};

export default PlansPage;
