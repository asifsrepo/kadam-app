"use client";

import SignInDialog from "@/components/auth/SignInDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";

const page = () => {
	const { setSigninDialogOpen } = useAuth();
	
	
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<h1 className="font-bold text-2xl">Welcome</h1>
				<Button onClick={() => setSigninDialogOpen(true)}>Sign In</Button>
			</div>

			<SignInDialog />
		</div>
	);
};
export default page;
