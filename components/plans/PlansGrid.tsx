import { PLANS } from "@/constants";
import type { Plan } from "@/types";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";

interface PlansGridProps {
	isYearly: boolean;
	onBillingToggleChange: (checked: boolean) => void;
	currentPlanProductId: string | null;
	isCurrentBillingPeriod: boolean;
	isLoading: boolean;
	onSubscribe: (planId: string) => void;
	formatPrice: (price: number) => string;
	getCurrentPrice: (plan: Plan) => number;
	getSavings: (plan: Plan) => number;
	getButtonText: (planId: string) => string;
}

const PlansGrid = ({
	isYearly,
	onBillingToggleChange,
	currentPlanProductId,
	isCurrentBillingPeriod,
	isLoading,
	onSubscribe,
	formatPrice,
	getCurrentPrice,
	getSavings,
	getButtonText,
}: PlansGridProps) => {
	return (
		<>
			<BillingToggle isYearly={isYearly} onChange={onBillingToggleChange} />

			<div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
				{PLANS.map((plan) => {
					const planId = isYearly ? plan.yearlyPlanId : plan.monthlyPlanId;
					const isCurrentPlan = currentPlanProductId === planId && isCurrentBillingPeriod;
					const buttonText = getButtonText(planId);
					const isDisabled = isCurrentPlan || isLoading;

					return (
						<PlanCard
							key={plan.name}
							plan={plan}
							isCurrentPlan={isCurrentPlan}
							isPopular={plan.popular || false}
							buttonText={isLoading ? "Loading..." : buttonText}
							isDisabled={isDisabled}
							onSubscribe={onSubscribe}
							formatPrice={formatPrice}
							getCurrentPrice={getCurrentPrice}
							getSavings={getSavings}
							planId={planId}
						/>
					);
				})}
			</div>

		</>
	);
};

export default PlansGrid;
