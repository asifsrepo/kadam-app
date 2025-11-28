import { CustomerPortal } from "@dodopayments/nextjs";
import { DODO_PAYMENTS_API_KEY, DODO_PAYMENTS_ENVIRONMENT } from "@/config";

export const GET = CustomerPortal({
	bearerToken: DODO_PAYMENTS_API_KEY,
	environment: DODO_PAYMENTS_ENVIRONMENT,
});

