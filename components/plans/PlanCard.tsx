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
	isYearly: boolean;
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
	isYearly,
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
	const includedFeatures = plan.features.filter((f) => f.included);

	return (
		<Card
			className={`relative flex flex-col transition-all ${
				isCurrentPlan
					? "border-primary shadow-lg ring-2 ring-primary/20"
					: isPopular
						? "border-primary shadow-lg md:scale-105"
						: "border-border hover:border-primary/50"
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

			<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
				<div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
					<div
						className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg md:h-10 md:w-10 ${
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

			<CardContent className="flex-1 space-y-3 px-3 md:space-y-4 md:px-6">
				<div className="space-y-0.5 md:space-y-1">
					<div className="flex items-baseline gap-1.5 md:gap-2">
						<span className="font-bold text-2xl md:text-3xl">
							{formatPrice(currentPrice)}
						</span>
						<span className="text-muted-foreground text-xs md:text-sm">
							/{isYearly ? "year" : "month"}
						</span>
					</div>
					{savings > 0 && (
						<p className="text-[10px] text-muted-foreground md:text-xs">
							Save {formatPrice(savings)} per year
						</p>
					)}
				</div>

				<Separator />

				<div className="space-y-2 md:space-y-2.5">
					{includedFeatures.map((feature, index) => (
						<div key={index} className="flex items-start gap-2 md:gap-2.5">
							<div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-5 md:w-5">
								<Check className="h-2.5 w-2.5 text-primary md:h-3 md:w-3" />
							</div>
							<span className="text-foreground text-xs leading-relaxed md:text-sm">
								{feature.text}
							</span>
						</div>
					))}
				</div>
			</CardContent>

			<CardFooter className="px-3 pt-3 pb-3 md:px-6 md:pt-4 md:pb-6">
				<Button
					onClick={() => onSubscribe(planId)}
					variant={isCurrentPlan ? "secondary" : isPopular ? "default" : "outline"}
					className="h-9 w-full text-xs md:h-10 md:text-sm"
					disabled={isDisabled}
				>
					{buttonText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PlanCard;
