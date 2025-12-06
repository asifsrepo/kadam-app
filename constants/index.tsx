import { Crown, Sparkles, Zap } from "lucide-react";
import { Plan } from "@/types";

export const APP_NAME = "Hysabee";
export const APP_URL = "https://hysabee.com";

export const PLANS: Plan[] = [
	{
		id: "pdt_JceCn4OiEZ625soqXm2BR",
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
		id: "pdt_sW8b7BMWOAgX1cq0T9vVD",
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
