import { Sparkles, Zap } from "lucide-react";
import { Plan } from "@/types";

export const APP_NAME = "Hysabee";
export const APP_URL = "https://hysabee.com";

export const PLANS: Plan[] = [
	{
		monthlyPlanId: "pdt_4QFHoFHTe9GhL5XIYg0lB",
		yearlyPlanId:"pdt_01J01010101010101010101",
		name: "Basic",
		description: "Perfect for small businesses getting started",
		icon: Zap,
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: [
			{ text: "Up to 10 customers", included: true },
			{ text: "1 Branch", included: true },
			{ text: "Basic credit tracking", included: true },
			{ text: "Simple report", included: false },
		],
	},
	{
		monthlyPlanId: "pdt_aJADFFMPqBp7aLSkIoptV",
		yearlyPlanId: "pdt_7v1F4G8bevfSGUeGOCfXE",
		name: "Pro",
		description: "Best for growing businesses",
		icon: Sparkles,
		monthlyPrice: 77.00,
		yearlyPrice: 56.00,
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
	}
];
