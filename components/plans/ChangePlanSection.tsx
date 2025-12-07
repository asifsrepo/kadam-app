import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants";
import type { Plan } from "@/types";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import TrialInfoCard from "./TrialInfoCard";

interface ChangePlanSectionProps {
	onCancel: () => void;
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

const ChangePlanSection = ({
	onCancel,
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
}: ChangePlanSectionProps) => {
	return (
		<div className="space-y-3 md:space-y-4">
			<div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 md:p-4">
				<div className="min-w-0 flex-1">
					<h3 className="font-semibold text-sm md:text-base">Change Your Plan</h3>
					<p className="text-muted-foreground text-xs md:text-sm">
						Select a new plan to upgrade or downgrade
					</p>
				</div>
				<Button
					onClick={onCancel}
					variant="outline"
					className="h-9 shrink-0 text-xs md:h-10 md:text-sm"
				>
					Cancel
				</Button>
			</div>

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

			<TrialInfoCard />
		</div>
	);
};

export default ChangePlanSection;
