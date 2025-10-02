"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import LoadingOverlay from "~/LoadingOverlay";

const SignInDialog = () => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const supabase = createClient();
	const { isSigninDialogOpen, setSigninDialogOpen, initialize } = useAuth();

	const handleOAuthSignIn = async (provider: "github" | "google") => {
		setIsLoading(provider);

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
			});

			if (error) throw error;

			await initialize();

			toast.success(`Redirecting to ${provider}...`);
			setSigninDialogOpen(false);
		} catch (error) {
			toast.error("Sign in failed", {
				description: error instanceof Error ? error.message : "Please try again later.",
			});
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<Dialog open={isSigninDialogOpen} onOpenChange={setSigninDialogOpen}>
			<DialogContent className="p-6 sm:max-w-[500px]">
				<DialogHeader className="text-center">
					<DialogTitle className="font-bold text-2xl">Sign In</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						Choose your preferred method to sign in.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-3 py-5">
					<Button
						variant="outline"
						type="button"
						onClick={() => handleOAuthSignIn("github")}
						className="flex h-11 items-center gap-2"
						disabled={isLoading !== null}
					>
						<Github size={18} />
						Continue with GitHub
					</Button>

					<Button
						variant="outline"
						type="button"
						onClick={() => handleOAuthSignIn("google")}
						className="flex h-11 items-center gap-2"
						disabled={isLoading !== null}
					>
						<Image alt="Google" src="/assets/google.svg" width={18} height={18} />
						Continue with Google
					</Button>
				</div>
			</DialogContent>

			<LoadingOverlay isLoading={isLoading !== null} />
		</Dialog>
	);
};

export default memo(SignInDialog);
