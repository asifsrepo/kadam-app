import { NextRequest } from "next/server";
import { continueNext, redirectTo } from "./utils";


const handleOnboarding = (request: NextRequest, user: any) => {
    if (!user?.user_metadata?.is_onboarded) {
        if (request.nextUrl.pathname === "/onboarding") {
            return continueNext();
        }
        return redirectTo(request, `/onboarding?step=${user?.user_metadata?.onboarding_step || 1}`);
    }
};

export default handleOnboarding;