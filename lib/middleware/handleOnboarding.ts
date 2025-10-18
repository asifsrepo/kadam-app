import { NextRequest } from "next/server";
import { continueNext, redirectTo } from "./utils";

const handleOnboarding = (request: NextRequest, user: any) => {
	const pathname = request.nextUrl.pathname;
	const isOnboarded = user?.user_metadata?.is_onboarded;
	const onboardingStep = user?.user_metadata?.onboarding_step || 1;

	if (!user || !user.user_metadata) {
		return redirectTo(request, "/auth");
	}

	if (!isOnboarded) {
		if (pathname === "/onboarding") {
			return continueNext();
		}
		return redirectTo(request, `/onboarding?step=${onboardingStep}`);
	}

	if (isOnboarded) {
		if (pathname === "/onboarding") {
			return redirectTo(request, "/");
		}

		return continueNext();
	}
};

export default handleOnboarding;
