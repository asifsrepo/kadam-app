"use client";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import BackButton from "~/BackButton";

interface PlanFeature {
	text: string;
	included: boolean;
}

interface Plan {
	id: string;
	name: string;
	description: string;
	icon: typeof Zap;
	monthlyPrice: number;
	yearlyPrice: number;
	features: PlanFeature[];
	popular?: boolean;
	badge?: string;
}

const PlansPage = () => {
	const [isYearly, setIsYearly] = useState(false);

	const plans: Plan[] = [
		{
			id: "basic",
			name: "Basic",
			description: "Perfect for small stores getting started",
			icon: Zap,
			monthlyPrice: 9.99,
			yearlyPrice: 99.99,
			features: [
				{ text: "Up to 100 customers", included: true },
				{ text: "1 store location", included: true },
				{ text: "Basic debt tracking", included: true },
				{ text: "Payment history", included: true },
				{ text: "Email support", included: true },
				{ text: "Multiple branches", included: false },
				{ text: "Advanced analytics", included: false },
				{ text: "Priority support", included: false },
			],
		},
		{
			id: "pro",
			name: "Pro",
			description: "Best for growing businesses",
			icon: Sparkles,
			monthlyPrice: 19.99,
			yearlyPrice: 199.99,
			popular: true,
			badge: "Most Popular",
			features: [
				{ text: "Unlimited customers", included: true },
				{ text: "Up to 5 store locations", included: true },
				{ text: "Advanced debt tracking", included: true },
				{ text: "Payment history & reports", included: true },
				{ text: "SMS notifications", included: true },
				{ text: "Multiple branches", included: true },
				{ text: "Advanced analytics", included: true },
				{ text: "Priority support", included: true },
			],
		},
		{
			id: "enterprise",
			name: "Enterprise",
			description: "For large operations with multiple stores",
			icon: Crown,
			monthlyPrice: 49.99,
			yearlyPrice: 499.99,
			features: [
				{ text: "Unlimited customers", included: true },
				{ text: "Unlimited store locations", included: true },
				{ text: "Advanced debt tracking", included: true },
				{ text: "Custom reports & analytics", included: true },
				{ text: "SMS & Email notifications", included: true },
				{ text: "Multiple branches", included: true },
				{ text: "Advanced analytics", included: true },
				{ text: "Dedicated support", included: true },
				{ text: "Custom integrations", included: true },
				{ text: "API access", included: true },
			],
		},
	];

	const handleSubscribe = (planId: string) => {
		// TODO: Implement subscription logic
		console.log(`Subscribe to ${planId} - ${isYearly ? "Yearly" : "Monthly"}`);
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
				{/* Billing Toggle */}
				<div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-2.5 md:gap-3 md:p-4">
					<span
						className={`font-medium text-xs md:text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
					>
						Monthly
					</span>
					<Switch checked={isYearly} onCheckedChange={setIsYearly} />
					<div className="flex items-center gap-1 md:gap-1.5">
						<span
							className={`font-medium text-xs md:text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
						>
							Yearly
						</span>
						{isYearly && (
							<Badge
								variant="secondary"
								className="px-1.5 py-0 text-[10px] md:px-2 md:text-xs"
							>
								Save 17%
							</Badge>
						)}
					</div>
				</div>

				{/* Plans Grid */}
				<div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
					{plans.map((plan) => {
						const Icon = plan.icon;
						const currentPrice = getCurrentPrice(plan);
						const savings = getSavings(plan);
						const isPopular = plan.popular;
						const includedFeatures = plan.features.filter((f) => f.included);

						return (
							<Card
								key={plan.id}
								className={`relative flex flex-col transition-all ${
									isPopular
										? "border-primary shadow-lg md:scale-105"
										: "border-border hover:border-primary/50"
								}`}
							>
								{isPopular && (
									<div className="-top-2 -translate-x-1/2 md:-top-3 absolute left-1/2">
										<Badge
											variant="default"
											className="px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs"
										>
											{plan.badge}
										</Badge>
									</div>
								)}

								<CardHeader className="px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-4">
									<div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
										<div
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg md:h-10 md:w-10 ${
												isPopular
													? "bg-primary text-primary-foreground"
													: "bg-primary/10 text-primary"
											}`}
										>
											<Icon className="h-4 w-4 md:h-5 md:w-5" />
										</div>
										<div className="min-w-0 flex-1">
											<CardTitle className="text-base md:text-lg">
												{plan.name}
											</CardTitle>
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
											<div
												key={index}
												className="flex items-start gap-2 md:gap-2.5"
											>
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
										onClick={() => handleSubscribe(plan.id)}
										variant={isPopular ? "default" : "outline"}
										className="h-9 w-full text-xs md:h-10 md:text-sm"
									>
										{isYearly ? "Subscribe Yearly" : "Subscribe Monthly"}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				{/* Additional Info */}
				<div className="rounded-lg border border-border bg-card p-3 md:p-4">
					<p className="text-center text-[10px] text-muted-foreground leading-relaxed md:text-sm md:text-xs">
						All plans include a 14-day free trial. Cancel anytime. No credit card
						required for trial.
					</p>
				</div>
			</div>
		</div>
	);
};

export default PlansPage;
