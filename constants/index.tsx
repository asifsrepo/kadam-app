import { Sparkles, Zap } from "lucide-react";
import { Plan } from "@/types";

export const APP_NAME = "Hysabee";
export const APP_URL = "https://hysabee.com";

export const PLANS: Plan[] = [
	{
		monthlyPlanId: "pdt_0NVmCRJhqwEHJKhcFUJMS",
		yearlyPlanId: "pdt_0NVmCRJhqwEHJKhcFUJMS",
		name: "Free",
		description: "Perfect for small businesses getting started",
		icon: Zap,
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: ["Up to 10 customers", "1 Branch", "Basic credit tracking", "Simple report"],
	},
	{
		monthlyPlanId: "pdt_0NVmD0xRh36Ahmy3Yvivi",
		yearlyPlanId: "pdt_0NVmD6NExSgqq7QpWY1gj",
		name: "Pro",
		description: "Best for growing businesses",
		icon: Sparkles,
		monthlyPrice: 77.0,
		yearlyPrice: 56.0,
		popular: true,
		badge: "Most Popular",
		features: [
			"Unlimited customers",
			"Multiple branches",
			"Advanced debt tracking",
			"Payment history & reports",
			"Advanced analytics",
			"Priority support",
		],
	},
];
