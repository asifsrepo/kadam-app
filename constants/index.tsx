import { Sparkles, Zap } from "lucide-react";
import { Plan } from "@/types";

export const APP_NAME = "Hysabee";
export const APP_URL = "https://hysabee.com";

export const PLANS: Plan[] = [
	{
		monthlyPlanId: "pdt_4QFHoFHTe9GhL5XIYg0lB",
		yearlyPlanId: "pdt_4QFHoFHTe9GhL5XIYg0lB",
		name: "Basic",
		description: "Perfect for small businesses getting started",
		icon: Zap,
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: ["Up to 10 customers", "1 Branch", "Basic credit tracking", "Simple report"],
	},
	{
		monthlyPlanId: "pdt_aJADFFMPqBp7aLSkIoptV",
		yearlyPlanId: "pdt_7v1F4G8bevfSGUeGOCfXE",
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
