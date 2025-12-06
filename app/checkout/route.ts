import { Checkout } from "@dodopayments/nextjs";
import {
	DODO_PAYMENTS_API_KEY,
	DODO_PAYMENTS_ENVIRONMENT,
	DODO_PAYMENTS_RETURN_URL,
} from "@/config";

export const GET = Checkout({
	bearerToken: DODO_PAYMENTS_API_KEY,
	returnUrl: DODO_PAYMENTS_RETURN_URL || undefined,
	environment: DODO_PAYMENTS_ENVIRONMENT,
	type: "static",
});

export const POST = Checkout({
	bearerToken: DODO_PAYMENTS_API_KEY,
	returnUrl: DODO_PAYMENTS_RETURN_URL || undefined,
	environment: DODO_PAYMENTS_ENVIRONMENT,
	type: "session",
});
