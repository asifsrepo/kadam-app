import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plan } from "@/types";

interface PlanCardProps {
	plan: Plan;
	isCurrentPlan: boolean;
	isPopular: boolean;
	buttonText: string;
	isDisabled: boolean;
	onSubscribe: (planId: string) => void;
	formatPrice: (price: number) => string;
	getCurrentPrice: (plan: Plan) => number;
	getSavings: (plan: Plan) => number;
	planId: string;
}

const PlanCard = ({
	plan,
	isCurrentPlan,
	isPopular,
	buttonText,
	isDisabled,
	onSubscribe,
	formatPrice,
	getCurrentPrice,
	getSavings,
	planId,
}: PlanCardProps) => {
	const Icon = plan.icon;
	const currentPrice = getCurrentPrice(plan);
	const savings = getSavings(plan);

	// Calculate percentage savings
	const getSavingsPercentage = () => {
		if (savings <= 0 || plan.monthlyPrice <= 0) return 0;
		const yearlyMonthlyCost = plan.monthlyPrice * 12;
		return Math.round((savings / yearlyMonthlyCost) * 100);
	};

	const savingsPercentage = getSavingsPercentage();

	return (
		<Card
			className={`relative flex flex-col border-border/60 transition-colors ${
				isCurrentPlan || isPopular
					? "border-primary shadow-sm"
					: "hover:border-primary/30"
			}`}
		>
			{(isPopular || isCurrentPlan) && (
				<div className="-top-2 -translate-x-1/2 md:-top-3 absolute left-1/2">
					<Badge
						variant="default"
						className="px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs"
					>
						{isCurrentPlan ? "Current Plan" : plan.badge}
					</Badge>
				</div>
			)}

			<CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4">
				<div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
					<div
						className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl md:h-10 md:w-10 ${
							isPopular || isCurrentPlan
								? "bg-primary text-primary-foreground"
								: "bg-primary/10 text-primary"
						}`}
					>
						<Icon className="h-4 w-4 md:h-5 md:w-5" />
					</div>
					<div className="min-w-0 flex-1">
						<CardTitle className="text-base md:text-lg">{plan.name}</CardTitle>
					</div>
				</div>
				<CardDescription className="line-clamp-2 text-xs md:text-sm">
					{plan.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex-1 space-y-3 px-4 md:space-y-4 md:px-6">
				<div className="space-y-0.5 md:space-y-1">
					<div className="flex items-baseline gap-1.5 md:gap-2">
						<span className="font-semibold text-2xl md:text-3xl">
							{formatPrice(currentPrice)}
						</span>
						<span className="text-muted-foreground text-xs md:text-sm">/month</span>
					</div>
					{savingsPercentage > 0 && (
						<p className="text-[10px] text-muted-foreground md:text-xs">
							Save {savingsPercentage}% per year
						</p>
					)}
				</div>

				<Separator />

				<div className="space-y-2 md:space-y-2.5">
					{plan.features.map((feature, index) => (
						<div key={index} className="flex items-start gap-2 md:gap-2.5">
							<div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-5 md:w-5">
								<Check className="h-2.5 w-2.5 text-primary md:h-3 md:w-3" />
							</div>
							<span className="text-foreground text-xs leading-relaxed md:text-sm">
								{feature}
							</span>
						</div>
					))}
				</div>
			</CardContent>

			<CardFooter className="px-4 pt-3 pb-4 md:px-6 md:pt-4 md:pb-6">
				<Button
					onClick={() => onSubscribe(planId)}
					variant={isCurrentPlan ? "secondary" : isPopular ? "default" : "outline"}
					className="h-11 w-full text-xs md:h-11 md:text-sm"
					disabled={isDisabled}
				>
					{buttonText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PlanCard;
